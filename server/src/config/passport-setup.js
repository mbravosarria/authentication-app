const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github').Strategy
const LocalStrategy = require('passport-local').Strategy
const {
  PUBLIC_API_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} = require('../utils/secrets')
const Users = require('../models/users')
const { findOrCreate, validatePassword } = require('../services/auth')

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    Users.findById(id)
      .then((res) => {
        const { _id, social_id, phone, email, name, photo, bio } = res
        const user = { _id, social_id, phone, email, name, photo, bio }
        done(null, user)
      })
      .catch((error) => done(error, null))
  })

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${PUBLIC_API_URI}/api/auth/google/callback`
      },
      (accessToken, refreshToken, profile, done) => {
        findOrCreate(
          profile.id,
          profile.displayName,
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : undefined,
          profile.photos && profile.photos[0]
            ? profile.photos[0].value
            : undefined,
          done
        )
      }
    )
  )

  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${PUBLIC_API_URI}/api/auth/github/callback`,
        scope: ['user:email']
      },
      (accessToken, refreshToken, profile, done) => {
        findOrCreate(
          profile.id,
          profile.displayName,
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : undefined,
          profile.photos && profile.photos[0]
            ? profile.photos[0].value
            : undefined,
          done
        )
      }
    )
  )

  passport.use(
    'local',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      Users.findOne({ email })
        .then(async (user) => {
          if (!user || !(await validatePassword(user, password))) {
            return done(null, false, { message: 'Incorrect email or password' })
          }

          if (!user.verified) {
            return done(null, false, { message: 'You must verify your email' })
          }

          return done(null, user)
        })
        .catch((err) => {
          return done(err)
        })
    })
  )
}
