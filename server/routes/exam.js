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
module.exports = router
