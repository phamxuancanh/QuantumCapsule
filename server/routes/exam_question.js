const express = require('express')
const router = express.Router()
const examQuestionController = require('../controllers/exam_question')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importExamQuestions', verifyAccessToken, examQuestionController.importExamQuestions)

module.exports = router
