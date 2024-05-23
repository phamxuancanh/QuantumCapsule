const express = require("express");
const router = express.Router()
const authRoutes = require("./auth");
const permissionRoutes = require("./permission");
const { API_PREFIX } = require('../utils')

router.use(`${API_PREFIX}/auths`, authRoutes)
router.use(`${API_PREFIX}/permissions`, permissionRoutes)
module.exports = router