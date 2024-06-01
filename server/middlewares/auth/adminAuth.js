const jwt = require('jsonwebtoken')
const Admin = require('../../models/user.model')

const requireAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
    const admin = await Admin.findById(decoded.id)

    if (admin) {
      if (admin.role === 'admin') {
        req.adminId = decoded.id
        next()
      } else res.status(401).json({ message: 'Unauthorized' })
    } else {
      res.status(401).json({ message: 'Admin not found' })
    }
  } catch (error) {
    res.status(401).json({ message: 'Something went wrong' })
  }
}

module.exports = requireAdminAuth
