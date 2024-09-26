const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Result = sequelize.define(
  'Result',
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
    totalScore: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    yourScore: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    timeStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    timeEnd: {
      type: DataTypes.DATE,
      allowNull: false
    },
    examId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'results',
    timestamps: true
  }
)

module.exports = Result
