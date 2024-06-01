const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const Notification = require('../models/notification.model')

// @route PATCH /mark-as-read
const markAsRead = async (req, res) => {
  try {
    const userId = req.userId

    // Find unread notifications to check if there are any to update
    const unreadNotificationsCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
    })

    if (unreadNotificationsCount === 0) {
      return res.status(200).json({ message: 'No unread notifications found.' })
    }

    // Update unread notifications to mark as read
    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } },
    )

    return res
      .status(200)
      .json({ message: 'All notifications are now marked as read!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.userId

    const notifications = await Notification.find({ recipient: userId }).lean()

    const filteredNotifications = notifications.filter(
      (notif) => req.user.user.notificationPreferences[notif.type],
    )

    const formattedNotifications = filteredNotifications.map((notif) => {
      return {
        ...notif,
        createdAt: dayjs(notif.createdAt).fromNow(),
      }
    })

    // Send response
    return res.json(formattedNotifications)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /unread-notifications
const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.userId

    // Fetch unread notifications
    const unreadNotifications = await Notification.find({
      recipient: userId,
      read: false,
    }).lean()

    // Send response
    return res.json({
      nbOfUnreadNotifs: unreadNotifications.length,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route DELETE /notification/:notifId/delete
const deleteNotification = async (req, res) => {
  try {
    const { notifId } = req.params

    const notification = await Notification.findOne({ _id: notifId })
    if (!notification)
      return res.status(404).json({ message: 'Notification not found' })

    await Notification.deleteOne({ _id: notifId })
    return res
      .status(200)
      .json({ message: 'Notification deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  getUnreadNotifications,
  deleteNotification,
}
