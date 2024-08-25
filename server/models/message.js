const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Message = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    conversationId: {
      type: DataTypes.STRING,
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
      type: DataTypes.BOOLEAN
    }
  },
  {
    tableName: 'messages',
    timestamps: true
  }
)

module.exports = Message
