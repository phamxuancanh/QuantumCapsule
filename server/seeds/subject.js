const { fakerEN: faker } = require('@faker-js/faker')
const Subject = require('../models/subject')

const sampleNames = ['Toán', 'Tiếng Việt']

const generateSubject = async () => {
  const subjects = []

  for (let i = 0; i < sampleNames.length; i++) {
    const name = sampleNames[i]
    const id = name === 'Toán' ? 'subject1' : name === 'Tiếng Việt' ? 'subject2' : faker.datatype.uuid()
    subjects.push({
      id,
      name,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    })
  }

  return subjects
}

const seedSubjects = async () => {
  const subjects = await generateSubject()
  try {
    const count = await Subject.count()
    if (count === 0) {
      await Subject.bulkCreate(subjects, { validate: true })
    } else {
      console.log('Subject table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Subject data: ${error}`)
  }
}

module.exports = seedSubjects
