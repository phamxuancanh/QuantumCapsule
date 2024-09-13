const express = require('express')
const router = express.Router()
const theoryController = require('../controllers/theory')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importTheories', verifyAccessToken, theoryController.importTheories)

module.exports = router
