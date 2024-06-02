const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signIn', authController.signIn);
router.post('/signUp', authController.signUp);
router.post('/refreshToken', authController.refreshToken);
router.post('/signOut', authController.signOut);
router.post('/changePassword', authController.changePassword);
router.get('/google', authController.signInWithGoogle);
router.get('/google/callback', authController.googleCallback);
router.get('/facebook', authController.signInWithFacebook);
router.get('/facebook/callback', authController.facebookCallback);

module.exports = router;