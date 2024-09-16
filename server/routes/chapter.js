const express = require('express')
const router = express.Router()
const chapterController = require('../controllers/chapter')
const { verifyAccessToken } = require('../middlewares/jwtService')

router.post('/importChapters', verifyAccessToken, chapterController.importChapters)
router.get('/', verifyAccessToken, chapterController.getListChapter)
router.post('/', verifyAccessToken, chapterController.addChapter)
router.put('/:id', verifyAccessToken, chapterController.updateChapter)
router.delete('/:id', verifyAccessToken, chapterController.deleteChapter)
module.exports = router
