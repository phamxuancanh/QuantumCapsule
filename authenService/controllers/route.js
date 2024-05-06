const express = require('express')
const { models } = require('../models')
const { isAuthenticated } = require('../middlewares/authentication')
const router = express.Router()

const { infoLogger, errorLogger } = require('../logs/logger')

const MASSAGE = {
  ROUTES_NOT_FOUND: 'Routes not found'
}

function logError (req, error) {
  const request = req.body.data ? req.body.data : (req.params ? req.params : req.query)
  errorLogger.error({
    message: `Error ${req.path}`,
    method: req.method,
    endpoint: req.path,
    request: request,
    error: error,
    user: req.user.id
  })
}

function logInfo (req, response) {
  const request = req.body.data ? req.body.data : (req.params ? req.params : req.query)
  infoLogger.info({
    message: `Accessed ${req.path}`,
    method: req.method,
    endpoint: req.path,
    request: request,
    response: response,
    user: req.user.id
  })
}
// get all routes
router.get('/', isAuthenticated, async (_, res) => {
  try {
    const routes = await models.Route.findAll()
    logInfo(_, routes)
    res.json(routes)
  } catch (error) {
    logError(_, error)
    res.status(500).json({ message: MASSAGE.ROUTES_NOT_FOUND })
  }
})

module.exports = router
