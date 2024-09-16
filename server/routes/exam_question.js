const express = require('express')
const router = express.Router()
const examQuestionController = require('../controllers/exam_question')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importExamQuestions', verifyAccessToken, examQuestionController.importExamQuestions)
router.post('/', verifyAccessToken, examQuestionController.addExamQuestion)
router.put('/:id', verifyAccessToken, examQuestionController.updateExamQuestion)
router.delete('/:id', verifyAccessToken, examQuestionController.deleteExamQuestion)
module.exports = router
