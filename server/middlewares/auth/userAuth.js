const User = require('../../models/user.model')
const jwt = require('jsonwebtoken')

const requireUserAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
    const user = await User.findById(decoded.id)

    if (user) {
      if (user.role === 'general') {
        req.userId = decoded.id
        next()
      } else res.status(401).json({ message: 'Unauthorized' })
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } catch (error) {
    res.status(401).json({ message: 'Something Went wrong' })
  }
}

module.exports = requireUserAuth
