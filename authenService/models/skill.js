const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Skill = sequelize.define(
  'Skill',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    subjectId: {
      type: DataTypes.BIGINT,
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
    tableName: 'skills',
    timestamps: true
  }
)

module.exports = Skill
