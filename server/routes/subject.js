const express = require('express')
const router = express.Router()
const subjectController = require('../controllers/subject')
// const { verifyToken } = require('../middlewares/authMiddleware')
router.get('/', subjectController.getAllSubject)
module.exports = router
