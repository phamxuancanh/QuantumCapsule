const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Subject = sequelize.define(
  'Subject',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    image_on: {
      type: DataTypes.STRING
    },
    image_off: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'subjects',
    timestamps: true
  }
)

module.exports = Subject
