const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const { sequelize } = require('./models')
const authController = require('./controllers/auth')
const seedDatabase = require('./seeds/index')
const { API_PREFIX } = require('./utils')

const app = express()

app.set('trust proxy', true)

// TODO: apply redis later

app.use(cors())
app.use(morgan('combined'))
app.use(express.json({ limit: '50mb' }))

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(`${API_PREFIX}/auth`, authController)

async function startServer () {
  try {
    await sequelize.sync()
    console.log('Database synchronized successfully')
    await seedDatabase()
    console.log('Data seeded successfully')

    app.listen(process.env.PORT, () => {
      console.log('Server is running')
    })
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

startServer()
