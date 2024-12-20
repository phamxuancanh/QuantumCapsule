const express = require('express')
const router = express.Router()
const authRoutes = require('./auth')
const gridRoutes = require('./grid')
const userRoutes = require('./user')
const chapterRoutes = require('./chapter')
const subjectRoutes = require('./subject')
const lessonRoutes = require('./lesson')
const theoryRoutes = require('./theory')
const examRoutes = require('./exam')
const questionRoutes = require('./question')
const examQuestionRoutes = require('./exam_question')
const commentRoutes = require('./comment')
const answerRoutes = require('./answer')
const resultRoutes = require('./result')
const progressRoutes = require('./progress')
const notificationRoutes = require('./notification')
const petRoutes = require('./pet')
const { API_PREFIX } = require('../utils')
// const { rateLimitAndTimeout, services } = require('../middlewares/gateway')
// const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware')

router.use(`${API_PREFIX}/auths`, authRoutes)
router.use(`${API_PREFIX}/grids`, gridRoutes)
router.use(`${API_PREFIX}/users`, userRoutes)
router.use(`${API_PREFIX}/subjects`, subjectRoutes)
router.use(`${API_PREFIX}/chapters`, chapterRoutes)
router.use(`${API_PREFIX}/lessons`, lessonRoutes)
router.use(`${API_PREFIX}/theories`, theoryRoutes)
router.use(`${API_PREFIX}/exams`, examRoutes)
router.use(`${API_PREFIX}/questions`, questionRoutes)
router.use(`${API_PREFIX}/exam_questions`, examQuestionRoutes)
router.use(`${API_PREFIX}/comments`, commentRoutes)
router.use(`${API_PREFIX}/answers`, answerRoutes)
router.use(`${API_PREFIX}/results`, resultRoutes)
router.use(`${API_PREFIX}/progress`, progressRoutes)
router.use(`${API_PREFIX}/notifications`, notificationRoutes)
router.use(`${API_PREFIX}/pets`, petRoutes)
// router.use(`${API_PREFIX}/grids`, )
// services.forEach(({ route, target }) => {
//   const proxyOptions = {
//     target,
//     changeOrigin: true,
//     pathRewrite: {
//       [`^${route}`]: ''
//     },
//     on: {
//       proxyReq: fixRequestBody
//     }

//   }

//   router.use(`${API_PREFIX}` + route, rateLimitAndTimeout, createProxyMiddleware(proxyOptions))
// })
module.exports = router
