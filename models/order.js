'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User)
      // Order.belongsTo(models.User, { through: 'User', foreignKey: 'UserDriverId'  })
      // Order.belongsTo(models.User, { through: 'User', foreignKey: 'UserCustomerId'  })
    }
  };
  Order.init({
    TitikAwal: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `TitikAwal is required`
        },
        notNull: {
          args: true,
          msg: `TitikAwal is required`
        }
      }
    },
    TitikAkhir: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `TitikAkhir is required`
        },
        notNull: {
          args: true,
          msg: `TitikAkhir is required`
        }
      }
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Status is required`
        },
        notNull: {
          args: true,
          msg: `Status is required`
        }
      }
    },
    UserId: DataTypes.INTEGER,
    Jarak: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Jarak is required`
        },
        notNull: {
          args: true,
          msg: `Jarak is required`
        }
      }
    },
    TarifHarga: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `TarifHarga is required`
        },
        notNull: {
          args: true,
          msg: `TarifHarga is required`
        }
      }
    },
    IsDone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `IsDone is required`
        },
        notNull: {
          args: true,
          msg: `IsDone is required`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};