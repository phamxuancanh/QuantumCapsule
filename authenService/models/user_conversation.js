const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const UserConversations = sequelize.define(
  'UserConversations',
  {
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    conversationId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    tableName: 'user_conversations',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'conversationId']
      }
    ],
    timestamps: true
  }
)
module.exports = UserConversations
