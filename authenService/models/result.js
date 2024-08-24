const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Result = sequelize.define(
  'Result',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    totalScore: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
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
    skillId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    practiceId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    examId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    uploadedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  },
  {
    tableName: 'results',
    timestamps: true
  }
)

module.exports = Result
