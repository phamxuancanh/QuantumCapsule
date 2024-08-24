const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Message = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    conversationId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'messages',
    timestamps: true
  }
)

module.exports = Message
