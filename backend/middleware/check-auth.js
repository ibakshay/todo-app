const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try
    {
        // const token = req.headers.authorization.split(" ")[1]
        const token = req.headers.authorization.split(" ")[1]
        console.log(req.headers.authorization)
        jwt.verify(token, 'qwertzuiopasdfghjkyxcvbn')
        next()
    } catch (error)
    {
        res.status(401).json({ message: "Authentication failed test" })
    }

}