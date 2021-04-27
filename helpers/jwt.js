const jwt = require('jsonwebtoken')

function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET_JWT)
}

function verifyToken(token) {
  try {
    let decoded = jwt.verify(token, process.env.SECRET_JWT)
    return decoded
  } catch (err) {
    return false
  }
}

module.exports = {
  generateToken,
  verifyToken,
}
