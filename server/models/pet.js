const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Pet = sequelize.define(
  'Pet',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/defaultGift.jpg'
    },
    pointsRequired: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'pets',
    timestamps: true
  }
)

module.exports = Pet
