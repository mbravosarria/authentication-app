const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  social_id: {
    type: String
  },
  photo: {
    type: String
  },
  name: {
    type: String
  },
  bio: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  verified: {
    type: Boolean,
    require: true,
    default: false
  }
})

module.exports = mongoose.model('Users', UserSchema)
