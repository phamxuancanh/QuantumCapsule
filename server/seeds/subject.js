/* eslint-disable camelcase */
const { fakerEN: faker } = require('@faker-js/faker')
const Subject = require('../models/subject')

const sampleNames = ['Toán', 'Tiếng Việt']

const generateSubject = async () => {
  const subjects = []

  for (let i = 0; i < sampleNames.length; i++) {
    const name = sampleNames[i]
    const id = name === 'Toán' ? 'subject1' : name === 'Tiếng Việt' ? 'subject2' : faker.datatype.uuid()
    const image_on = name === 'Toán' ? 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/icon_math_on.png' : name === 'Tiếng Việt' ? 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/icon_vietnamese_literature_on.png' : ''
    const image_off = name === 'Toán' ? 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/icon_math_off.png' : name === 'Tiếng Việt' ? 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/icon_vietnamese_literature_off.png' : ''

    subjects.push({
      id,
      name,
      image_on,
      image_off,
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
