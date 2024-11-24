const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const ExamQuestion = sequelize.define(
  'ExamQuestion',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    examId: {
      type: DataTypes.STRING,
      allowNull: false,
      // primaryKey: true
    },
    questionId: {
      type: DataTypes.STRING,
      allowNull: false,
      // primaryKey: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'exam_questions',
    timestamps: true
  }
)
module.exports = ExamQuestion
