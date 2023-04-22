const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/users')
const { encryptPassword } = require('../services/auth')
const { sendMail } = require('../config/nodemailer')

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/api/auth/login-error',
    successRedirect: '/api/auth/login-success'
  })
)

router.get('/login-success', (req, res) => {
  res.status(200).json({ success: true, message: 'Logged Successfully!!' })
})

router.get('/login-error', (req, res) => {
  res.status(400).json({ success: false, message: req.flash('error')[0] })
})

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'Email already in use'
    })
  }

  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    return res.status(400).jsonp({
      success: false,
      message: 'You must provide a valid email address'
    })
  }

  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{8,}).*$/.test(
      password
    )
  ) {
    return res.status(400).jsonp({
      success: false,
      message:
        'The password must be at least 8 characters long and must include at least one uppercase, one lowercase, one digit, and one special character (!@#$%^&*.)'
    })
  }

  const newUser = new User({
    email,
    password: await encryptPassword(password)
  })

  try {
    await newUser.save()
    await sendMail(newUser._id, email)
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error
    })
  }
})

router.get('/verify-email/:id', (req, res) => {
  const { id } = req.params
  User.findOneAndUpdate({ _id: id }, { $set: { verified: true } })
    .then((result) => res.status(200).json(result))
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: 'Something wrong!',
        error
      })
    })
})

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureFlash: true,
    failureRedirect: '/api/auth/google-auth-error',
    successRedirect: '/api/auth/google-auth-success'
  })
)

router.get('/google-auth-success', (req, res) => {
  res
    .status(200)
    .json({ success: true, message: 'User authenticated by google' })
})

router.get('/google-auth-error', (req, res) => {
  res.status(400).json({ success: false, message: req.flash('error')[0] })
})

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email']
  })
)

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureFlash: true,
    failureRedirect: '/api/auth/github-auth-error',
    successRedirect: '/api/auth/github-auth-success'
  })
)

router.get('/github-auth-success', (req, res) => {
  res
    .status(200)
    .json({ success: true, message: 'User authenticated by github' })
})

router.get('/github-auth-error', (req, res) => {
  res.status(400).json({ success: false, message: req.flash('error')[0] })
})

module.exports = router
