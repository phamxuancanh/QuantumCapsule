/* eslint-disable camelcase */
const { fakerEN: faker } = require('@faker-js/faker')
const Pet = require('../models/pet')

const sampleNames = ['Pikachu1', 'Pikachu2', 'Pikachu3', 'Pikachu4']
const sampleimgUrl = [
  'https://canhbk29.s3.ap-southeast-2.amazonaws.com/pet_gif/captainchu.gif',
  'https://canhbk29.s3.ap-southeast-2.amazonaws.com/pet_gif/pikachu.gif',
  'https://canhbk29.s3.ap-southeast-2.amazonaws.com/pet_gif/pikachu-sleep.gif',
  'https://canhbk29.s3.ap-southeast-2.amazonaws.com/pet_gif/pikachu-pokemon.gif'
]
const pointsRequiredValues = [0, 10, 15, 20]

const generatePet = async () => {
  const pets = []

  for (let i = 0; i < sampleNames.length; i++) {
    const name = sampleNames[i]
    const id = name === 'Pikachu1' ? 'pet1' : name === 'Pikachu2' ? 'pet2' : name === 'Pikachu3' ? 'pet3' : name === 'Pikachu4' ? 'pet4' : faker.datatype.uuid()
    const imageUrl = sampleimgUrl[(i + 1) % sampleimgUrl.length]
    const pointsRequired = pointsRequiredValues[i % pointsRequiredValues.length]

    pets.push({
      id,
      name,
      imageUrl,
      pointsRequired,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    })
  }

  return pets
}

const seedPets = async () => {
  const pets = await generatePet()
  try {
    const count = await Pet.count()
    if (count === 0) {
      await Pet.bulkCreate(pets, { validate: true })
    } else {
      console.log('Pet table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Pet data: ${error}`)
  }
}

module.exports = seedPets
