const router = require('express').Router()
const passport = require('passport')

const {
  getNotifications,
  markAsRead,
  deleteNotification,
  getUnreadNotifications,
} = require('../controllers/notification.controller')

const decodeToken = require('../middlewares/auth/decodeToken')
const requireAuth = passport.authenticate('jwt', { session: false }, null)

router.use(requireAuth, decodeToken)
router.get('/get-notifications', getNotifications)
router.get('/unread-notifications', getUnreadNotifications)
router.patch('/mark-as-read', markAsRead)
router.delete('/notification/:notifId/delete', deleteNotification)
module.exports = router
