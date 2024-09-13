const express = require('express')
const router = express.Router()
const chapterController = require('../controllers/chapter')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importChapters', verifyAccessToken, chapterController.importChapters)
router.get('/', verifyAccessToken, chapterController.getAllChapter)

module.exports = router
