const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Question = sequelize.define(
  'Question',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    questionType: {
      type: DataTypes.ENUM,
      values: ['trac nghiem', 'tu luan'],
      allowNull: false
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
    subjectId: {
      type: DataTypes.BIGINT
    },
    skillId: {
      type: DataTypes.BIGINT
    },
    topicId: {
      type: DataTypes.BIGINT
    },
    practiceId: {
      type: DataTypes.BIGINT
    },
    examId: {
      type: DataTypes.BIGINT
    }
  },
  {
    tableName: 'questions',
    timestamps: true
  }
)

module.exports = Question
