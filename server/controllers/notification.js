/* eslint-disable brace-style */
const { models } = require('../models')

const getNotificationByUserId = async (req, res, next) => {
  const userId = req.userId
  const limit = parseInt(req.query.limit, 10) || 5
  const offset = parseInt(req.query.offset, 10) || 0
  console.log('Getting notifications for user:', userId)
  console.log('Limit:', limit)
  console.log('Offset:', offset)
  try {
    const { rows, count } = await models.NotificationRecipient.findAndCountAll({
      where: { userId },
      include: [{
        model: models.Notification,
        as: 'Notification',
        required: true
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })
    const countUnread = await models.NotificationRecipient.count({ where: { userId, status: 0 } })
    res.json({ total: countUnread, notifications: rows, count })
  } catch (error) {
    next(error)
  }
}
const createNotification = async (req, res, next) => {
  const { title, message, url } = req.body.data
  const loginedUserId = req.userId
  try {
    console.log('Creating notification')
    console.log('Title:', title)
    console.log('Message:', message)
    const notification = await models.Notification.create({ title, message, url })
    const recipient = await models.NotificationRecipient.create({
      notificationId: notification.id,
      userId: loginedUserId,
      status: false
    })
    const notificationWithRecipients = {
      ...notification.toJSON(),
      recipients: {
        ...recipient.toJSON(),
        recipientId: recipient.id
      }
    }
    res.status(201).json(notificationWithRecipients)
  } catch (err) {
    console.error('Error creating notification:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
const readNotification = async (req, res, next) => {
  const recipientsId = req.body.data.recipientsId

  try {
    const notification = await models.NotificationRecipient.findByPk(recipientsId)
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    await notification.update({ status: true })
    res.json(notification)
  } catch (err) {
    next(err)
  }
}
const readAllNotifications = async (req, res, next) => {
  const loginedUserId = req.userId

  try {
    await models.NotificationRecipient.update({ status: true }, { where: { userId: loginedUserId } })
    res.json({ message: 'All notifications have been read' })
  } catch (err) {
    next(err)
  }
}

const removeNotification = async (req, res, next) => {
  const recipientsId = req.body.recipientsId

  try {
    const notification = await models.NotificationRecipient.findByPk(recipientsId)
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    await notification.destroy()
    res.json(notification)
  } catch (err) {
    next(err)
  }
}

const removeAllNotifications = async (req, res, next) => {
  const loginedUserId = req.userId
  try {
    await models.NotificationRecipient.destroy({ where: { userId: loginedUserId } })
    res.json({ message: 'All notifications have been removed' })
  } catch (err) {
    next(err)
  }
}

const markAsUnread = async (req, res, next) => {
  const recipientsId = req.body.data.recipientsId

  try {
    const notification = await models.NotificationRecipient.findByPk(recipientsId)
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    await notification.update({ status: false })
    res.json(notification)
  } catch (err) {
    next(err)
  }
}

const markAllAsUnread = async (req, res, next) => {
  const loginedUserId = req.userId
  try {
    await models.NotificationRecipient.update({ status: false }, { where: { userId: loginedUserId } })
    res.json({ message: 'All notifications have been marked as unread' })
  } catch (err) {
    next(err)
  }
}
module.exports = {
  getNotificationByUserId,
  createNotification,
  readNotification,
  readAllNotifications,
  removeNotification,
  removeAllNotifications,
  markAsUnread,
  markAllAsUnread
}
