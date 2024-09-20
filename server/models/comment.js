const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Comment = sequelize.define(
  'Comment',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    theoryId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isView: {
      type: DataTypes.BOOLEAN
    },
    content: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'comments',
    timestamps: true
  }
)

module.exports = Comment
