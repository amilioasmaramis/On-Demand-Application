let env = process.env.NODE_ENV

if (env == 'development' || env == 'test') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')
const routes = require('./routes/index')
const errorHandler = require('./middlewares/errorHandler')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(routes)
app.use(errorHandler)

// Listen on bin/httpsapp.listen(PORT, () => {
// app.listen(PORT, () => {
//   console.log(`Host connected on port : ${PORT}`)
// })

module.exports = app