const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.get('/:id', userController.getUserById)
router.put('/:id', userController.editUserById)
module.exports = router
