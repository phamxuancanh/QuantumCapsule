const express = require('express')
const router = express.Router()
const authRoutes = require('./auth')
const permissionRoutes = require('./permission')
const gridRoutes = require('./grid')
const { API_PREFIX } = require('../utils')
// const { rateLimitAndTimeout, services } = require('../middlewares/gateway')
// const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware')

router.use(`${API_PREFIX}/auths`, authRoutes)
router.use(`${API_PREFIX}/permissions`, permissionRoutes)
router.use(`${API_PREFIX}/grids`, gridRoutes)
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
