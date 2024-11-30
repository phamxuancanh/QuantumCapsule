const express = require('express')
const router = express.Router()
const progressController = require('../controllers/progress')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/addProgress', verifyAccessToken, progressController.addProgress)
router.get('/findProgressByGradeAndSubject', verifyAccessToken, progressController.findProgressByGradeAndSubject)
router.get('/findProgressByChapter', verifyAccessToken, progressController.findProgressByChapter)
router.get('/findProgressByLesson', verifyAccessToken, progressController.findProgressByLesson)
module.exports = router
