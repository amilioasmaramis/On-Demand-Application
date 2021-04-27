const router = require('express').Router()
const user = require('./user')
const order = require('./order')

router.use('/users', user)
router.use('/orders', order)


module.exports = router