const { models } = require('../models')
const { verifyToken } = require('../utils')

const isAuthenticated = async (req, res, next) => {
  let userId = null
  if (req.headers.authorization) {
    const [, accessTokenFromHeader] = req.headers.authorization.split(' ')
    if (accessTokenFromHeader) {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
      const verified = await verifyToken(
        accessTokenFromHeader,
        accessTokenSecret
      )
      if (verified) {
        userId = verified.payload.id
        req.user = verified.payload
      }
    }
    if (userId) {
      const kq = await models.User.findOne({
        where: {
          id: userId
        }
      })
      if (kq) return next()
    }
  }
  return res.status(401).json({
    code: 401,
    message: 'Unauthorized'
  })
}

const checkUserPermission = (req, res, next) => {
  console.log('check user permission__________')
  if (req.user) {
    console.log('req__________', req)
    const permissions = req.user.GroupWithRoles.Permissions
    console.log('permissions__________', permissions)
    const currentUrl = req.baseUrl
    console.log('currentUrl__________', currentUrl)
    const method = req.method
    console.log('method__________', method)

    const hasPermission = permissions.some(permission =>
      (permission.url === currentUrl && permission.method === method) ||
      (permission.url === currentUrl && permission.method === 'ANY')
    )
    if (hasPermission) {
      next()
    } else {
      return res.status(403).json({
        code: 403,
        message: 'User does not have the required permission'
      })
    }
  } else {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized'
    })
  }
}

module.exports = {
  isAuthenticated,
  checkUserPermission
}
