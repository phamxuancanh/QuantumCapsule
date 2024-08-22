const sequelize = require('./init')
const User = require('./user')
const Permission = require('./permission')
const Role = require('./role')
const RoleToPermission = require('./role_to_permission')
const Route = require('./route')
const Grid = require('./grid')
const Subject = require('./subject')
const Skill = require('./skill')
const Topic = require('./topic')

Role.hasMany(User, { foreignKey: 'roleId' })
User.belongsTo(Role, { foreignKey: 'roleId' })

RoleToPermission.belongsTo(Role, { foreignKey: 'roleId' })
RoleToPermission.belongsTo(Permission, { foreignKey: 'permissionId' })

Role.belongsToMany(Permission, { through: RoleToPermission, foreignKey: 'roleId' })
Permission.belongsToMany(Role, { through: RoleToPermission, foreignKey: 'permissionId' })

Subject.hasMany(Skill, { foreignKey: 'subjectId' })
Skill.belongsTo(Subject, { foreignKey: 'subjectId' })

Skill.hasMany(Topic, { foreignKey: 'skillId' })
Topic.belongsTo(Skill, { foreignKey: 'skillId' })

module.exports = {
  sequelize,
  models: {
    User,
    Permission,
    Role,
    RoleToPermission,
    Route,
    Grid,
    Subject,
    Skill,
    Topic
  }
}
