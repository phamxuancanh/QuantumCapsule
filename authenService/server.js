const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models')
const seedDatabase = require('./seeds/index')
const IndexRouter = require("./routes/index");
const bodyParser = require('body-parser')
const app = express()
// const cors = require('cors')
app.set('trust proxy', true)

// app.use(cors())

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:4000");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(morgan('combined'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use("/", IndexRouter);

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