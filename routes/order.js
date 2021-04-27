const router = require('express').Router()
const OrderController = require('../controllers/orderController')
const authenticate = require('../middlewares/authentication')
const authorize = require('../middlewares/authorized')

// POST ORDER CUSTOMER
router.post('/', authenticate, authorize, OrderController.createOrder)

// If user == customer 
// POST/ADD Request data to server : 
// 1. Longitude, 2. Latitude, 3. Status = false, 4. UserId, 5.IsDone, 
// 6. Jarak(longitude – latitude) hitung gmaps, 6. TarifHarga berdasarkan jarak

// READ ALL ORDER BY STATUS IS FALSE
router.get('/', authenticate, authorize, OrderController.readAllOrder)

//	If user == driver
//  Update
//	Get data from list pesanan user customer dengan status = false
//	Driver taken orderan(pilih orderan dari list order si customer)
//	Ganti statusnya menjadi true.
router.put('/:id', authenticate, authorize, OrderController.updateStatusOrder)
//	PATCH / Update data list pesanan customer , di route user

// Update IsDone for Driver, ketika driver sampai tujuan, ganti IsDone menjadi true untuk pemberitahuan bahwa driver telah selesai mengantarkan customer
router.put('/IsDone/:id', authenticate, authorize, OrderController.updateIsDoneByDriver)


module.exports = router