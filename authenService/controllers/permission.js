const express = require('express')
const { models } = require('../models')
const { isAuthenticated } = require('../middlewares/authentication')
const router = express.Router()
const { infoLogger, errorLogger } = require('../logs/logger')

const MASSAGE = {
  PERMISSION_NOT_FOUND: 'Permission not found',
  NO_CREATE_PERMISSION: 'No can not create permission',
  NO_UPDATE_PERMISSION: 'No can not update permission',
  NO_DELETE_PERMISSION: 'No can not delete permission',
  REQUIRED: 'Name or description are required',
  NAME_REQUIRED: 'Name are required',
  DESCRIPTION_REQUIRED: 'Description are required',
  ROUTER_REQUIRED: 'Router are required',
  NAME_NOT_NUMBER: 'Name must not contain numbers',
  DESCRIPTION_NOT_NUMBER: 'Description must not contain numbers',
  NAME_ALREADY_EXISTS: 'Name already exists',
  DESCRIPTION_ALREADY_EXISTS: 'Description already exists',
  NO_ASSIGN_PERMISSION: 'No can not assign permission to role',
  DELETE_PERMISSION_SUCCESS: 'Delete permission successfully',
  ROLE_NOT_FOUND: 'Role not found',
  PERMISSIONIDS_MUST_BE_ARRAY: 'permissionIds must be an array',
  PERMISSIONIDS_NOT_VALID: 'One or more permissionIds are invalid',
  ASSIGN_SECURITY_SUCCESS: 'Assign permission to role successfully',
  NAME_REQUIRED_NUMBER: 'Name must not contain numbers',
  DESCRIPTION_REQUIRED_NUMBER: 'Description must not contain numbers'
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

// get all permission
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const role = await models.Permission.findAll()
    logInfo(req, role)
    res.json(role)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.PERMISSION_NOT_FOUND })
  }
})

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, description, url, method } = req.body.data
    console.log('check data post server:___________ ', req.body.data)
    if (!name) {
      logError(req, MASSAGE.NAME_REQUIRED)
      return res.status(400).json({ message: MASSAGE.NAME_REQUIRED, field: 'name' })
    }
    if (!isNaN(name)) {
      logError(req, MASSAGE.NAME_NOT_NUMBER)
      return res.status(400).json({ message: MASSAGE.NAME_NOT_NUMBER, field: 'name' })
    }
    const existingPermission = await models.Permission.findOne({ where: { name } })
    if (existingPermission) {
      logError(req, MASSAGE.NAME_ALREADY_EXISTS)
      return res.status(409).json({ message: MASSAGE.NAME_ALREADY_EXISTS, field: 'name' })
    }

    if (!description) {
      logError(req, MASSAGE.DESCRIPTION_REQUIRED)
      return res.status(400).json({ message: MASSAGE.DESCRIPTION_REQUIRED, field: 'description' })
    }
    if (!isNaN(description)) {
      logError(req, MASSAGE.DESCRIPTION_NOT_NUMBER)
      return res.status(400).json({ message: MASSAGE.DESCRIPTION_NOT_NUMBER, field: 'description' })
    }
    const existingDescription = await models.Permission.findOne({ where: { description } })
    if (existingDescription) {
      logError(req, MASSAGE.DESCRIPTION_ALREADY_EXISTS)
      return res.status(409).json({ message: MASSAGE.DESCRIPTION_ALREADY_EXISTS, field: 'description' })
    }

    if (!url || !method) {
      logError(req, MASSAGE.ROUTER_REQUIRED)
      return res.status(400).json({ message: MASSAGE.ROUTER_REQUIRED, field: 'route' })
    }

    const permission = await models.Permission.create({ name, description, url, method })
    logInfo(req, permission)
    res.json(permission)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.NO_CREATE_PERMISSION })
  }
})

router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, url, method } = req.body.data
    console.log('check data put server___________________', req.body.data)
    const permission = await models.Permission.findByPk(id)
    if (!permission) {
      logError(req, MASSAGE.PERMISSION_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.PERMISSION_NOT_FOUND })
    }

    // Check if there are no changes
    if (name === permission.name && description === permission.description && url === permission.url && method === permission.method) {
      logInfo(req, permission)
      return res.json(permission)
    }

    if (!name) {
      logError(req, MASSAGE.NAME_REQUIRED)
      return res.status(400).json({ message: MASSAGE.NAME_REQUIRED, field: 'name' })
    }

    if (!description) {
      logError(req, MASSAGE.DESCRIPTION_REQUIRED)
      return res.status(400).json({ message: MASSAGE.DESCRIPTION_REQUIRED, field: 'description' })
    }
    if (!url || !method) {
      logError(req, MASSAGE.ROUTER_REQUIRED)
      return res.status(400).json({ message: MASSAGE.ROUTER_REQUIRED, field: 'route' })
    }
    // Kiểm tra xem 'name' có phải là chuỗi chứa số hay không
    if (name && !isNaN(name)) {
      logError(req, MASSAGE.NAME_REQUIRED_NUMBER)
      return res.status(400).json({ message: MASSAGE.NAME_REQUIRED_NUMBER, field: 'name' })
    }

    // Kiểm tra xem 'description' có phải là chuỗi chứa số hay không
    if (description && !isNaN(description)) {
      logError(req, MASSAGE.DESCRIPTION_REQUIRED_NUMBER)
      return res.status(400).json({ message: MASSAGE.DESCRIPTION_REQUIRED_NUMBER, field: 'description' })
    }

    if (name && name !== permission.name) {
      const existingPermission = await models.Permission.findOne({ where: { name } })
      if (existingPermission && existingPermission.id !== id) {
        logError(req, MASSAGE.NAME_ALREADY_EXISTS)
        return res.status(409).json({ message: MASSAGE.NAME_ALREADY_EXISTS, field: 'name' })
      }
      permission.name = name
    }

    if (description && description !== permission.description) {
      const existingPermission = await models.Permission.findOne({ where: { description } })
      if (existingPermission && existingPermission.id !== id) {
        logError(req, MASSAGE.DESCRIPTION_ALREADY_EXISTS)
        return res.status(409).json({ message: MASSAGE.DESCRIPTION_ALREADY_EXISTS, field: 'description' })
      }
      permission.description = description
    }
    permission.method = method
    permission.url = url
    await permission.save()
    logInfo(req, permission)
    res.json(permission)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.NO_UPDATE_PERMISSION })
  }
})

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params
    const permission = await models.Permission.findByPk(id)
    if (!permission) {
      logError(req, MASSAGE.PERMISSION_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.PERMISSION_NOT_FOUND })
    }
    await models.RoleToPermission.destroy({ where: { permissionId: id } })
    await permission.destroy()
    logInfo(req, { message: MASSAGE.DELETE_PERMISSION_SUCCESS })
    res.json({ message: MASSAGE.DELETE_PERMISSION_SUCCESS })
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.NO_DELETE_PERMISSION })
  }
})

router.get('/by-role/:roleId', isAuthenticated, async (req, res) => {
  try {
    const { roleId } = req.params
    const permissions = await models.Permission.findAll({
      attributes: ['name', 'description'],
      include: [
        {
          model: models.Role,
          where: {
            id: roleId
          },
          attributes: []
        }
      ]
    })
    logInfo(req, permissions)
    res.json(permissions)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.PERMISSION_NOT_FOUND })
  }
})

router.post('/assign-to-role', isAuthenticated, async (req, res) => {
  try {
    const { roleId, permissionIds } = req.body.data
    if (!Array.isArray(permissionIds)) {
      logError(req, MASSAGE.PERMISSIONIDS_MUST_BE_ARRAY)
      return res.status(400).json({ message: MASSAGE.PERMISSIONIDS_MUST_BE_ARRAY })
    }

    const [role, permissions] = await Promise.all([
      models.Role.findByPk(roleId),
      models.Permission.findAll({
        where: {
          id: permissionIds
        }
      })
    ])

    if (!role) {
      logError(req, MASSAGE.ROLE_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.ROLE_NOT_FOUND })
    }

    if (permissions.length !== permissionIds.length) {
      logError(req, MASSAGE.PERMISSIONIDS_NOT_VALID)
      return res.status(400).json({ message: MASSAGE.PERMISSIONIDS_NOT_VALID })
    }

    await role.setPermissions(permissionIds)
    logInfo(req, { message: MASSAGE.ASSIGN_SECURITY_SUCCESS })
    res.json({ message: MASSAGE.ASSIGN_SECURITY_SUCCESS })
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.NO_ASSIGN_PERMISSION })
  }
})

router.get('/pagination', isAuthenticated, async (req, res) => {
  try {
    const {
      page = '1',
      size = '5',
      search: searchCondition,
      sortKey,
      sortDirection
    } = req.query

    const order = (sortKey && sortDirection && sortDirection !== 'none')
      ? sortKey.includes('.')
        ? [[models[sortKey.split('.')[0]], sortKey.split('.')[1], sortDirection]]
        : [[sortKey, sortDirection]]
      : [['id', 'DESC']]

    const dataFromDatabase = await models.Permission.findAll({
      attributes: ['id', 'name', 'description', 'url', 'method'],
      order: order
    })

    const dataAfterNameSearch = applyNameSearch(
      searchCondition,
      dataFromDatabase
    )

    const totalRecords = dataAfterNameSearch.length
    const totalPages = Math.ceil(totalRecords / Number(size))

    const dataOfCurrentWindow = getDataInWindowSize(
      size,
      page,
      dataAfterNameSearch
    )

    const response = {
      page: Number(page),
      size: Number(size),
      totalPages,
      totalRecords,
      currentRecords: dataOfCurrentWindow.length,
      data: dataOfCurrentWindow
    }
    res.json(response)
    logInfo(req, dataOfCurrentWindow)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.PERMISSION_NOT_FOUND })
  }
})

function applyNameSearch (searchCondition, data) {
  if (searchCondition) {
    data = data.filter(
      (d) => d.description?.toLowerCase()?.indexOf(searchCondition.toLowerCase()) >= 0
    )
  }
  return data
}

function getDataInWindowSize (size, page, data) {
  if (!isNaN(Number(size)) && !isNaN(Number(page))) {
    data = data.slice(
      Number(size) * (Number(page) - 1),
      Number(size) * Number(page)
    )
  }
  return data
}

module.exports = router
