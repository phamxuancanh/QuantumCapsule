const { fakerEN: faker } = require('@faker-js/faker')
const Subject = require('../models/subject')

const sampleNames = ['Toán', 'Tiếng Việt', 'Toán Tiếng Anh']

const generateSubject = async () => {
  const categoryCourses = []

  for (let i = 0; i < sampleNames.length; i++) {
    const name = sampleNames[i]
    categoryCourses.push({
      name,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    })
  }

  return categoryCourses
}

const seedSubjects = async () => {
  const categoryCourses = await generateSubject()
  try {
    const count = await Subject.count()
    if (count === 0) {
      await Subject.bulkCreate(categoryCourses, { validate: true })
    } else {
      console.log('Subject table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Subject data: ${error}`)
  }
}

module.exports = seedSubjects
