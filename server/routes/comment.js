const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.get('/getAllCommentsByTheoryId/:theoryId', verifyAccessToken, commentController.getAllCommentsByTheoryId)
router.get('/getListActiveCommentByTheoryId/:theoryId', verifyAccessToken, commentController.getListActiveCommentByTheoryId)
router.post('/', verifyAccessToken, commentController.addComment)
module.exports = router
