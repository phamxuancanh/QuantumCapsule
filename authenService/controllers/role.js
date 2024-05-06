const express = require('express')
const { models } = require('../models')
const { isAuthenticated } = require('../middlewares/authentication')
const router = express.Router()

const { infoLogger, errorLogger } = require('../logs/logger')

const MASSAGE = {
  ROLE_NOT_FOUND: 'Role not found',
  ROLE_ALREADY_EXISTS: 'Role already exists',
  DELETE_ROLE_SUCCESS: 'Delete role successfully',
  NO_CREATE_ROLE: 'No can not create role',
  NO_UPDATE_ROLE: 'No can not update role',
  NO_DELETE_ROLE: 'No can not delete role',
  NAME_REQUIRED: 'Name are required',
  DESCRIPTION_REQUIRED: 'Description are required',
  NAME_REQUIRED_NUMBER: 'Name must not contain numbers',
  DESCRIPTION_REQUIRED_NUMBER: 'Description must not contain numbers',
  NAME_ALREADY_EXISTS: 'Name already exists',
  DESCRIPTION_ALREADY_EXISTS: 'Description already exists',
  ROLE_IS_BEING_USED: 'This role is being used',
  NAME_OR_DESCRIPTION_REQUIRED: 'Name or description must be string'
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

// get all role
router.get('/', isAuthenticated, async (_, res) => {
  try {
    const role = await models.Role.findAll()
    res.json(role)
    logInfo(_, role)
  } catch (error) {
    logError(_, error)
    res.status(500).json({ message: MASSAGE.ROLE_NOT_FOUND })
  }
})
// create role
router.post('/', isAuthenticated, async (req, res) => {
  try {
    // console.log('req.body', req.body)
    const { name, description } = req.body.data
    if (!name) {
      logError(req, MASSAGE.NAME_REQUIRED)
      return res.status(400).json({ message: MASSAGE.NAME_REQUIRED, field: 'name' })
    }
    if (name && !isNaN(name)) {
      logError(req, MASSAGE.NAME_REQUIRED_NUMBER)
      return res.status(400).json({ message: MASSAGE.NAME_REQUIRED_NUMBER, field: 'name' })
    }

    if (!description) {
      logError(req, MASSAGE.DESCRIPTION_REQUIRED)
      return res.status(400).json({ message: MASSAGE.DESCRIPTION_REQUIRED, field: 'description' })
    }
    if (description && !isNaN(description)) {
      logError(req, MASSAGE.DESCRIPTION_REQUIRED_NUMBER)
      return res.status(400).json({ message: MASSAGE.DESCRIPTION_REQUIRED_NUMBER, field: 'description' })
    }

    const existingRole = await models.Role.findOne({ where: { name } })
    if (existingRole) {
      logError(req, MASSAGE.ROLE_ALREADY_EXISTS)
      return res.status(409).json({ message: MASSAGE.ROLE_ALREADY_EXISTS, field: 'name' })
    }
    const existingRole1 = await models.Role.findOne({ where: { description } })
    if (existingRole1) {
      logError(req, MASSAGE.DESCRIPTION_ALREADY_EXISTS)
      return res.status(409).json({ message: MASSAGE.DESCRIPTION_ALREADY_EXISTS, field: 'description' })
    }
    const role = await models.Role.create({ name, description })
    res.json(role)
    logInfo(req, role)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.NO_CREATE_ROLE })
  }
}
)
// edit role
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body.data
    const role = await models.Role.findByPk(id)
    if (!role) {
      logError(req, MASSAGE.ROLE_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.ROLE_NOT_FOUND })
    }

    if (name) {
      const existingRole = await models.Role.findOne({ where: { name } })
      if (existingRole && existingRole.id !== id) {
        logError(req, MASSAGE.NAME_ALREADY_EXISTS)
        return res.status(409).json({ message: MASSAGE.NAME_ALREADY_EXISTS })
      }
      role.name = name
    }

    if (description) role.description = description
    await role.save()
    res.json(role)
    logInfo(req, role)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.NO_UPDATE_ROLE })
  }
})

// delete role
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params
    const role = await models.Role.findByPk(id)
    if (!role) {
      logError(req, MASSAGE.ROLE_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.ROLE_NOT_FOUND })
    }
    // Check if any user is using this role
    const users = await models.User.findAll({ where: { roleId: id } })
    if (users.length > 0) {
      logError(req, MASSAGE.ROLE_IS_BEING_USED)
      return res.status(400).json({ message: MASSAGE.ROLE_IS_BEING_USED })
    }
    await models.RoleToPermission.destroy({ where: { roleId: id } })
    await role.destroy()
    res.json({ message: MASSAGE.DELETE_ROLE_SUCCESS })
    logInfo(req, { message: MASSAGE.DELETE_ROLE_SUCCESS })
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.NO_DELETE_ROLE })
  }
})

module.exports = router
