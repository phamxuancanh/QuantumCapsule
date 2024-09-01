const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Theory = sequelize.define(
  'Theory',
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
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    summary: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
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
    tableName: 'theories',
    timestamps: true
  }
)

module.exports = Theory
