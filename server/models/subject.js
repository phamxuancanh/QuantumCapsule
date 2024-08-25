const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Subject = sequelize.define(
  'Subject',
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'subjects',
    timestamps: true
  }
)

module.exports = Subject
