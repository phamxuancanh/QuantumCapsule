const express = require('express')
const router = express.Router()
const gridController = require('../controllers/grid')

router.get('/getBooleanDirections', gridController.getBooleanDirections)
router.get('/findAll', gridController.findAll)
router.post('/create', gridController.create)
router.put('/update/:id', gridController.update)
router.delete('/delete/:id', gridController.remove)
router.get('/getColumnTypeDirections', gridController.getColumnTypeDirections)
router.get('/getInputTypeDirections', gridController.getInputTypeDirections)
router.get('/filterByTableName', gridController.filterByTableName)

module.exports = router
