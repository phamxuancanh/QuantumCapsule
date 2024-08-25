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
    answerA: {
      type: DataTypes.STRING
    },
    answerB: {
      type: DataTypes.STRING
    },
    answerC: {
      type: DataTypes.STRING
    },
    answerD: {
      type: DataTypes.STRING
    },
    answerE: {
      type: DataTypes.STRING
    },
    correctAnswer: {
      type: DataTypes.STRING
    },
    explainAnswer: {
      type: DataTypes.STRING
    },
    score: {
      type: DataTypes.INTEGER
    },
    yourAnswer: {
      type: DataTypes.STRING
    },
    isCorrect: {
      type: DataTypes.BOOLEAN
    },
    userId: {
      type: DataTypes.STRING
    },
    resultId: {
      type: DataTypes.STRING
    },

    subjectId: {
      type: DataTypes.STRING
    },
    chapterId: {
      type: DataTypes.STRING
    },
    lessonId: {
      type: DataTypes.STRING
    },
    examId: {
      type: DataTypes.STRING
    },
    questionId: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'answers',
    timestamps: true
  }
)

module.exports = Answer
