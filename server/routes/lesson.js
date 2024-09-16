const express = require('express')
const router = express.Router()
const lessonController = require('../controllers/lesson')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importLessons', verifyAccessToken, lessonController.importLessons)
router.get('/', verifyAccessToken, lessonController.getListLesson)
router.post('/', verifyAccessToken, lessonController.addLesson)
router.put('/:id', verifyAccessToken, lessonController.updateLesson)
router.delete('/:id', verifyAccessToken, lessonController.deleteLesson)
module.exports = router
