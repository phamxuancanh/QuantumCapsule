const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const ChapterKeyword = sequelize.define(
  'ChapterKeyword',
  {
    keywordId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    chapterId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    tableName: 'chapter_keyword',
    indexes: [
      {
        unique: true,
        fields: ['keywordId', 'chapterId']
      }
    ],
    timestamps: true
  }
)
module.exports = ChapterKeyword
