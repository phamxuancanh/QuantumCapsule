const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../middlewares/jwtService')
const resultController = require('../controllers/result')

router.post('/insertResult', verifyAccessToken, resultController.insertResult)
router.get('/getResultDetailByResultId/:resultId', verifyAccessToken, resultController.getResultDetail)
router.get('/getListResultByUserId/:userId', verifyAccessToken, resultController.getListResultByUserId)
module.exports = router
