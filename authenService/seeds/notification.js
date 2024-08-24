const { fakerEN: faker } = require('@faker-js/faker')
const Notification = require('../models/notification')

const generateNotifications = async () => {
  const urls = ['/myCourses', '/home']

  return await Promise.all(Array.from({ length: 10 }, async () => ({
    title: faker.lorem.words(2)
      .split(' ')
      .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1))
      .join(' '),
    message: faker.lorem.sentence(),
    url: urls[Math.floor(Math.random() * urls.length)],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  })))
}
const seedNotifications = async () => {
  try {
    const count = await Notification.count()
    if (count === 0) {
      const notifications = await generateNotifications()
      await Notification.bulkCreate(notifications, { validate: true })
    } else {
      console.log('Notifications table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Notifications data: ${error}`)
  }
}

module.exports = seedNotifications
