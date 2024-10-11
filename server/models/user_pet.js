const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const UserPet = sequelize.define(
  'UserPet',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    petId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'user_pets',
    timestamps: true
  }
)

module.exports = UserPet
