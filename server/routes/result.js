const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../middlewares/jwtService')
const resultController = require('../controllers/result')

router.post('/insertResult', verifyAccessToken, resultController.insertResult)
module.exports = router
