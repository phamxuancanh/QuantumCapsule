const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../middlewares/jwtService')
const resultController = require('../controllers/result')

router.post('/insertResult', verifyAccessToken, resultController.insertResult)
router.get('/getResultDetailByResultId/:resultId', verifyAccessToken, resultController.getResultDetail)
router.get('/getListResultByUserId/:userId', verifyAccessToken, resultController.getListResultByUserId)
router.get('/getListUniqueDoneResultByUserIdandChapterId', verifyAccessToken, resultController.getListUniqueDoneResultByUserIdandChapterId)
router.get('/getListAllDoneResultByUserIdandChapterId', verifyAccessToken, resultController.getListAllDoneResultByUserIdandChapterId)
router.get('/getListAllDoneResultByUserIdandExamId', verifyAccessToken, resultController.getListAllDoneResultByUserIdandExamId)
router.get('/getListAllDoneResultByUserIdandLessonId', verifyAccessToken, resultController.getListAllDoneResultByUserIdandLessonId)
module.exports = router
