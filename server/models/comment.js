const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Comment = sequelize.define(
  'Comment',
  {
    theoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.BOOLEAN
    },
    content: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'comment',
    indexes: [
      {
        unique: true,
        fields: ['theoryId', 'userId']
      }
    ],
    timestamps: true
  }
)
module.exports = Comment