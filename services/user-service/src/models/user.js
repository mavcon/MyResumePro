const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class User extends Model {
  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('free', 'premium', 'enterprise'),
    defaultValue: 'free'
  },
  lastLogin: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeCreate: async (user) => {
      user.password = await User.hashPassword(user.password);
    }
  }
});

module.exports = User; 