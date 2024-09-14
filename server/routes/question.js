const express = require('express')
const router = express.Router()
const questionController = require('../controllers/question')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importQuestions', verifyAccessToken, questionController.importQuestions)
router.get('/', verifyAccessToken, questionController.getListQuestion)
module.exports = router
