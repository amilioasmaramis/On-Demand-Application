'use strict'

if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}

const DB_USERNAME_NAME = process.env.DB_DATABASE_NAME
const DB_PASSWORD_NAME = process.env.DB_PASSWORD
const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME
const DB_HOST_NAME = process.env.DB_HOST_NAME
const DB_DIALECT_NAME = process.env.DB_DIALECT_NAME
const JWT_SECRET = process.env.JWT_SECRET

module.exports = { 
  DB_USERNAME_NAME,
  DB_PASSWORD_NAME,
  DB_DATABASE_NAME,
  DB_HOST_NAME,
  DB_DIALECT_NAME,
  JWT_SECRET
}
