const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Practice = sequelize.define(
  'Practice',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subjectId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    skillId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    topicId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    uploadedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  },
  {
    tableName: 'practices',
    timestamps: true
  }
)

module.exports = Practice
