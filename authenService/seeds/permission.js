const { fakerEN: faker } = require('@faker-js/faker')
const Permission = require('../models/permission')

// const generateNameandDescription = () => {
//   const randomNumber = Math.floor(Math.random() * 3) + 1
//   if (randomNumber === 1) {
//     return { name: 'P1', description: 'Delete User' }
//   } else if (randomNumber === 2) {
//     return { name: 'P2', description: 'View Dashboard' }
//   } else {
//     return { name: 'P3', description: 'Edit Profile' }
//   }
// }

// const permissions = Array.from({ length: 5 }, () => {
//   const { name, description } = generateNameandDescription()
//   return {
//     name,
//     description,
//     createdAt: faker.date.past(),
//     updatedAt: faker.date.recent()
//   }
// })

const permissions = [
  {
    name: 'P1',
    description: 'Delete User',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'P2',
    description: 'View Dashboard',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'P3',
    description: 'Edit Profile',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

const seedPermissions = async () => {
  try {
    const count = await Permission.count()
    if (count === 0) {
      await Permission.bulkCreate(permissions, { validate: true })
    } else {
      console.log('Permission table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Permission data: ${error}`)
  }
}

module.exports = seedPermissions
