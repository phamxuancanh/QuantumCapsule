const express = require('express')
const router = express.Router()
const petController = require('../controllers/pet')
const { verifyAccessToken } = require('../middlewares/jwtService')

// const { verifyToken } = require('../middlewares/authMiddleware')
router.get('/', verifyAccessToken, petController.getListPet)
router.get('/:id', verifyAccessToken, petController.getPetById)
module.exports = router
