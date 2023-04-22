function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.send('User is not authenticated')
}

module.exports = {
  ensureAuthenticated
}
