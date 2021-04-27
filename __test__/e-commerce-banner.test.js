const request = require('supertest')
const app = require('../app')
const { Banner, sequelize } = require('../models')
const { generateToken } = require('../helpers/jwt')

let id;
let access_token;

beforeAll(() => {
  access_token = generateToken({
    id: 1,
    email: "admin@mail.com",
    role: "admin"
  })
})

afterAll((done) => {
  Banner.destroy({ where: {} })
    .then(data => {
      sequelize.close()
      done()
    })
    .catch(err => {
      done(err)
    })
})

// Testing Product
// GET All Banner -> CRUD -> GET -> /banners/
describe('GET /banners', function() {
  it('should return status 200 with newly created data', function(done) {
    request(app)
      .get('/banners')
      .set('access_token', access_token)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(200)
        expect(Array.isArray(res.body)).toEqual(true)
        done()
      })
  })
})
// No Access Token Get Banner (Failed)
// describe('GET /banners', function() {
//   it('Failed to get banner with status 404', function(done) {
//     request(app)
//       .get('/banners')
//       // .set('access_token', access_token)
//       .end((err, res) => {
//         if(err) {
//           done(err)
//         }
//         expect(res.status).toEqual(404)
//         expect(typeof res.body).toEqual('object')
//         expect(res.body).toHaveProperty('message', 'Invalid Access Token')
//         done()
//       })
//   })
// })
// Create Banner -> CRUD -> POST -> /banners/
describe(`POST /banners`, function() {
  it(`Succes create banners with status 201`, function(done) {
    let banner = {
      title: "3Seconds",
      status: true,
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      UserId: 1,
    }
    request(app)
      .post('/banners')
      .send(banner)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(201)
        expect(typeof res.body).toEqual('object')

        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('title', res.body.title)
        expect(res.body).toHaveProperty('status', res.body.status)
        expect(res.body).toHaveProperty('imageurl', res.body.imageurl)
        expect(res.body).toHaveProperty('UserId', res.body.UserId)
        expect(res.body).toHaveProperty('createdAt')
        expect(res.body).toHaveProperty('updatedAt')

        expect(typeof res.body.id).toEqual('number')

        expect(typeof res.body.createdAt).toEqual('string')
        expect(typeof res.body.updatedAt).toEqual('string')
        id = res.body.id
        done()
      })
  })
})
// No Access Token Create Banner (Failed)
describe(`POST /banners`, function() {
  it(`Failed to create banner with no acces token return status 404`, function(done) {
    let banner = {
      title: "3Seconds",
      status: true,
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      UserId: 1,
    }
    request(app)
      .post('/banners')
      .send(banner)
      // .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(404)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'Invalid Access Token')
        done()
      })
  })
})
// Access token except admin Create Banner (Failed)
describe(`POST /banners`, function() {
  it(`Failed to create banner with no access token except admin and return 401`, function(done) {
    let banner = {
      title: "3Seconds",
      status: true,
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      UserId: 1,
    }
    let customer = generateToken({
      id: 2,
      email: "customer@mail.com",
      role: "customer"
    })
    request(app)
      .post('/banners')
      .send(banner)
      .set('access_token', customer)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(401)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'Not Authorized')
        done()
      })
  })
})
// One of this fields is empty Create Banner (Failed)
describe(`POST /banners`, function() {
  it(`Failed to create banner, one of the fields is empty, return 400`, function(done) {
    let banner = {
      title: "3Seconds",
      status: "true",
      imageurl: "",
      UserId: 1,
    }
    request(app)
      .post('/banners')
      .send(banner)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', expect.any(Array))
        expect(res.body.message.length).toBeGreaterThan(0)
        done()
      })
  })
})
// DataTypes Failed Created Banner
describe(`POST /banners`, function() {
  it(`Failed to create banner with DataTypes for property is false return status 400`, function(done) {
    let banner = {
      title: "3Seconds",
      status: 100,
      imageurl: "",
      UserId: 1,
    }
    request(app)
      .post('/banners')
      .send(banner)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', expect.any(Array))
        expect(res.body.message.length).toBeGreaterThan(0)
        done()
      })
  })
})
// GET Banner By Id -> CRUD -> GET -> /banners/:id
describe(`GET /banners/${id}`, function() {
  it(`Succes get product by id with status 200`, function(done) {
    request(app)
      .get(`/banners/${id}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        
        expect(res.status).toEqual(200)
        expect(typeof res.body).toEqual('object')

        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('title')
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('imageurl')
        expect(res.body).toHaveProperty('UserId')
        expect(res.body).toHaveProperty('createdAt')
        expect(res.body).toHaveProperty('updatedAt')

        expect(typeof res.body.id).toEqual('number')

        expect(typeof res.body.createdAt).toEqual('string')
        expect(typeof res.body.updatedAt).toEqual('string')
        // id = res.body.id
        done()
      })
  })
})
// No Access Token Get Banner by Id (Failed)
describe(`GET /banners/${id}`, function() {
  it(`Failed to get Banner by Id with no access token return status 404`, function(done) {
    request(app)
      .get(`/banners/${id}`)
      // .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }

        expect(res.status).toEqual(404)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'Invalid Access Token')
        done()

      })
  })
})
// Update Banner By Id -> CRUD -> PUT -> /banners/:id
describe(`PUT /banners/${id}`, function() {
  it(`Succes update data with status 200`, function(done) {
    let banner = {
      title: "3Seconds",
      status: false,
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      UserId: 1,
    }
    request(app)
      .put(`/banners/${id}`)
      .send(banner)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }

        expect(res.status).toEqual(200)
        expect(typeof res.body).toEqual('object')

        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('title')
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('imageurl')
        expect(res.body).toHaveProperty('UserId')
        expect(res.body).toHaveProperty('createdAt')
        expect(res.body).toHaveProperty('updatedAt')

        expect(typeof res.body.id).toEqual('number')

        expect(typeof res.body.createdAt).toEqual('string')
        expect(typeof res.body.updatedAt).toEqual('string')
        // id = res.body.id
        done()

      })

  })
})
// No Access Token for Update Banner (Failed)
describe(`PUT /banners/${id}`, function() {
  it(`Failed update banner no access token with status 200`, function(done) {
    let banner = {
      title: "3Seconds",
      status: false,
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      UserId: 1,
    }
    request(app)
      .put(`/banners/${id}`)
      .send(banner)
      // .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }

        expect(res.status).toEqual(404)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'Invalid Access Token')
        done()
      })
  })
})
// Access token except admin Update Banner (Failed)
describe(`PUT /banners/${id}`, function() {
  it(`Failed to Update banner with no access token except admin and return 401`, function(done) {
    let banner = {
      title: "3Seconds",
      status: false,
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      UserId: 1,
    }
    let customer = generateToken({
      id: 2,
      email: "customer@mail.com",
      role: "customer"
    })
    request(app)
      .put(`/banners/${id}`)
      .send(banner)
      .set('access_token', customer)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(401)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'Not Authorized')
        done()
      })
  })
})
// One of this fields is empty Update Banner (Failed)
describe(`PUT /banners/${id}`, function() {
  it(`Failed to Update Banner, one of the fields is empty, return 400`, function(done) {
    let banner = {
      title: "",
      status: "",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      UserId: 1,
    }
    request(app)
      .put(`/banners/${id}`)
      .send(banner)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', expect.any(Array))
        expect(res.body.message.length).toBeGreaterThan(0)
        done()
      })
  })
})
// DataTypes Failed Update Banner
describe(`PUT /banners/${id}`, function() {
  it(`Failed to Update Banner with DataTypes for property is false return status 400`, function(done) {
    let banner = {
      title: "3Seconds",
      status: 100,
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      UserId: 1,
    }
    request(app)
      .put(`/banners/${id}`)
      .send(banner)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', expect.any(Array))
        expect(res.body.message.length).toBeGreaterThan(0)
        done()
      })
  })
})
// Delete Banner By Id -> CRUD -> DESTROY -> /banners/:id
describe(`DELETE /banners/${id}`, function() {
  it(`Success deleting data with status 200`, function(done) {
    request(app)
      .delete(`/banners/${id}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(200)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'banner success to delete')
        done()
      })
  })
})
// Failed to Delete Banner, Access token not admin
describe(`DELETE /banners/${id}`, function() {
  it(`Failed to delete data with no acces token except admin return 401`, function(done) {
    let customer = generateToken({
      id: 2,
      email: "customer@mail.com",
      role: "customer"
    })
    request(app)
      .delete(`/banners/${id}`)
      .set('access_token', customer)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(401)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'Not Authorized')
        done()
      })
  })
})
