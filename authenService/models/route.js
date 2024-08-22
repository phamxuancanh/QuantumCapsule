const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Route = sequelize.define(
  'Route',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING
    },
    method: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'routes',
    timestamps: true
  }
)

module.exports = Route
