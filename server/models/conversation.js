const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Conversation = sequelize.define(
  'Conversation',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'conversations',
    timestamps: true
  }
)

module.exports = Conversation
