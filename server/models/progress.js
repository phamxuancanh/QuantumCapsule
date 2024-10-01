const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Progress = sequelize.define(
  'Progress',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    theoryId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'progress',
    timestamps: true
  }
)

module.exports = Progress
