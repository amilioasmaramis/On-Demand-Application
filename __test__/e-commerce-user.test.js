const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')

afterAll(() => {
  sequelize.close()
})

// Testing User
// Login User -> CRUD -> POST /users/login -> [{}]
describe('POST /users/login', function() {
  it('Success create users with status 200', function(done) {
    request(app)
      .post('/users/login')
      .send({ email: "admin@mail.com", password: "1234"})
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('access_token', expect.any(String))
        expect(res.body).toHaveProperty('username', res.body.username)
        expect(res.body).toHaveProperty('email', res.body.email)
        expect(res.body).toHaveProperty('role', res.body.role)
        expect(typeof res.body).toEqual('object')
        done()
      })
  })
})

describe('POST /users/login', function() {
  it('Failed to create users where password or email is required with status 400', function(done) {
    request(app)
      .post('/users/login')
      .send({ email: "", password: ""})
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message')
        // expect(res.body).toHaveProperty('message', ['Invalid email or password']) 
        expect(res.body.message[0]).toBe('Invalid email or password') 
        done()
      })
  })
})

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
        expect(res.body.message[0]).toBe('Internal Server Error')
        // expect(typeof res.body).toEqual('object')
        done()
      })
  })
})

