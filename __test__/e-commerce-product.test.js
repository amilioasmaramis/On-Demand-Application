const request = require('supertest')
const app = require('../app')
const { Product, sequelize } = require('../models')
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
  Product.destroy({ where: {} })
    .then(data => {
      sequelize.close()
      done()
    })
    .catch(err => {
      done(err)
    })
})

// Testing Product
// Product -> Read All Product
describe('GET /products', function() {
  it('should return status 200 with newly created data', function(done) {
    request(app)
      .get('/products')
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
// No Access Token Get Product (Failed)
// describe('GET /products', function() {
//   it('Failed to get product with status 404', function(done) {
//     request(app)
//       .get('/products')
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
// Create Product -> CRUD -> POST -> /products/
describe(`POST /products`, function() {
  it(`Succes create products with status 201`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: 100000,
      stock: 10,
      UserId: 1,
      category: "fashion"
    }
    request(app)
      .post('/products')
      .send(product)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(201)
        expect(typeof res.body).toEqual('object')

        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('name', res.body.name)
        expect(res.body).toHaveProperty('imageurl', res.body.imageurl)
        expect(res.body).toHaveProperty('price', res.body.price)
        expect(res.body).toHaveProperty('stock', res.body.stock)
        expect(res.body).toHaveProperty('UserId', res.body.UserId)
        expect(res.body).toHaveProperty('category')
        expect(res.body).toHaveProperty('createdAt')
        expect(res.body).toHaveProperty('updatedAt')

        expect(typeof res.body.id).toEqual('number')
        expect(typeof res.body.name).toEqual('string')

        expect(typeof res.body.createdAt).toEqual('string')
        expect(typeof res.body.updatedAt).toEqual('string')
        id = res.body.id
        done()
      })
  })
})
// No Access Token Create Product (Failed)
describe(`POST /products`, function() {
  it(`Failed to create products with no acces token return status 404`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: 100000,
      stock: 10,
      UserId: 1,
      category: "fashion"
    }
    request(app)
      .post('/products')
      .send(product)
      // .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(404)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Invalid Access Token')
        done()
      })
  })
})
// Access token except admin Create Product (Failed)
describe(`POST /products`, function() {
  it(`Failed to create product with no access token except admin and return 401`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: 100000,
      stock: 10,
      UserId: 1,
      category: "fashion"
    }
    let customer = generateToken({
      id: 2,
      email: "customer@mail.com",
      role: "customer"
    })
    request(app)
      .post('/products')
      .send(product)
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
// One of this fields is empty Create Product (Failed)
describe(`POST /products`, function() {
  it(`Failed to create data, one of the fields is empty, return 400`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: '',
      stock: '',
      UserId: 1,
      category: "fashion"
    }
    request(app)
      .post('/products')
      .send(product)
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
// Stock and price under 0 Create Product (Failed)
describe(`POST /products`, function() {
  it(`Failed to create data, price and stock must be greater then 0, return 400`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: -1,
      stock: -1,
      UserId: 1,
      category: "fashion"
    }
    request(app)
      .post('/products')
      .send(product)
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
// DataTypes Failed Created Product
describe(`POST /products`, function() {
  it(`Failed to create data with DataTypes for property is false return status 400`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: "asdsad",
      stock: 10,
      UserId: 1,
      category: "fashion"
    }
    request(app)
      .post('/products')
      .send(product)
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
// GET Product By Id -> CRUD -> GET -> /products/:id
describe(`GET /products/${id}`, function() {
  it(`Succes get product by id with status 200`, function(done) {
    request(app)
      .get(`/products/${id}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }

        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('id')
        
        expect(res.body).toHaveProperty('name')
        expect(res.body).toHaveProperty('imageurl')
        expect(res.body).toHaveProperty('price')
        expect(res.body).toHaveProperty('stock')
        expect(res.body).toHaveProperty('UserId')
        expect(res.body).toHaveProperty('category')
        expect(res.body).toHaveProperty('createdAt')
        expect(res.body).toHaveProperty('updatedAt')

        expect(typeof res.body.id).toEqual('number')

        expect(typeof res.body.createdAt).toEqual('string')
        expect(typeof res.body.updatedAt).toEqual('string')
        done()

      })
  })
})
// No Access Token Get Product by Id (Failed)
describe(`GET /products/${id}`, function() {
  it(`Failed to get Product by Id with no access token return status 404`, function(done) {
    request(app)
      .get(`/products/${id}`)
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
// Update Product By Id -> CRUD -> PUT -> /products/:id
describe(`PUT /products/${id}`, function() {
  it(`Succes update data with status 200`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: 50000,
      stock: 5,
      category: "fashion"
    }
    request(app)
      .put(`/products/${id}`)
      .send(product)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        
        expect(res.status).toEqual(200)
        expect(typeof res.body).toEqual('object')

        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('name')
        expect(res.body).toHaveProperty('imageurl')
        expect(res.body).toHaveProperty('price')
        expect(res.body).toHaveProperty('stock')
        expect(res.body).toHaveProperty('UserId')
        expect(res.body).toHaveProperty('category')
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
// No Access Token for Update Product (Failed)
describe(`PUT /products/${id}`, function() {
  it(`Failed update product no access token with status 200`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: 50000,
      stock: 5,
      category: "fashion"
    }
    request(app)
      .put(`/products/${id}`)
      .send(product)
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
// Access token except admin Update Product (Failed)
describe(`PUT /products/${id}`, function() {
  it(`Failed to Update product with no access token except admin and return 401`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: 100000,
      stock: 10,
      UserId: 1,
      category: "fashion"
    }
    let customer = generateToken({
      id: 2,
      email: "customer@mail.com",
      role: "customer"
    })
    request(app)
      .put(`/products/${id}`)
      .send(product)
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
// One of this fields is empty Update Product (Failed)
describe(`PUT /products/${id}`, function() {
  it(`Failed to Update Product, one of the fields is empty, return 400`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: '',
      stock: '',
      UserId: 1,
      category: "fashion"
    }
    request(app)
      .put(`/products/${id}`)
      .send(product)
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
// Stock and price under 0 Update Product (Failed)
describe(`PUT /products/${id}`, function() {
  it(`Failed to Update Product, price and stock must be greater then 0, return 400`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: -1,
      stock: -1,
      UserId: 1,
      category: "fashion"
    }
    request(app)
      .put(`/products/${id}`)
      .send(product)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof res.body).toEqual('object')
        done()
      })
  })
})
// DataTypes Failed Update Product
describe(`PUT /products/${id}`, function() {
  it(`Failed to Update Product with DataTypes for property is false return status 400`, function(done) {
    let product = {
      name: "3Seconds",
      imageurl: "https://www.instagram.com/p/CBZhACep99J/",
      price: "asdsad",
      stock: 10,
      UserId: 1,
      category: "fashion"
    }
    request(app)
      .put(`/products/${id}`)
      .send(product)
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
// Delete Product By Id -> CRUD -> DESTROY -> /products/:id
describe(`DELETE /products/${id}`, function() {
  it(`Success deleting data with status 200`, function(done) {
    request(app)
      .delete(`/products/${id}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(200)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'product success to delete')
        done()
      })
  })
})
// Failed to Delete Product, Access token not admin
describe(`DELETE /products/${id}`, function() {
  it(`Failed to delete data with no acces token except admin return 401`, function(done) {
    let customer = generateToken({
      id: 2,
      email: "customer@mail.com",
      role: "customer"
    })
    request(app)
      .delete(`/products/${id}`)
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
