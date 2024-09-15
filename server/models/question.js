const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Question = sequelize.define(
  'Question',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    lessonId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    questionType: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contentImg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    A: {
      type: DataTypes.STRING
    },
    B: {
      type: DataTypes.STRING
    },
    C: {
      type: DataTypes.STRING
    },
    D: {
      type: DataTypes.STRING
    },
    E: {
      type: DataTypes.STRING
    },
    correctAnswer: {
      type: DataTypes.STRING
    },
    explainAnswer: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: 'questions',
    timestamps: true
  }
)

module.exports = Question
