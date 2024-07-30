const Grid = require('../models/grid')

const grids = [
  {
    tableName: 'grids',
    columnName: 'tableName',
    columnType: 'STRING',
    inputType: 'text',
    label: 'Table Name',
    editable: true,
    dataSource: null,
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 0,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'columnName',
    columnType: 'STRING',
    inputType: 'text',
    label: 'Column Name',
    editable: true,
    dataSource: null,
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 5,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'columnType',
    columnType: 'STRING',
    inputType: 'select',
    label: 'Column Type',
    editable: true,
    dataSource: '/grids/getColumnTypeDirections',
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 20,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'inputType',
    columnType: 'STRING',
    inputType: 'select',
    label: 'Input Type',
    editable: true,
    dataSource: '/grids/getInputTypeDirections',
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 20,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'label',
    columnType: 'STRING',
    inputType: 'text',
    label: 'Label',
    editable: true,
    dataSource: null,
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 10,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'editable',
    columnType: 'STRING',
    inputType: 'select',
    label: 'Editable',
    editable: true,
    dataSource: '/grids/getBooleanDirections',
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 25
  }
]

const seedGrids = async () => {
  try {
    const count = await Grid.count()
    if (count === 0) {
      await Grid.bulkCreate(grids, { validate: true })
    } else {
      console.log('Grids table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Grids data: ${error}`)
  }
}

module.exports = seedGrids
