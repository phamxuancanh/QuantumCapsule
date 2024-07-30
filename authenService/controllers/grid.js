const { models } = require('../models')

const messages = {
  saved: 'Data has been saved',
  updated: 'Data has been updated',
  deleted: 'Data has been deleted'
}

const getBooleanDirections = (req, res) => {
  return res.json([
    { value: 'true', label: 'true' },
    { value: 'false', label: 'false' }
  ])
}
const findAll = async (req, res) => {
  try {
    const dataFromDatabase = await models.Grid.findAll()
    return res.json(dataFromDatabase)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
const create = async (req, res) => {
  try {
    const dataFromDatabase = await models.Grid.create(req.body)
    return res.json(dataFromDatabase)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
const update = async (req, res) => {
  try {
    await models.Grid.update(req.body, {
      where: { id: req.params.id }
    })
    const updatedData = await models.Grid.findOne({
      where: { id: req.params.id }
    })
    return res.json(updatedData)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
const remove = async (req, res) => {
  try {
    await models.Grid.destroy({
      where: { id: req.params.id }
    })
    return res.json({
      message: messages.deleted
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
const filterByTableName = async (req, res) => {
  try {
    console.log('>>>>>>>>', req.query.tableName)
    const dataFromDatabase = await models.Grid.findAll({
      where: { tableName: req.query.tableName }
    })
    return res.json(dataFromDatabase)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
const getColumnTypeDirections = (req, res) => {
  // NUMBER, STRING, DATE, DATETIME, BOOLEAN,
  return res.json([
    { value: 'STRING', label: 'STRING' },
    { value: 'NUMBER', label: 'NUMBER' },
    { value: 'DATE', label: 'DATE' },
    { value: 'DATETIME', label: 'DATETIME' },
    { value: 'BOOLEAN', label: 'BOOLEAN' }
  ])
}
const getInputTypeDirections = (req, res) => {
  // text, number, date, datetime, select, checkbox, radio, textarea,
  return res.json([
    { value: 'text', label: 'text' },
    { value: 'number', label: 'number' },
    { value: 'date', label: 'date' },
    { value: 'datetime', label: 'datetime' },
    { value: 'select', label: 'select' },
    { value: 'checkbox', label: 'checkbox' },
    { value: 'radio', label: 'radio' },
    { value: 'textarea', label: 'textarea' }
  ])
}

module.exports = {
  getBooleanDirections,
  findAll,
  create,
  update,
  remove,
  filterByTableName,
  getColumnTypeDirections,
  getInputTypeDirections
}
