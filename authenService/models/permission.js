const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Permission = sequelize.define(
  'Permission',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    method: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'permission'
  }
)

module.exports = Permission
