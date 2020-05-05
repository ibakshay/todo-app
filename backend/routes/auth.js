const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const router = express.Router();

router.post('/signup', (req, res, next) => {
  let user
  bcrypt.hash(req.body.password, 10).then(hash => {
    user = User({
      email: req.body.email,
      password: hash
    })
    user.save().then(result => {
      if (result)
      {
        User.findOne({ email: req.body.email }).then(user => {
          generateandSendJWT(user, req, res)
        })
      }
    }).catch(err => {
      res.status(500).json({ error: err })
    })
  })



})

function generateandSendJWT(user, req, res) {
  if (!user)
  {
    return res.status(401).json({
      message: 'auth failed'
    })
  }
  return bcrypt.compare(req.body.password, user.password).then(result => {
    if (!result)
    {
      return res.status(401).json({ message: 'auth failed' })

    }
    const token = jwt.sign({ email: user.email, userId: user._id }, `qwertzuiopasdfghjkyxcvbn`, { expiresIn: '1h' })
    res.status(200).json({ token: token, expiresIn: 3600 })

  })
    .catch(err => res.status(401).json({ message: `auth failed ${ err }` }))

}
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    console.log(user)
    if (!user)
    {
      return res.status(401).json({
        message: 'auth failed'
      })
    }
    return bcrypt.compare(req.body.password, user.password).then(result => {
      if (!result)
      {
        return res.status(401).json({ message: 'auth failed' })

      }
      const token = jwt.sign({ email: user.email, userId: user._id }, `qwertzuiopasdfghjkyxcvbn`, { expiresIn: '1h' })
      res.status(200).json({ token: token, expiresIn: 3600 })

    })
      .catch(err => res.status(401).json({ message: `auth failed ${ err }` }))
  })
})

module.exports = router
