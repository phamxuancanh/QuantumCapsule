const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Enrollment = sequelize.define(
  'Enrollment',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lessonId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'enrollment',
    timestamps: true
  }
)

module.exports = Enrollment
