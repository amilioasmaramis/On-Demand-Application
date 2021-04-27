const { verifyToken } = require('../helpers/jwt.js')

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers

    console.log({ access_token }, 'authenticating access token')
    if (!access_token) throw { name: 'error_401_invalid_token' }

    const decoded = verifyToken(access_token)
    if (!decoded) throw { name: 'error_401_invalid_token' }
    req.user = decoded
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = authentication
