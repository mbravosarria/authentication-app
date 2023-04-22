const mongoose = require('mongoose')
const { MONGO_URI } = require('../utils/secrets')

const connectDB = async () => {
  const connection = await mongoose.connect(MONGO_URI)

  console.log(`🚀 MongoDB Connected: ${connection.connection.host}`)
}

module.exports = connectDB
