const express = require('express')
const router = express.Router()
const lessonController = require('../controllers/lesson')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importLessons', verifyAccessToken, lessonController.importLessons)

module.exports = router
