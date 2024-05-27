const authController = require("../controllers/auth")
const express = require('express')
const router = express.Router()
// const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/signIn', authController.signIn)
router.post('/signUp', authController.signUp)
router.post('/refreshToken', authController.refreshToken)
router.post('/signOut', authController.signOut)
router.post('/changePassword', authController.changePassword)

module.exports = router
