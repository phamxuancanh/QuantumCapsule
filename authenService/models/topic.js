const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Topic = sequelize.define(
  'Topic',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    skillId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    order: {
      type: DataTypes.INTEGER
    },
    url: {
      type: DataTypes.STRING
    },
    picture: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'topics',
    timestamps: true
  }
)

module.exports = Topic
