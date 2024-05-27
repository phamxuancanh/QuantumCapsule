const express = require('express')
const { models } = require('../models')
const { isAuthenticated } = require('../middlewares/authentication')
const router = express.Router()

const { infoLogger, errorLogger } = require('../logs/logger')

const MASSAGE = {
  PERMISSION_NOT_FOUND: 'Permissions not found',
  ROLE_NOT_FOUND: 'Role not found',
  ROLE_TO_PERMISSION_NOT_FOUND: 'RoleToPermission not found',
  ROLE_TO_PERMISSION_DELETED_SUCCESSFULLY: 'RoleToPermission deleted successfully'
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

// GET       /role_to_permission/roles/:roleId
router.get('/roles/:roleId', isAuthenticated, async (req, res) => {
  try {
    const { roleId } = req.params
    const permissions = await models.RoleToPermission.findAll({
      where: { roleId },
      attributes: ['roleId', 'permissionId'],
      include: { model: models.Permission, attributes: ['name', 'description'] }
    })
    if (!permissions) {
      logError(req, MASSAGE.PERMISSION_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.PERMISSION_NOT_FOUND })
    }
    res.json(permissions)
    logInfo(req, permissions)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.PERMISSION_NOT_FOUND })
  }
})

// GET       /role_to_permission/permissions/:permissionId
router.get('/permissions/:permissionId', isAuthenticated, async (req, res) => {
  try {
    const { permissionId } = req.params
    const roles = await models.RoleToPermission.findAll({
      where: { permissionId },
      attributes: ['roleId', 'permissionId'],
      include: { model: models.Role, attributes: ['name', 'description'] }
    })
    if (!roles) {
      logError(req, MASSAGE.ROLE_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.ROLE_NOT_FOUND })
    }
    res.json(roles)
    logInfo(req, roles)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.ROLE_NOT_FOUND })
  }
})

// DELETE    /role_to_permission/:roleId/:permissionId
router.delete('/:roleId/:permissionId', isAuthenticated, async (req, res) => {
  try {
    const { roleId, permissionId } = req.params
    const roleToPermission = await models.RoleToPermission.findOne({
      where: { roleId, permissionId }
    })
    if (!roleToPermission) {
      logError(req, MASSAGE.ROLE_TO_PERMISSION_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.ROLE_TO_PERMISSION_NOT_FOUND })
    }
    await roleToPermission.destroy()
    logInfo(req, { message: MASSAGE.ROLE_TO_PERMISSION_DELETED_SUCCESSFULLY })
    res.json({ message: MASSAGE.ROLE_TO_PERMISSION_DELETED_SUCCESSFULLY })
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.ROLE_TO_PERMISSION_DELETED_SUCCESSFULLY })
  }
})
module.exports = router
