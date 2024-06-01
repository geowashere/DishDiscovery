const jwt = require('jsonwebtoken')

const decodeToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(401).json({ message: 'Forbidden' })
  }
}

module.exports = decodeToken
