const express = require('express')
const catchAsync = require('../utils/catchAsync')
const router = express.Router()
const passport = require('passport')
const users = require('../controllers/users')

// Register
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

// Login
router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(users.login))

// Logout
router.get('/logout', users.logout)

module.exports = router;