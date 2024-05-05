const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const RoleToPermission = sequelize.define(
  'RoleToPermission',
  {
    roleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    permissionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    tableName: 'role_to_permission',
    indexes: [
      {
        unique: true,
        fields: ['roleId', 'permissionId']
      }
    ]
  }
)
module.exports = RoleToPermission
