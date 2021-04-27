const { User, Order } = require('../models')
const { compare } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class UserController {
  // Register User
  static async register(req, res, next) {
    try {
      const { Username, Email, Password, Role } = req.body
      console.log(Username, Email, Password, Role)
      const user = await User.create({ Username, Email, Password, Role, Orderan: [] })
      console.log(user)
      res.status(201).json({
        user: user.dataValues,
        message: `Add new User Successfully`
      })
    } catch(err) {
      next(err)
    }
  }
  // Login User
  static async login(req, res, next) {
    try {
      const { Email, Role, Password } = req.body
      const user = await User.findOne({
        where: {
          Email: req.body.Email,
          Role: req.body.Role
        }
      })
      if (!user) throw { name: 'error_400_email_password_empty' }
      const comparePassword = compare(Password, user.Password)
      console.log(comparePassword, Password, user.Password)
      if (!comparePassword) throw { name: 'error_400_wrong_email_password' }

      const access_token = generateToken({
        id: user.id,
        Email: user.Email,
        Role: user.Role
      })
      res.status(200).json({
        access_token,
        id: user.id,
        Username: user.Username,
        Email: user.Email, 
        Role: user.Role
      })
    } catch(err) {
      next(err)
    }
  }
  // Update Data User ketika mengisi orderan baik driver maupun user
  static async updateOrderTakenByUser(req, res, next) {
    try {
      const user = await User.findOne({ 
        where: { 
          id: req.user.id,
          Email: req.user.Email, 
        } 
      })
      const order = await Order.findOne({
        where: {
          Status: true,
          id: req.params.id
        }
      })
      let tmp = user.dataValues.Orderan
      const updateUser = await User.update({
        Orderan: tmp.concat(order)
      }, {
        where: {
          id: +req.params.id
        },
        returning: true
      })
      if (updateUser[1].length === 0) throw { name: "error_404_order_not_found"}   
      console.log(updateUser[1][0])
      res.status(200).json(updateUser[1][0])
    } catch(err) {
      next(err)
    }
  }
  
}

module.exports = UserController