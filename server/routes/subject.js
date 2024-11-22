const express = require('express')
const router = express.Router()
const subjectController = require('../controllers/subject')
const { verifyAccessToken } = require('../middlewares/jwtService')

// const { verifyToken } = require('../middlewares/authMiddleware')
router.get('/', verifyAccessToken, subjectController.getListSubject)
router.get('/:id', verifyAccessToken, subjectController.getSubjectById)
module.exports = router
