const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github').Strategy
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {
  PUBLIC_API_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} = require('../utils/secrets')
const Users = require('../models/users')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

const validatePassword = function (user, password) {
  return user.password ? bcrypt.compare(password, user.password) : false
}

const findOrCreate = (id, name, email, photo, done) => {
  Users.findOne({ social_id: id }).then((currentUser) => {
    if (currentUser) {
      done(null, currentUser)
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
        if (!user.verified) {
          return done(null, false, { message: 'You must verify your email' })
        }
        if (!user || !(await validatePassword(user, password))) {
          return done(null, false, { message: 'Incorrect email or password' })
        }
        return done(null, user)
      })
      .catch((err) => {
        return done(err)
      })
  })
)

module.exports = passport
