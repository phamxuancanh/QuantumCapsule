const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Grid = sequelize.define(
  'Grid',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tableName: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    columnName: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    columnType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inputType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    editable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    dataSource: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isDisplayTable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isDisplayForm: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    regex: {
      type: DataTypes.STRING,
      allowNull: true
    },
    regexMessage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    displayField: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'grids',
    timestamps: true
  }
)

module.exports = Grid
