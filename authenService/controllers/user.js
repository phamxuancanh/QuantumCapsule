const express = require('express')
const { models } = require('../models')
const { isAuthenticated, checkUserPermission } = require('../middlewares/authentication')
const bcrypt = require('bcrypt')
const {
  SALT_KEY
} = require('../utils')

const router = express.Router()
const { infoLogger, errorLogger } = require('../logs/logger')

const MASSAGE = {
  USER_NOT_FOUND: 'User not found',
  NO_CREATE_USER: 'No can not create user',
  NO_UPDATE_USER: 'No can not update user',
  NO_DELETE_USER: 'No can not delete user',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  REQUIRED: 'Username or password or roleId are required',
  ROLE_NOT_FOUND: 'Role not found',
  DELETE_USER_SUCCESS: 'Delete user successfully',
  UPDATE_USER_SUCCESS: 'Update user',
  UPDATE_USER_ERROR: 'You can not update user role'
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

// get all user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await models.User.findAll()
    logInfo(req, user)
    res.json(user)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.USER_NOT_FOUND })
  }
})
// get user pagination
router.get('/pagination', isAuthenticated, async (req, res) => {
  try {
    const {
      page = '1',
      size = '8',
      search: searchCondition,
      sortKey,
      sortDirection
    } = req.query

    const order = (sortKey && sortDirection && sortDirection !== 'none')
      ? sortKey.includes('.')
        ? [[models[sortKey.split('.')[0]], sortKey.split('.')[1], sortDirection]]
        : [[sortKey, sortDirection]]
      : [['id', 'DESC']]

    const dataFromDatabase = await models.User.findAll({
      attributes: ['id', 'username', 'roleId', 'createdAt', 'updatedAt'],
      include: [
        {
          model: models.Role,
          attributes: ['id', 'description']
        }
      ],
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

    res.json({
      page: Number(page),
      size: Number(size),
      totalPages,
      totalRecords,
      currentRecords: dataOfCurrentWindow.length,
      data: dataOfCurrentWindow
    })
    logInfo(req, dataOfCurrentWindow)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.USER_NOT_FOUND })
  }
})

function applyNameSearch (searchCondition, data) {
  if (searchCondition) {
    data = data.filter(
      (d) => d.username?.toLowerCase()?.indexOf(searchCondition.toLowerCase()) >= 0
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

// create user
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { username, password, roleId } = req.body.data
    if (!username || !password || !roleId) {
      logError(req, MASSAGE.REQUIRED)
      return res.status(400).json({ message: MASSAGE.REQUIRED })
    }
    const user = await models.User.findOne({
      where: { username }
    })

    if (user) {
      logError(req, MASSAGE.USERNAME_ALREADY_EXISTS)
      return res.status(400).json({ message: MASSAGE.USERNAME_ALREADY_EXISTS })
    } else {
      const hashPassword = bcrypt.hashSync(password, SALT_KEY)
      const newUser = {
        username,
        password: hashPassword,
        roleId
      }
      const createdUser = await models.User.create(newUser)
      if (!createdUser) {
        logError(req, MASSAGE.NO_CREATE_USER)
        return res.status(400).json({ message: MASSAGE.NO_CREATE_USER })
      }
      logInfo(req, createdUser)
      res.json(createdUser)
    }
  } catch (error) {
    res.json({ error })
  }
})

async function checkUserRole (req, res, next) {
  const { id } = req.params
  const userToEdit = await models.User.findByPk(id)

  if (!userToEdit) {
    logError(req, MASSAGE.USER_NOT_FOUND)
    return res.status(404).json({ message: MASSAGE.USER_NOT_FOUND })
  }
  const currentUserRole = req.user.GroupWithRoles.id
  const userToEditRole = userToEdit.roleId
  const newRole = req.body.data.roleId
  console.log('------------------------------------------------------')
  console.log('check user', req.user)
  console.log('check current user role', currentUserRole)
  console.log('check user to edit role', userToEditRole)
  console.log('check new role', newRole)

  // nếu user hiện tại là Manager và muốn sửa role của user khác thành Admin thì không được
  if (currentUserRole === 2 && newRole === 1) {
    return res.status(403).json({ message: MASSAGE.UPDATE_USER_ERROR })
  }
  // nếu user hiện tại là Admin thì được phép sửa role của user khác thành Admin
  if (currentUserRole === 1) {
    return next()
  }
  // nếu user hiện tại là Manager và muốn sửa role của user khác thành Manager hoặc User  thì được
  if (currentUserRole === 2 && (userToEditRole === 2 || userToEditRole === 3)) {
    return next()
  }
  return res.status(403).json({ message: MASSAGE.UPDATE_USER_ERROR })
}

// edit user
router.put('/:id', isAuthenticated, checkUserRole, async (req, res) => {
  try {
    const { id } = req.params
    const { roleId } = req.body.data
    const user = await models.User.findByPk(id)
    if (!user) {
      logError(req, MASSAGE.USER_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.USER_NOT_FOUND })
    }
    const updatedUser = await user.update({ roleId })
    if (!updatedUser) {
      logError(req, MASSAGE.NO_UPDATE_USER)
      return res.status(400).json({ message: MASSAGE.NO_UPDATE_USER })
    }
    logInfo(req, updatedUser)
    res.json(updatedUser)
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.NO_UPDATE_USER })
  }
})
// delete user
router.delete('/:id', isAuthenticated, checkUserPermission, async (req, res) => {
  try {
    const { id } = req.params
    const user = await models.User.findByPk(id)
    if (!user) {
      logError(req, MASSAGE.USER_NOT_FOUND)
      return res.status(404).json({ message: MASSAGE.USER_NOT_FOUND })
    }

    await Promise.all([
      models.CourseProgress.destroy({ where: { userId: id } }),
      models.UserEnterExitExamRoom.destroy({ where: { userId: id } }),
      models.QuestionDiscussion.destroy({ where: { userId: id } }),
      models.UserAnswerHistory.destroy({ where: { userId: id } }),
      models.TempUserAnswer.destroy({ where: { userId: id } })
    ])

    await user.destroy()
    logInfo(req, MASSAGE.DELETE_USER_SUCCESS)
    res.json({ message: MASSAGE.DELETE_USER_SUCCESS })
  } catch (error) {
    logError(req, error)
    res.status(500).json({ message: MASSAGE.NO_DELETE_USER })
  }
})

module.exports = router
