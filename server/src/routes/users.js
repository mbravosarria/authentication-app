const express = require('express')
const { ensureAuthenticated } = require('../middlewares/auth')
const router = express.Router()
const User = require('../models/users')
const { sendMail } = require('../config/nodemailer')
const { encryptPassword, validatePassword } = require('../services/auth')
const { upload, compressImage } = require('../config/multer')
const { PUBLIC_API_URI } = require('../utils/secrets')
const fs = require('fs')
const path = require('path')

router.post('/change-email', ensureAuthenticated, async (req, res) => {
  const { email } = req.body

  const emailExist = await User.findOne({ email })

  if (emailExist) {
    return res.status(400).json({
      success: false,
      message: 'Email already in use'
    })
  }

  if (
    req.user.email &&
    (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
  ) {
    return res.status(400).json({
      success: false,
      message: 'You must provide a new valid email'
    })
  }

  User.updateOne({ _id: req.user._id }, { $set: { email, verified: false } })
    .then(async () => {
      await sendMail(req.user._id, email)
      res.status(200).send('Redirect to login page')
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error
      })
    })
})

router.patch('/change-password/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params
  const { oldPassword, newPassword, confirmPassword } = req.body

  User.findById(id)
    .then(async (user) => {
      if (!(await validatePassword(user, oldPassword))) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect password'
        })
      }

      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{8,}).*$/.test(
          newPassword
        )
      ) {
        return res.status(400).jsonp({
          success: false,
          message:
            'The password must be at least 8 characters long and must include at least one uppercase, one lowercase, one digit, and one special character (!@#$%^&*.)'
        })
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Check your new password'
        })
      }

      User.updateOne(
        { _id: req.user._id },
        { $set: { password: await encryptPassword(newPassword) } }
      )
        .then(async () => {
          return res.status(200).send('Redirect to login page')
        })
        .catch((error) => {
          return res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error
          })
        })
    })
    .catch(() => {
      return res.status(500).json({
        success: false,
        message: 'User not found'
      })
    })
})

router.post(
  '/change-photo-file',
  ensureAuthenticated,
  upload.single('photo'),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.')
    }

    try {
      const compressedFilePath = await compressImage(req.file, 80)
      const oldPhoto = req.user.photo
      const imageUrl = `${PUBLIC_API_URI}/uploads/compressed/${req.file.filename}`
      User.updateOne({ _id: req.user._id }, { $set: { photo: imageUrl } }).then(
        () => {
          if (oldPhoto) {
            fs.unlink(
              path.join(
                __dirname,
                `../../public/uploads/compressed/${
                  req.user.photo.split('/')[5]
                }`
              ),
              () => {}
            )
          }
        }
      )
      res
        .status(200)
        .send(`Image uploaded and compressed: ${compressedFilePath}`)
    } catch (error) {
      res.status(500).send('Error compressing image: ' + error)
    }
  }
)

router.post(
  '/change-photo-url',
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const oldPhoto = req.user.photo
      const { photo } = req.body
      User.updateOne({ _id: req.user._id }, { $set: { photo } }).then(() => {
        if (oldPhoto) {
          fs.unlink(
            path.join(
              __dirname,
              `../../public/uploads/compressed/${req.user.photo.split('/')[5]}`
            ),
            () => {
              next()
            }
          )
        }
      })
      res.status(200).send(`Image url changed to: ${photo}`)
    } catch (error) {
      res.status(500).send('Error image change: ' + error)
    }
  }
)

router.post('/change-user-info', ensureAuthenticated, (req, res) => {
  const { name, bio, phone } = req.body

  User.updateOne({ _id: req.user._id }, { $set: { name, bio, phone } })
    .then((response) => {
      res.status(200).json({
        success: true,
        message: 'User updated successfully'
      })
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error
      })
    })
})

module.exports = router
