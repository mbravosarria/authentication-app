const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const passportConfig = require('./config/passport-setup')
const flash = require('connect-flash')
const swaggerUi = require('swagger-ui-express')

const connectDB = require('./config/db')
const router = require('./routes')
const specs = require('./config/swagger')

const { PORT, SECRET_KEY } = require('./utils/secrets')

const app = express()
const port = PORT

connectDB()

const bootstrapServer = async () => {
  app.use(logger('dev'))
  app.use(bodyParser.json({ limit: '30mb', extended: true }))
  app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
  app.use(cors())
  app.use(express.static('public'))
  app.use(
    session({
      secret: SECRET_KEY,
      resave: false,
      saveUninitialized: false
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  passportConfig(passport)
  app.use(flash())
  app.use('/api', router)

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  )

  app.listen(port, () => {
    console.log(`🚀 Authentication API listen on port ${port}`)
  })
}

bootstrapServer()
