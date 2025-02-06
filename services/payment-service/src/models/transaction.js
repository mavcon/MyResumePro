const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Transaction extends Model {}

Transaction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'usd'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('subscription', 'one-time'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'Transaction'
});

module.exports = Transaction; 