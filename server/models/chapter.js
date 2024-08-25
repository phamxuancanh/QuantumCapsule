const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Chapter = sequelize.define(
  'Chapter',
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    subjectId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    grade: {
      type: DataTypes.INTEGER
    },
    order: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: 'chapters',
    timestamps: true
  }
)

module.exports = Chapter
