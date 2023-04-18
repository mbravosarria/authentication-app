const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: String,
  hashed_password: String,
  salt: String
})

module.exports = mongoose.model('Users', UserSchema)
