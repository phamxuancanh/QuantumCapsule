const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { verifyAccessToken } = require('../middlewares/jwtService')
router.get('/:id', verifyAccessToken, userController.getUserById)
router.put('/:id', verifyAccessToken, userController.editUserById)
module.exports = router
