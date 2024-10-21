const express = require('express')
const router = express.Router()
const chapterController = require('../controllers/chapter')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importChapters', verifyAccessToken, chapterController.importChapters)
router.get('/getListChapterNoPaging', verifyAccessToken, chapterController.getListChapterNoPaging)
router.get('/', verifyAccessToken, chapterController.getListChapter)
router.post('/', verifyAccessToken, chapterController.addChapter)
router.put('/:id', verifyAccessToken, chapterController.updateChapter)
router.delete('/:id', verifyAccessToken, chapterController.deleteChapter)
router.get('/getChapterById/:id', verifyAccessToken, chapterController.getChapterById)
router.get('/getListAllChapter', verifyAccessToken, chapterController.getListAllChapter)
module.exports = router
