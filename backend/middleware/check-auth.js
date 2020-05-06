const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try
    {
        // const token = req.headers.authorization.split(" ")[1]
        const token = req.headers.authorization.split(" ")[1]
        console.log(req.headers.authorization)
        const decodedToken = jwt.verify(token, 'qwertzuiopasdfghjkyxcvbn')
        req.userData = { email: decodedToken.email, userId: decodedToken.userId }
        next()
    } catch (error)
    {
        res.status(401).json({ message: "<ou are not authenticated" })
    }

}