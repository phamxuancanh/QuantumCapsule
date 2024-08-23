const { fakerEN: faker } = require('@faker-js/faker')
const Conversation = require('../models/conversation')

const generateConversation = async () => {
  return await Promise.all(Array.from({ length: 10 }, async () => ({
    title: faker.lorem.words(2)
      .split(' ')
      .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1))
      .join(' '),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  })))
}
const seedConversations = async () => {
  try {
    const count = await Conversation.count()
    if (count === 0) {
      const conversations = await generateConversation()
      await Conversation.bulkCreate(conversations, { validate: true })
    } else {
      console.log('Conversation table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Conversation data: ${error}`)
  }
}

module.exports = seedConversations
