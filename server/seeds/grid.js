const Grid = require('../models/grid')
// (true, true, true, "tableName", null, "tableName", "grids", "STRING", "text", 0, '', '', null),
// (true, true, true, "columnName", null, "columnName", "grids", "STRING", "text", 5, '', '', null),
// (true, true, true, "columnType", '/grids/getColumnTypeDirections', "columnType", "grids", "STRING", "select", 20, '', '', null),
// (true, true, true, "inputType", '/grids/getInputTypeDirections', "inputType", "grids", "STRING", "select", 20, '', '', null),
// (true, true, true, "label", null, "label", "grids", "STRING", "text", 10, '', '', null),
// (true, true, true, "editable", "/base/getBooleanDirections", "editable", "grids", "STRING", "select", 25, '', '', null),
// (true, true, true, "dataSource", null, "dataSource", "grids", "STRING", "text", 35, '', '', null),
// (true, true, true, "isDisplayTable", "/base/getBooleanDirections", "isDisplayTable", "grids", "STRING", "select", 40, '', '', null),
// (true, true, true, "isDisplayForm", "/base/getBooleanDirections", "isDisplayForm", "grids", "STRING", "select", 40, '', '', null),
// (true, true, true, "regex", null, "regex", "grids", "STRING", "text", 50, '', '', null),
// (true, true, true, "regexMessage", null, "regexMessage", "grids", "STRING", "text", 50, '', '', null),
// (true, true, true, "position", null, "position", "grids", "NUMBER", "number", 15, '', '', null),
// (true, true, true, "displayField", null, "displayField", "grids", "STRING", "text", 55, '', '', null),
const grids = [
  {
    tableName: 'grids',
    columnName: 'id',
    columnType: 'NUMBER',
    inputType: 'number',
    label: 'ID',
    editable: false,
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
    position: 25,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'dataSource',
    columnType: 'STRING',
    inputType: 'text',
    label: 'Data Source',
    editable: true,
    dataSource: null,
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 35,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'isDisplayTable',
    columnType: 'STRING',
    inputType: 'select',
    label: 'Is Display Table',
    editable: true,
    dataSource: '/grids/getBooleanDirections',
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 40,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'isDisplayForm',
    columnType: 'STRING',
    inputType: 'select',
    label: 'Is Display Form',
    editable: true,
    dataSource: '/grids/getBooleanDirections',
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 40,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'regex',
    columnType: 'STRING',
    inputType: 'text',
    label: 'Regex',
    editable: true,
    dataSource: null,
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 50,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'regexMessage',
    columnType: 'STRING',
    inputType: 'text',
    label: 'Regex Message',
    editable: true,
    dataSource: null,
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 50,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'position',
    columnType: 'NUMBER',
    inputType: 'number',
    label: 'Position',
    editable: true,
    dataSource: null,
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 15,
    displayField: ''
  },
  {
    tableName: 'grids',
    columnName: 'displayField',
    columnType: 'STRING',
    inputType: 'text',
    label: 'Display Field',
    editable: true,
    dataSource: null,
    isDisplayTable: true,
    isDisplayForm: true,
    regex: '',
    regexMessage: '',
    position: 55,
    displayField: ''
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
