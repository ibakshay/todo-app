const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

exports.createUser = (req, res, next) => {
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
            res.status(500).json({ message: "invalid authentication credentials!!" })
        })
    })

}

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
        const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' })
        res.status(200).json({ token: token, expiresIn: 3600 })

    })
        .catch(err => res.status(401).json({ message: `auth failed ${ err }` }))

}

exports.userLogin = (req, res, next) => {
    console.log(req)
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
            const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' })
            res.status(200).json({ token: token, expiresIn: 3600 })

        })
            .catch(err => res.status(401).json({ message: `Invalid authentication credentials` }))
    })
}