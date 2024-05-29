const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');

const { sequelize } = require('./models')
const seedDatabase = require('./seeds/index')
const IndexRouter = require("./routes/index");

const app = express()

app.set('trust proxy', true)

// TODO: apply redis later

app.use(cors())
app.use(morgan('combined'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
// app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use("/", IndexRouter);
app.use(bodyParser.json());
// app.use((req, res, next) => {
//   const err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });
async function startServer () {
  try {
    await sequelize.sync()
    console.log('Database synchronized successfully')
    await seedDatabase()
    console.log('Data seeded successfully')

    app.listen(process.env.PORT, () => {
      console.log('Server is running on port', process.env.PORT)
    })
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

startServer()
