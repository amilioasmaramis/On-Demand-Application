const router = require('express').Router()
const UserController = require('../controllers/userController')
const authenticate = require('../middlewares/authentication')
const authorize = require('../middlewares/authorized')

// Register 
router.post('/register', UserController.register)
// Login
router.post('/login', UserController.login)

// UPDATE USER DATA PUSH ORDERAN
// router.update('/:id, UserController.updateOrderan)
//	If user == driver
//	Get data from list pesanan user customer dengan status = false
//	Driver taken orderan(pilih orderan dari list order si customer)
//	Ganti statusnya menjadi true.
//	PUT / Update data list pesanan customer

// Update Data User ketika mengisi orderan baik driver maupun user
router.put('/:id', authenticate, authorize, UserController.updateOrderTakenByUser)
module.exports = router