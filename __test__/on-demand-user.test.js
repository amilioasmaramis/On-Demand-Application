const request = require('supertest')
const app = require('../app')
const { User, sequelize } = require('../models')
const { generateToken } = require('../helpers/jwt')

let id;
let access_token;
let idUser;
let idMission;

beforeAll(async () => {
  // access_token = generateToken({
  //   id: 1,
  //   email: "user@mail.com",
  //   role: "user",
  // })
  await User.create({
    Username: "user",
    Email: "user@mail.com",
    Password: "user",
    Role: "customer",
    Orderan: []
  })
})

afterAll(async (done) => {
  await User.destroy({ where: {} })
    .then(data => {
      sequelize.close()
      done()
    })
    .catch(err => {
      done(err)
    })
  await Order.destroy({ where: {} })
  .then(data => {
    sequelize.close()
    done()
  })
  .catch(err => {
    done(err)
  })
})

// Testing User
// Login User -> CRUD -> POST /users/login -> [{}]
describe('POST /users/login', function() {
  //=====SUCCESSFUL=====
  it('Success POST login user users/login', function(done) {
    request(app)
      .post('/users/login')
      .send({ 
        Email: "user@mail.com",
        Password: "user",
        Role: "customer",
      })
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('access_token', expect.any(String))
        expect(res.body).toHaveProperty('Username')
        expect(res.body).toHaveProperty('Email')
        expect(res.body).toHaveProperty('Role')
        expect(typeof res.body).toEqual('object')
        access_token = res.body.access_token
        idUser = res.body.id
        done()
      })
  })
})
// Failed Login where password email is empYy
describe('POST /users/login', function() {
  it('Failed to create users where password or email is required with status 400', function(done) {
    request(app)
      .post('/users/login')
      .send({ Email: "", Password: "", Role: ""})
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('errorCode')
        // expect(res.body).toHaveProperty('message', ['Invalid email or password']) 
        expect(res.body.message).toBe('Please enter email and password') 
        done()
      })
  })
})
// Failed Login where password email is WRONG
describe('POST /users/login', function() {
  it('Failed to create users where password or email is wrong with status 400', function(done) {
    request(app)
      .post('/users/login')
      .send({ Email: "user@mail.com", Password: "aaaa", Role: "customer"})
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('errorCode')
        // expect(res.body).toHaveProperty('message', ['Invalid email or password']) 
        expect(res.body.message).toBe('Wrong email or password') 
        done()
      })
  })
})
// Failed Register where password or email is required field
describe('POST /users/login', function() {
  it('Failed to create users where password or email is required field with status 500', function(done) {
    request(app)
      .post('/users/login')
      // .send({ email: "", password: ""})
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(500)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Unexpected error.')
        done()
      })
  })
})

// Register User
describe('POST /users/register', function() {
  //=====SUCCESSFUL=====
  it('Successful Register users with status 200 users/register', function(done) {
    request(app)
      .post('/users/register')
      .send({ 
        Username: "user1", 
        Email: "user1@mail.com", 
        Password: "user1", 
        Role: "customer"
      })
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(201)
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('message')
        expect(typeof res.body).toEqual('object')
        done()
      })
  })
  // FAILED
  it('Failed register because empty email or password', function(done) {
    request(app)
      .post('/users/register')
      .send({ 
        Username: "",
        Email: "", 
        Password: "", 
        Role: ""
      })
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(res.body).toHaveProperty('errorCode')
        expect(res.body).toHaveProperty('message')
        expect(typeof res.body).toEqual('object')
        done()
      })
  })
})
// ####################### ORDER TESTING ####################### //
// Order Testing
describe('POST /orders/', function () {
  //=====SUCCESSFUL=====
  describe('Successful POST /orders/', function () {
    it('should return status 201 with data', function (done) {
      // let data = {
      //   TitikAwal: [-6.876463765339965, 109.12823012877732],
      //   TitikAkhir: [-6.876848556370394, 109.12934726878972]
      // }
      request(app)
        .post('/orders/')
        .set('access_token', access_token)
        .send({
          TitikAwal: [-6.876463765339965, 109.12823012877732],
          TitikAkhir: [-6.876848556370394, 109.12934726878972]
        })
        .end((err, res) => {
          if (err) {
            console.log('Error occured at POST register mission')
          }
          expect(res.status).toEqual(201)
          expect(res.body).toHaveProperty("order")
          expect(typeof res.body).toEqual("object")
          id = res.body.order.id
          idMission = res.body.order.id
          done()
        })
    })
  })
  //=====FAILED=====
  it('Failed to create mission with one of field is required', function (done) {
    let data = {
      "TitikAwal": [-6.876463765339965, 109.12823012877732],
      "TitikAkhir": ""
    }
    request(app)
      .post('/orders/')
      .set('access_token', access_token)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log('Error occured at POST order')
        }
        expect(res.status).toEqual(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('errorCode')
        done()
      })
  })
  //=====FAILED=====
  it('Failed to create mission with no access_token', function (done) {
    let data = {
      "TitikAwal": [-6.876463765339965, 109.12823012877732],
      "TitikAkhir": [-6.876848556370394, 109.12934726878972]
    }
    request(app)
      .post('/orders/')
      // .set('access_token', access_token)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log('Error occured at POST order')
        }
        expect(res.status).toEqual(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('errorCode')
        done()
      })
  })
  //=====FAILED=====
  it('Failed to create mission with access_token is wrong', function (done) {
    let data = {
      "TitikAwal": [-6.876463765339965, 109.12823012877732],
      "TitikAkhir": [-6.876848556370394, 109.12934726878972]
    }
    request(app)
      .post('/orders/')
      .set('access_token', "asdjnasdkjnqwkdn23rl2m3r2m3klml23r")
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log('Error occured at POST order')
        }
        expect(res.status).toEqual(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('errorCode')
        done()
      })
  })
})

// Read All Orders data by Driver where status is False
describe('GET /orders/', function () {
  //=====SUCCESSFUL=====
  describe('Successful GET /orders/', function () {
    it('should return status 200 with data', function (done) {
      request(app)
        .get('/orders/')
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) {
            console.log('Error occured at GET orders')
          }
          expect(res.status).toEqual(200)
          expect(typeof res.body).toEqual('object')
          done()
        })
    })
  })
})

// Update Status Order , for Driver
describe('PUT Status Order /orders/:id', function () {
  //=====SUCCESSFUL=====
  describe('Successful PUT Status Order /orders/:id', function () {
    it('should return status 200 with data', function (done) {
      request(app)
        .put(`/orders/${id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) {
            console.log('Error occured at Put status orders')
          }
          expect(res.status).toEqual(200)
          expect(typeof res.body).toEqual('object')
          done()
        })
    })
  })
  // FAILED
  it('Failed to update oders Status with no access_token', function (done) {
    request(app)
      .put(`/orders/${id}`)
      .end((err, res) => {
        if (err) {
          console.log('Error occured at POST register mission')
        }
        expect(res.status).toEqual(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('errorCode')
        done()
      })
  })
})

// Update IsDone for Driver, ketika driver sampai tujuan, 
// ganti IsDone menjadi true untuk pemberitahuan bahwa driver 
// telah selesai mengantarkan customer
describe('PUT Status IsDone Order /orders/IsDone/:id', function () {
  //=====SUCCESSFUL=====
  describe('Successful PUT Status IsDone Order /orders/IsDone/:id', function () {
    it('should return status 200 with data', function (done) {
      request(app)
        .put(`/orders/IsDone/${idMission}`)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) {
            console.log('Error occured at Put status orders')
          }
          expect(res.status).toEqual(200)
          expect(typeof res.body).toEqual('object')
          done()
        })
    })
  })
  // FAILED
  it('Failed to update orders status IsDone with no access_token', function (done) {
    request(app)
      .put(`/orders/IsDone/${id}`)
      // .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          console.log('Error occured at POST register mission')
        }
        expect(res.status).toEqual(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('errorCode')
        done()
      })
  })
})

// Update Data User ketika mengisi orderan baik driver maupun user
describe('PUT Status IsDone Order /orders/IsDone/:id', function () {
  //=====SUCCESSFUL=====
  describe('Successful PUT Status IsDone Order /orders/IsDone/:id', function () {
    it('should return status 200 with data', function (done) {
      request(app)
        .put(`/users/${idUser}`)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) {
            console.log('Error occured at Put status orders')
          }
          expect(res.status).toEqual(200)
          expect(typeof res.body).toEqual('object')
          done()
        })
    })
    // FAILED
    it('Failed to update data orderan user with no access_token', function (done) {
      request(app)
        .put(`/users/${idUser}`)
        // .set('access_token', access_token)
        .end((err, res) => {
          if (err) {
            console.log('Error occured at Put status orders')
          }
          expect(res.status).toEqual(401)
          expect(res.body).toHaveProperty('message')
          expect(res.body).toHaveProperty('errorCode')
          done()
        })
    })
    // FAILED
    it('Failed to update data orderan user with no data order', function (done) {
      request(app)
        .put(`/users/1111111`)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) {
            console.log('Error occured at Put status orders')
          }
          expect(res.status).toEqual(404)
          expect(res.body).toHaveProperty('message')
          expect(res.body).toHaveProperty('errorCode')
          done()
        })
    })
  })
})

