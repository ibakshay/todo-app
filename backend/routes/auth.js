const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = User({
      email: req.body.email,
      password: hash
    })
    user.save().then(result => {
      console.log(result)
      res.status(201).json({
        data: result
      })
    });
  }).catch(err => {
    res.status(500).json({ error: err })
  })



})

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
      res.status(200).json({ token: token })

    })
      .catch(err => res.status(401).json({ message: `auth failed ${ err }` }))
  })
})

module.exports = router
