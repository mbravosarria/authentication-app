const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

const encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

module.exports = {
  encryptPassword
}
