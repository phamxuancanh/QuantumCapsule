const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Lesson = sequelize.define(
  'Lesson',
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    chapterId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    order: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: 'lessons',
    timestamps: true
  }
)

module.exports = Lesson
