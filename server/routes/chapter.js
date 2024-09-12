const express = require('express')
const router = express.Router()
const chapterController = require('../controllers/chapter')
// const { verifyToken } = require('../middlewares/authMiddleware')
router.get('/', chapterController.getAllChapter)
module.exports = router
