const express = require('express')
const router = express.Router()
const permissionController = require('../controllers/permission')
const { verifyAccessToken  } = require('../middlewares/jwtService')

router.get('/', verifyAccessToken, permissionController.getAllPermissions)
router.post('/', verifyAccessToken, permissionController.createPermission)
router.put('/:id', verifyAccessToken, permissionController.updatePermission)
router.delete('/:id', verifyAccessToken, permissionController.deletePermission)
router.get('/by-role/:roleId', verifyAccessToken, permissionController.getPermissionsByRole)
router.post('/assign-to-role', verifyAccessToken, permissionController.assignPermissionsToRole)
router.get('/pagination', verifyAccessToken, permissionController.getPaginatedPermissions)

module.exports = router