const seedGrids = require('./grid')
const seedPermissions = require('./permission')
const seedRoles = require('./role')
const seedRoleToPermissions = require('./role_to_permission')
const seedUsers = require('./user')
const seedSubjects = require('./subject')
const seedSkill = require('./skill')
const seedTopics = require('./topic')
const seedNotifications = require('./notification')
const seedNotificationRecipients = require('./notification_recipient')
const seedComments = require('./comment')
const seedConversations = require('./conversation')
const seedUserConversations = require('./user_conversation')
const seedExams = require('./exam')
const seedPractices = require('./practice')
const seedDatabase = async () => {
  try {
    await seedPermissions()
    await seedRoles()
    await seedUsers()
    await seedRoleToPermissions()
    await seedGrids()
    await seedSubjects()
    await seedSkill()
    await seedTopics()
    await seedNotifications()
    await seedNotificationRecipients()
    await seedComments()
    await seedConversations()
    await seedUserConversations()
    await seedExams()
    await seedPractices()
  } catch (error) {
    console.log(`Failed to seed database: ${error}`)
  }
}

module.exports = seedDatabase
