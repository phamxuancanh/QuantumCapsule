const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/defaultAVT.jpg'
    },
    description: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    district: {
      type: DataTypes.STRING
    },
    ward: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    grade: {
      type: DataTypes.INTEGER
    },
    birthOfDate: {
      type: DataTypes.DATE
    },
    starPoint: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.STRING
    },
    expire: {
      type: DataTypes.DATE
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    otp: {
      type: DataTypes.STRING
    },
    otpExpire: {
      type: DataTypes.DATE
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    petId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'users',
    timestamps: true
  }
)

module.exports = User
