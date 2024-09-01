const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const TheoryKeyword = sequelize.define(
  'TheoryKeyword',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    keywordId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    theoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'theory_keywords',
    indexes: [
      {
        unique: true,
        fields: ['keywordId', 'theoryId']
      }
    ],
    timestamps: true
  }
)
module.exports = TheoryKeyword
