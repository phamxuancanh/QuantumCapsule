const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Keyword = sequelize.define(
  'Keyword',
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
    }
  },
  {
    tableName: 'keywords',
    timestamps: true
  }
)

module.exports = Keyword
