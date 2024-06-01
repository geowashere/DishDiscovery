const Ban = require('../models/ban.model')
const User = require('../models/user.model')
const Token = require('../models/token.model')
const Warn = require('../models/warn.model')

//@route POST /admins/ban/:id
const banUser = async (req, res, next) => {
  const { adminId } = req
  const { id } = req.params
  const { reason } = req.body

  try {
    if (!reason.trim())
      return res.status(404).json({ message: 'Reason not found' })

    const adminExists = await User.findById(adminId)
    if (!adminExists)
      return res.status(404).json({ message: 'Admin not found' })

    const userExists = await User.findById(id)
    if (!userExists) return res.status(404).json({ message: 'User not found' })

    if (userExists.role === 'admin')
      return res.status(401).json({
        message: 'Admin cannot ban another admin. Please contact the owner',
      })

    if (userExists.isBanned) {
      return res.status(400).json({ message: 'User is already banned' })
    }

    await Token.deleteMany({ user: id })

    const newBan = new Ban({
      admin: adminId,
      user: id,
      reason,
    })
    userExists.isBanned = true

    await userExists.save()
    await newBan.save()

    req.type = 'ban'

    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//@route PATCH /admins/unban/:id
const unbanUser = async (req, res, next) => {
  const { adminId } = req
  const { id } = req.params

  try {
    const adminExists = await User.findById(adminId)
    if (!adminExists)
      return res.status(404).json({ message: 'Admin not found' })

    const userExists = await User.findById(id)
    if (!userExists) return res.status(404).json({ message: 'User not found' })

    if (!userExists.isBanned)
      return res.status(400).json({ message: 'User was never banned' })

    await Ban.deleteOne({ user: id })

    await Warn.deleteMany({ user: id })

    userExists.isBanned = false

    userExists.warns = []

    await userExists.save()

    req.type = 'unban'

    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//@route PATCH /admins/ban/:id/update
const updateBan = async (req, res) => {
  const { adminId } = req
  const { id } = req.params
  const { reason } = req.body

  try {
    if (!reason.trim())
      return res.status(404).json({ message: 'Reason not found' })

    const adminExists = await User.findById(adminId)
    if (!adminExists)
      return res.status(404).json({ message: 'Admin not found' })

    const banExists = await Ban.findOne({ user: id })
    if (!banExists) return res.status(404).json({ message: 'Ban not found' })

    const user = await User.findById(id)

    if (!user.isBanned) {
      return res.status(400).json({ message: 'User is not banned' })
    }

    if (banExists.reason.trim() === reason.trim())
      return res.status(400).json({ message: 'Please enter a different value' })

    banExists.reason = reason

    await banExists.save()

    return res.status(200).json({ message: 'Ban updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//@route GET /admins/ban/:id
const getBanByUserId = async (req, res) => {
  const { adminId } = req
  const { id } = req.params

  try {
    const adminExists = await User.findById(adminId)
    if (!adminExists)
      return res.status(404).json({ message: 'Admin not found' })

    const userExists = await User.findById(id)
    if (!userExists) return res.status(404).json({ message: 'User not found' })

    const ban = await Ban.findOne({ user: id })

    if (!ban) return res.status(400).json({ message: 'User is not banned' })

    return res.json(ban)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  banUser,
  unbanUser,
  updateBan,
  getBanByUserId,
}
