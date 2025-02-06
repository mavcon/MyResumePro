const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Subscription extends Model {}

Subscription.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    unique: true
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    unique: true
  },
  plan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  currentPeriodEnd: {
    type: DataTypes.DATE
  },
  cancelAtPeriodEnd: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Subscription'
});

module.exports = Subscription; 