const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Answer = sequelize.define(
  'Answer',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    questionType: {
      type: DataTypes.INTEGER
    },
    isCorrect: {
      type: DataTypes.BOOLEAN
    },
    scoresheetId: {
      type: DataTypes.STRING
    },
    questionId: {
      type: DataTypes.STRING
    },
    orderAnswer: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'answers',
    timestamps: true
  }
)

module.exports = Answer
