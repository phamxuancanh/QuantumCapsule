const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const NotificationRecipient = sequelize.define(
  'NotificationRecipient',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notificationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'notification_recipients',
    timestamps: true
  }
)

module.exports = NotificationRecipient
