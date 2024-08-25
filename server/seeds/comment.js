const { fakerEN: faker } = require('@faker-js/faker')
const Comment = require('../models/comment')
const User = require('../models/user')
const Topic = require('../models/topic')

const generateUserId = async () => {
  const users = await User.findAll()
  const userIds = users.map(user => user.id)
  const randomIndex = Math.floor(Math.random() * userIds.length)
  const randomUserId = userIds[randomIndex]
  return randomUserId
}

const generateComment = async () => {
  const usedPairs = new Set()
  const comments = []
  const topics = await Topic.findAll()

  // Đảm bảo mỗi topic có ít nhất 1 comment
  for (const topic of topics) {
    const topicId = topic.id
    const userId = await generateUserId()
    const pair = `${userId}-${topicId}`

    if (!usedPairs.has(pair)) {
      usedPairs.add(pair)
      comments.push({
        topicId,
        userId,
        status: true,
        content: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      })
    }
  }

  // Nếu muốn thêm nhiều comment ngẫu nhiên hơn, thêm logic này sau đó
  while (comments.length < 2) { // hoặc số lượng comment bạn muốn tạo thêm
    const userId = await generateUserId()
    const topicId = topics[Math.floor(Math.random() * topics.length)].id
    console.log(topicId)
    console.log(topicId)
    const pair = `${userId}-${topicId}`

    if (!usedPairs.has(pair)) {
      usedPairs.add(pair)
      comments.push({
        topicId,
        userId,
        status: true,
        content: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      })
    }
  }

  return comments
}

const seedComments = async () => {
  try {
    const count = await Comment.count()
    if (count === 0) {
      const comments = await generateComment()
      await Comment.bulkCreate(comments, { validate: true })
    } else {
      console.log('Comment table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Comment data: ${error}`)
  }
}

module.exports = seedComments
