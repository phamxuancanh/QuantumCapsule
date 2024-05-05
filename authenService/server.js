const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const { sequelize } = require('./models')
const initDataController = require('./controllers/init-data')
const examController = require('./controllers/exam')
const questionAdminController = require('./controllers/question_admin')
const questionController = require('./controllers/question')
const authController = require('./controllers/auth')
const courseController = require('./controllers/course')
const learningController = require('./controllers/learning')
const lessionController = require('./controllers/lession')
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
app.use(`${API_PREFIX}/init-data`, initDataController)
app.use(`${API_PREFIX}/exams`, examController)
app.use(`${API_PREFIX}/question_admin`, questionAdminController)
app.use(`${API_PREFIX}/questions`, questionController)
app.use(`${API_PREFIX}/courses`, courseController)
app.use(`${API_PREFIX}/learn`, learningController)
app.use(`${API_PREFIX}/lessions`, lessionController)

// app.use(`${API_PREFIX}/dashboard`, dashboardController)

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
