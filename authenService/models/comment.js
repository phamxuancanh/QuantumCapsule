const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Comment = sequelize.define(
  'Comment',
  {
    topicId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
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
        fields: ['topicId', 'userId']
      }
    ],
    timestamps: true
  }
)
module.exports = Comment
