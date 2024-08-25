/* eslint-disable camelcase */
const { fakerEN: faker } = require('@faker-js/faker')
const UserConversations = require('../models/user_conversation')
const User = require('../models/user')
const Conversation = require('../models/conversation')

const generateUserId = async () => {
  const users = await User.findAll()
  const userIds = users.map(user => user.id)
  const randomIndex = Math.floor(Math.random() * userIds.length)
  const randomUserId = userIds[randomIndex]
  return randomUserId
}

const generateConversationId = async () => {
  const conversations = await Conversation.findAll()
  const conversationIds = conversations.map(conver => conver.id)
  const randomIndex = Math.floor(Math.random() * conversationIds.length)
  const randomConversationId = conversationIds[randomIndex]
  return randomConversationId
}

const generateUserConversation = async () => {
  const usedPairs = new Set()
  const user_conversations = []

  while (user_conversations.length < 10) {
    const userId = await generateUserId()
    const conversationId = await generateConversationId()
    const pair = `${userId}-${conversationId}`

    if (!usedPairs.has(pair)) {
      usedPairs.add(pair)
      user_conversations.push({
        userId,
        conversationId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      })
    }
  }
  return user_conversations
}

const seedUserConversations = async () => {
  try {
    const count = await UserConversations.count()
    if (count === 0) {
      const user_conversations = await generateUserConversation()
      await UserConversations.bulkCreate(user_conversations, { validate: true })
    } else {
      console.log('UserConversations table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed UserConversations data: ${error}`)
  }
}

module.exports = seedUserConversations
