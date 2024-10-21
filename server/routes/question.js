const express = require('express')
const router = express.Router()
const questionController = require('../controllers/question')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importQuestions', verifyAccessToken, questionController.importQuestions)
router.get('/', verifyAccessToken, questionController.getListQuestion)
router.post('/', verifyAccessToken, questionController.addQuestion)
router.put('/:id', verifyAccessToken, questionController.updateQuestion)
router.delete('/:id', verifyAccessToken, questionController.deleteQuestion)
router.get('/getListQuestionByExamId/:id', verifyAccessToken, questionController.getListQuestionByExamId)
router.get('/getListQuestionByChapterId/:chapterId', verifyAccessToken, questionController.getListQuestionByChapterId)
module.exports = router
