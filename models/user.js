'use strict';

const { Model } = require('sequelize')
const { hashing } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order)
    }
  };
  User.init({
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Username is required`
        },
        notNull: {
          args: true,
          msg: `Username is required`
        }
      }
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: `Email is required`
        },
        notNull: {
          args: true,
          msg: `Email is required`
        }
      }
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Password is required`
        },
        notNull: {
          args: true,
          msg: `Password is required`
        }
      }
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Role is required`
        },
        notNull: {
          args: true,
          msg: `Role is required`
        }
      }
    },
    Orderan: DataTypes.ARRAY(DataTypes.JSON)
  }, {
    hooks: {
      beforeCreate(user, option) {
        user.Password = hashing(user.Password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};