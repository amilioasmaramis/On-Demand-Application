let env = process.env.NODE_ENV

if (env == 'development' || env == 'test') {
  require('dotenv').config()
}

const app = require('../app')
const PORT = process.env.PORT || 7001

app.listen(PORT, () => {
  console.log(`Host connected on port : ${PORT}`)
})