const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const cookieSession = require('cookie-session')
const passport = require('./config/passport-setup')
const flash = require('connect-flash')
const swaggerUi = require('swagger-ui-express')

const connectDB = require('./config/db')
const router = require('./routes')
const specs = require('./config/swagger')

const { PORT, COOKIE_SESSION_KEY } = require('./utils/secrets')

const app = express()
const port = PORT

connectDB()

const bootstrapServer = async () => {
  app.use(logger('dev'))
  app.use(bodyParser.json({ limit: '30mb', extended: true }))
  app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
  app.use(cors())
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      resave: false,
      saveUninitialize: false,
      keys: [COOKIE_SESSION_KEY],
      cookie: { secure: false }
    })
  )
  app.use(flash())
  app.use('/api', router)
  app.use(passport.initialize())
  app.use(passport.session())

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
