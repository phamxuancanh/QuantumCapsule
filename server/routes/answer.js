const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../middlewares/jwtService')
const answerController = require('../controllers/answer')

router.post('/insertListAnswer', verifyAccessToken, answerController.insertListAnswer)
module.exports = router
