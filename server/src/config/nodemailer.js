const nodemailer = require('nodemailer')
const {
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  PUBLIC_API_URI,
  PORT
} = require('../utils/secrets')

const sendMail = async (userId, email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: `Bravos Dev <${EMAIL_USERNAME}>`,
    to: email,
    subject: 'Verification Email',
    text: `Please use the following link to verify your email address:
     ${PUBLIC_API_URI}:${PORT}/api/auth/verify-email/${userId}`,
    html: `
      <p>
        Please use the following link to verify your email address: 
        <strong>
          <a href='${PUBLIC_API_URI}/api/auth/verify-email/${userId}' target='_blank'>
            Verify Email
          </a>
        </strong>
      </p>`
  }

  transporter.sendMail(mailOptions, () => {
    transporter.close()
  })
}

module.exports = {
  sendMail
}
