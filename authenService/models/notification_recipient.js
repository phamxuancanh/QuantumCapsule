const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const NotificationRecipient = sequelize.define(
  'NotificationRecipient',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    notificationId: {
      type: DataTypes.BIGINT,
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
