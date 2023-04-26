const bcrypt = require('bcrypt')
const Users = require('../models/users')

const encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const validatePassword = function (user, password) {
  return user.password ? bcrypt.compare(password, user.password) : false
}

const findOrCreate = (id, name, email, photo, done) => {
  Users.findOne({ social_id: id }).then((currentUser) => {
    if (currentUser) {
      if (!currentUser.verified) {
        done(null, false, { message: 'You must verify your email adress' })
      } else {
        done(null, currentUser)
      }
    } else {
      Users.findOne({ email }).then((emailExist) => {
        if (emailExist) {
          done(null, false, { message: 'Email already in use' })
        } else {
          new Users({
            social_id: id,
            email,
            name,
            photo,
            verified: true
          })
            .save()
            .then((newUser) => {
              done(null, newUser)
            })
        }
      })
    }
  })
}

module.exports = {
  encryptPassword,
  validatePassword,
  findOrCreate
}
