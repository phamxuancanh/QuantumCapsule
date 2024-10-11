const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notification')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.get('/getNotificationByUserId', verifyAccessToken, notificationController.getNotificationByUserId)
router.post('/createNotification', verifyAccessToken, notificationController.createNotification)
router.put('/readNotification', verifyAccessToken, notificationController.readNotification)
router.put('/readAllNotifications', verifyAccessToken, notificationController.readAllNotifications)
router.delete('/removeNotification', verifyAccessToken, notificationController.removeNotification)
router.delete('/removeAllNotifications', verifyAccessToken, notificationController.removeAllNotifications)
router.put('/markAsUnread', verifyAccessToken, notificationController.markAsUnread)
router.put('/markAllAsUnread', verifyAccessToken, notificationController.markAllAsUnread)

module.exports = router
