const { User, Order } = require('../models')

class OrderController {
// READ ALL ORDER BY STATUS IS FALSE
// router.get('/', authenticate, authorize, OrderController.readAllOrder)
// If user == customer 
// POST/ADD Request data to server : 
// 1. Longitude, 2. Latitude, 3. Status = false, 4. UserDriverTakenId, 5. UserCustomerIdOrder: UserId, 
// 6. Jarak(longitude – latitude) hitung gmaps, 6. TarifHarga berdasarkan jarak
// PATCH / UPDATE data user , push key oderan dengan orderan -> update data user di controller user
// POST ORDER CUSTOMER
// router.post('/', authenticate, authorize, OrderController.createOrder)

//	If user == driver
//	Get data from list pesanan user customer dengan status = false
//	Driver taken orderan(pilih orderan dari list order si customer)
//	Isi UserDriverTakenId dengan id driver
//	Ganti statusnya menjadi true.
//	PATCH / Update data list pesanan customer

  // Create Order Customer
  static async createOrder(req, res, next) {
    try {
      // const { id } = req.user
      const { TitikAwal, TitikAkhir } = req.body
      var R = 6378137;
      var dLat = (TitikAkhir[0]-TitikAwal[0]) * Math.PI / 180;
      var dLng = (TitikAkhir[1]-TitikAwal[1]) * Math.PI / 180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(TitikAwal[0] * Math.PI / 180 ) * Math.cos(TitikAkhir[0] * Math.PI / 180 ) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      let resultJarak = Math.round(d) / 1000 // in meter
      console.log(resultJarak, '<<<<<')
      let harga = resultJarak * 3000
      const order = await Order.create({
        TitikAwal,
        TitikAkhir,
        Status: false,
        Jarak: resultJarak,
        UserId: req.user.id,
        TarifHarga: harga,
        IsDone: false
      })
      res.status(201).json({ order })
    } catch(err) {
      next(err)
    }
  }

  // Read All Data Order for Driver where status is False
  static async readAllOrder(req, res, next) {
    try {
      const order = await Order.findAll({
        where: {
          Status: false
        }
      })
      res.status(200).json({ order })
    } catch(err) {
      next(err)
    }
  }
  
  // Update Status Order , for Driver
  static async updateStatusOrder(req, res, next) {
    try {
      console.log(req.params.id, req.user.id)
      const order = await Order.update({
        Status: true
      }, {
        where: {
          id: +req.params.id
        },
        returning: true
      })
      res.status(200).json(order[1][0])
    } catch(err) {
      next(err)
    }
  }

  // Update IsDone for Driver, ketika driver sampai tujuan, ganti IsDone menjadi true untuk pemberitahuan bahwa driver telah selesai mengantarkan customer
  static async updateIsDoneByDriver(req, res, next) {
    try {
      console.log(req.params.id, req.user.id)
      const order = await Order.update({
        IsDone: true
      }, {
        where: {
          id: +req.params.id
        },
        returning: true
      })
      res.status(200).json(order[1][0])
    } catch(err) {
      next(err)
    }
  }
}

module.exports = OrderController