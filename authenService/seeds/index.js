const seedPermissions = require('./permission')
const seedRoles = require('./role')
const seedRoleToPermissions = require('./role_to_permission')
const seedUsers = require('./user')
const seedDatabase = async () => {
    try {
      await seedPermissions()
      await seedRoles()
      await seedUsers()
      await seedRoleToPermissions()
    } catch (error) {
      console.log(`Failed to seed database: ${error}`)
    }
  }
  
  module.exports = seedDatabase