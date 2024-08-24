/* eslint-disable camelcase */
const { fakerEN: faker } = require('@faker-js/faker')
const Practice = require('../models/practice')
const User = require('../models/user')
const Skill = require('../models/skill')
const Subject = require('../models/subject')
const Topic = require('../models/topic')
const generateUserId = async () => {
  const users = await User.findAll()
  const userIds = users.map(user => user.id)
  const randomIndex = Math.floor(Math.random() * userIds.length)
  const randomUserId = userIds[randomIndex]
  return randomUserId
}
const generateSubjectId = async () => {
  const subjects = await Subject.findAll()
  const subjectIds = subjects.map(subject => subject.id)
  const randomIndex = Math.floor(Math.random() * subjectIds.length)
  const randomSubjectId = subjectIds[randomIndex]
  return randomSubjectId
}
const generateTopicId = async () => {
  const topics = await Topic.findAll()
  const topicIds = topics.map(topic => topic.id)
  const randomIndex = Math.floor(Math.random() * topicIds.length)
  const randomTopicId = topicIds[randomIndex]
  return randomTopicId
}
const titlePractice = [
  'BAI THI 1',
  'BAI THI 2 ',
  'BAI THI 3',
  'BAI THI 4'
]
// khong trung lien tuc
const generatePractices = async () => {
  const practices = []
  const skills = await Skill.findAll()

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i]
    const skillId = skill.id
    for (let j = 0; j < 3; j++) {
      const topicName = titlePractice[Math.floor(Math.random() * titlePractice.length)]
      practices.push({
        skillId,
        name: topicName,
        topicId: await generateTopicId(),
        subjectId: await generateSubjectId(),
        picture: 'defaultPicture',
        uploadedBy: await generateUserId(),
        createAt: faker.date.past(),
        updatedAt: faker.date.recent()
      })
    }
  }
  return practices
}

const seedPractices = async () => {
  try {
    const count = await Practice.count()
    if (count === 0) {
      const practices = await generatePractices()
      await Practice.bulkCreate(practices, { validate: true })
    } else {
      console.log('Practices table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Practices data: ${error}`)
  }
}

module.exports = seedPractices
