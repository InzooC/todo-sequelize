const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ massage: '所有欄位都是必填的！' })
  }
  if (password !== confirmPassword) {
    errors.push({ massage: '密碼與驗證密碼不相同！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, confirmPassword
    })
  }
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errors.push({ massage: '此Email已註冊過！' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router