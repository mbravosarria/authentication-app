const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./config/db')
const cors = require('cors')

require('dotenv').config()

const app = express()
const port = process.env.PORT

connectDB()

const bootstrapServer = async () => {
  app.use(bodyParser.json({ limit: '30mb', extended: true }))
  app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
  app.use(cors())

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Authentication API listen on port ${port}`)
  })
}

bootstrapServer()
