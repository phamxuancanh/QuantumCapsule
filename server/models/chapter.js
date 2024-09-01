const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Chapter = sequelize.define(
  'Chapter',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
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
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'chapters',
    timestamps: true
  }
)

module.exports = Chapter
