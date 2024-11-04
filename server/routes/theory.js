const express = require('express')
const router = express.Router()
const theoryController = require('../controllers/theory')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importTheories', verifyAccessToken, theoryController.importTheories)
router.get('/', verifyAccessToken, theoryController.getListTheory)
router.post('/', verifyAccessToken, theoryController.addTheory)
router.put('/:id', verifyAccessToken, theoryController.updateTheory)
router.delete('/:id', verifyAccessToken, theoryController.deleteTheory)
// router.get('/:id', verifyAccessToken, theoryController.getTheoryById)
router.get('/getTheoriesByLessonId/:lessonId', verifyAccessToken, theoryController.getTheoriesByLessonId)
router.get('/getListTheoryByChapterId/:chapterId', verifyAccessToken, theoryController.getListTheoryByChapterId)
module.exports = router
