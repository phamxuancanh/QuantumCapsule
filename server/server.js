const express = require('express')
const morgan = require('morgan')
const http = require('http')
const socket = require('./socket')
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const { sequelize } = require('./models')
const seedDatabase = require('./seeds/index')
const IndexRouter = require('./routes/index')
const bodyParser = require('body-parser')
const cors = require('cors')
const socketEvents = require('./socketEvent')
const app = express()
const server = http.createServer(app)

app.set('trust proxy', true)

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}))

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', `http://localhost:${process.env.CLIENT_PORT}`)
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
//   res.setHeader('Access-Control-Allow-Credentials', true)
//   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
//   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
//   res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
//   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200)
//   }
//   next()
// })

app.use(cors({
  // origin: `*`,
  origin: `http://localhost:${process.env.CLIENT_PORT}`,
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  allowedHeaders: 'X-Requested-With,Content-Type,Authorization',
  credentials: true
}))

app.use(cookieParser())
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(morgan('combined'))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/', IndexRouter)
socket.init(server)
socketEvents()
async function startServer () {
  try {
    await sequelize.sync()
    console.log('Database synchronized successfully')
    await seedDatabase()
    console.log('Data seeded successfully')

    server.listen(process.env.PORT, () => {
      console.log('Server is running on port', process.env.PORT)
    })
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

startServer()

module.exports = { app }
