const express = require('express')
const router = express.Router()
const petController = require('../controllers/pet')
// const { verifyToken } = require('../middlewares/authMiddleware')
router.get('/', petController.getListPet)
router.get('/:id', petController.getPetById)
module.exports = router
