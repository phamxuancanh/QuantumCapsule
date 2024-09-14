const express = require('express')
const router = express.Router()
const examController = require('../controllers/exam')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importExams', verifyAccessToken, examController.importExams)
router.get('/', verifyAccessToken, examController.getListExam)
module.exports = router
