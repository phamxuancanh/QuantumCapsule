const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Lesson = sequelize.define(
  'Lesson',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    chapterId: {
      type: DataTypes.STRING,
      allowNull: false
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
