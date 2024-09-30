/* eslint-disable n/no-callback-literal */
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { verifyAccessToken } = require('../middlewares/jwtService')
const multer = require('multer')
const path = require('path')
const storage = multer.memoryStorage({
  destination (req, file, callback) {
    callback(null, '')
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter (req, file, callback) {
    checkFileType(file, callback)
  }
})
function checkFileType (file, callback) {
  const fileTypes = /jpeg|jpg|png|gif/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  console.log(file.originalname)
  const mimetype = fileTypes.test(file.mimetype)
  console.log('check mimetype', mimetype)
  console.log('check extname', extname)
  if (extname && mimetype) {
    return callback(null, true)
  }
  return callback('Error: Images Only!')
}
router.get('/:id', verifyAccessToken, userController.getUserById)
router.put('/:id', verifyAccessToken, userController.editUserById)
router.put('/:id/changeAVT', verifyAccessToken, upload.single('avatar'), userController.changeAVT)
router.put('/:id/assignClassToUser', verifyAccessToken, userController.assignClassToUser)

module.exports = router
