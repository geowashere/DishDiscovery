const User = require('../models/user.model')
const Warn = require('../models/warn.model')
const formatCreatedAt = require('../utils/timeConverter')
const timeConverter = require('../utils/timeConverter')

//@route POST /admins/warn/:id
const warnUser = async (req, res, next) => {
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
      return res.status(400).json({
        message: 'Invalid Permissions. Please contact the owner',
      })

    if (userExists.isBanned) {
      return res.status(400).json({ message: 'User already banned' })
    }

    const newWarn = new Warn({
      admin: adminId,
      user: id,
      reason,
    })

    await newWarn.save()
    await User.findByIdAndUpdate(id, {
      $addToSet: { warns: newWarn },
    })

    req.type = 'warn'

    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//@route DELETE /admins/:warnId/unwarn/:id
const unwarnUser = async (req, res, next) => {
  const { adminId } = req
  const { id, warnId } = req.params

  try {
    const adminExists = await User.findById(adminId)
    if (!adminExists)
      return res.status(404).json({ message: 'Admin not found' })

    const deletedWarn = await Warn.findByIdAndDelete(warnId)

    if (!deletedWarn) {
      // If the warning with the provided ID is not found, return an error response
      return res.status(404).json({ message: 'Warning not found' })
    }

    const userExists = await User.findById(id)
    if (!userExists) return res.status(404).json({ message: 'User not found' })

    if (userExists.role === 'admin')
      return res.status(400).json({
        message: 'Invalid Permissions. Please contact the owner',
      })

    await User.findByIdAndUpdate(id, { $pull: { warns: warnId } })

    req.type = 'unwarn'

    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//@router GET /admins/warns/:id
const getAllWarnsByUserId = async (req, res) => {
  const { adminId } = req
  const { id } = req.params

  try {
    const admin = await User.findById(adminId)
    if (!admin) return res.status(404).json({ message: 'Admin not found' })

    const userWarns = await Warn.find({ user: id })
      .populate('user', 'username')
      .populate('admin', 'username')
      .lean()

    userWarns.sort((a, b) =>
      Date.parse(a.updatedAt) < Date.parse(b.updatedAt) ? 1 : -1,
    )

    const modifiedUserWarns = userWarns.map((userWarn, index) => {
      return {
        id: userWarn._id,
        user: userWarn.user.username,
        admin: userWarn?.admin?.username,
        adminId: userWarn?.admin?._id,
        date: formatCreatedAt(userWarn.updatedAt),
        reason: userWarn.reason,
        index: index + 1,
      }
    })

    return res.status(200).json(modifiedUserWarns)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//@router PATCH /admins/warn/:warnId/update
const updateWarn = async (req, res) => {
  const { adminId } = req
  const { warnId } = req.params
  const { updatedReason } = req.body

  try {
    const adminExists = await User.findById(adminId)

    if (!adminExists)
      return res.status(404).json({ message: 'Admin not found' })

    const warnExits = await Warn.findById(warnId)

    if (!warnExits) return res.status(404).json({ message: 'Warn not found' })

    if (warnExits.reason.trim() === updatedReason.trim())
      return res.status(400).json({ message: 'Please enter a different value' })

    warnExits.reason = updatedReason

    await warnExits.save()

    return res.status(200).json({ message: 'Warn updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  warnUser,
  unwarnUser,
  getAllWarnsByUserId,
  updateWarn,
}
