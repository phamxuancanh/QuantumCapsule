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
    totalScore: {
      type: DataTypes.INTEGER,
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
    subjectId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    chapterId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lessonId: {
      type: DataTypes.STRING,
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
