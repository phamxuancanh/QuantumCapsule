const { fakerEN: faker } = require('@faker-js/faker')
const User = require('../models/user')
const Role = require('../models/role')
const bcrypt = require('bcrypt')

const generateRoleId = async () => {
  const roles = await Role.findAll() // Assuming Role.findAll() returns a Promise
  const roleIds = roles.map(role => role.id) // Extracting role IDs from role objects

  const randomIndex = Math.floor(Math.random() * roleIds.length) // Generating a random index
  const randomRoleId = roleIds[randomIndex] // Getting a random role ID

  console.log(randomRoleId)
  return randomRoleId
}

const generateUsers = async () => {
  return await Promise.all(Array.from({ length: 10 }, async () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatar(),
    description: faker.person.jobDescriptor(),
    email: faker.internet.email(),
    gender: faker.datatype.boolean(),
    age: faker.number.int({ min: 18, max: 60 }),
    password: faker.internet.password(),
    username: faker.internet.userName(),
    refreshToken: null,
    expire: faker.date.future(),
    emailVerified: false,
    otp: faker.number.int(),
    otpExpire: faker.date.future(),
    roleId: await generateRoleId(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  })))
}
const seedAdminUser = async () => {
  const saltRounds = 10
  const plainPassword = 'Ronaldo123@'
  const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds)

  const adminUser = {
    firstName: 'Admin',
    lastName: 'User',
    avatar: '',
    description: 'Administrator',
    email: 'phxuancanh@gmail.com',
    gender: true,
    age: 30,
    password: hashedPassword,
    username: 'admin123',
    refreshToken: null,
    expire: faker.date.future(),
    emailVerified: true,
    otp: null,
    otpExpire: null,
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  console.log(adminUser)
  return adminUser
}
const seedUsers = async () => {
  try {
    const count = await User.count()
    if (count === 0) {
      const users = await generateUsers()
      const adminUser = await seedAdminUser()
      await User.bulkCreate([adminUser, ...users], { validate: true })

      // await User.bulkCreate(users, { validate: true })
    } else {
      console.log('Users table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Users data: ${error}`)
  }
}

module.exports = seedUsers
