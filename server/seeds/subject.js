/* eslint-disable camelcase */
const { fakerEN: faker } = require('@faker-js/faker')
const Subject = require('../models/subject')

const sampleNames = ['Toán', 'Tiếng Việt']

const generateSubject = async () => {
  const subjects = []

  for (let i = 0; i < sampleNames.length; i++) {
    const name = sampleNames[i]
    const id = name === 'Toán' ? 'subject1' : name === 'Tiếng Việt' ? 'subject2' : faker.datatype.uuid()
    const image_on = name === 'Toán' ? 'https://media.discordapp.net/attachments/1284566452833222777/1285302727257358368/icon_math_on.png?ex=66e9c6f1&is=66e87571&hm=17d244b98db4b89f32ef0c2ec84e1b98654fb3cc53cb0813fe23a6c1859c62e7&=&format=webp&quality=lossless' : name === 'Tiếng Việt' ? 'https://media.discordapp.net/attachments/1284566452833222777/1285302726690865216/icon_vietnamese_literature_on.png?ex=66e9c6f1&is=66e87571&hm=e54d033f3c940cfd76de35bc8e576f2d0135fff1bd61d73bc65dcbed6c8cdb0f&=&format=webp&quality=lossless' : ''
    const image_off = name === 'Toán' ? 'https://media.discordapp.net/attachments/1284566452833222777/1285302726984470528/icon_math_off.png?ex=66e9c6f1&is=66e87571&hm=c7886d173bcfc1d4e4b14983ce96d5c06d48188df95723b66db52b44c74ad4d1&=&format=webp&quality=lossless' : name === 'Tiếng Việt' ? 'https://media.discordapp.net/attachments/1284566452833222777/1285302727500501002/icon_vietnamese_literature_off.png?ex=66e9c6f2&is=66e87572&hm=d7e6eeb265b655b04b3f2c09750494d835ac589ea70c072e7f610cbb00690074&=&format=webp&quality=lossless' : ''

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
