const express = require('express')
const router = express.Router()
const examController = require('../controllers/exam')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importExams', verifyAccessToken, examController.importExams)
router.get('/', verifyAccessToken, examController.getListExam)
router.post('/', verifyAccessToken, examController.addExam)
router.put('/:id', verifyAccessToken, examController.updateExam)
router.delete('/:id', verifyAccessToken, examController.deleteExam)
router.get('/getExamsByLessonId/:lessonId', verifyAccessToken, examController.getExamsByLessonId)
router.get('/getExamsByChapterId/:chapterId', verifyAccessToken, examController.getExamsByChapterId)
router.get('/getListExamQuestionByChapterId/:chapterId', verifyAccessToken, examController.getListExamQuestionByChapterId)
router.post('/insertExamQuestion', verifyAccessToken, examController.insertExamQuestion)
router.post('/updateExamQuestion/:id', verifyAccessToken, examController.updateExamQuestion)
router.post('/deleteExamQuestion/:id', verifyAccessToken, examController.deleteExamQuestion)
router.get('/getListExamByChapterId/:chapterId', verifyAccessToken, examController.getListExamByChapterId)
module.exports = router
