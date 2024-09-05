const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { verifyToken } = require('../middlewares/authMiddleware')
router.post('/signIn', authController.signIn)
router.post('/signUp', authController.signUp)
router.post('/refreshToken', authController.refreshToken)
router.post('/signOut', authController.signOut)
router.post('/changePassword', authController.changePassword)
// router.get('/google', authController.signInWithGoogle)
// router.get('/google/callback', authController.googleCallback)
// router.get('/facebook', authController.signInWithFacebook)
// router.get('/facebook/callback', authController.facebookCallback)
router.post('/google', authController.signInOrRegisterWithGoogle)
router.post('/github', authController.signInOrRegisterWithGitHub)
router.post('/facebook', authController.signInOrRegisterWithFacebook)
router.use('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user })
})
router.get('/verifyEmail', authController.verifyEmail)
router.post('/sendOTP', authController.sendOTP)
router.post('/verifyOTP', authController.verifyOTP)
router.post('/resetPassword', authController.resetPassword)
router.post('/checkEmail', authController.checkEmail)
module.exports = router
