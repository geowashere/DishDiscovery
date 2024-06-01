const router = require('express').Router()
const passport = require('passport')
const {
  getUser,
  addUser,
  signin,
  refreshToken,
  updateUser,
  deleteUser,
  logout,
  changeNotificationPreferences,
  changePassword,
  resetPassword,
  getAllUsernames,
} = require('../controllers/user.controller')
const avatarUpload = require('../middlewares/users/avatarUpload')
const decodeToken = require('../middlewares/auth/decodeToken')
const requireAuth = passport.authenticate('jwt', { session: false }, null)
const {
  getPublicUser,
  followUser,
  unfollowUser,
  getFollowingList,
  getFollowersList,
  getRecipes,
  getLikedRecipes,
  getAllUsers,
  getBooks,
  getPrivateRecipes,
  getPendingRecipes,
} = require('../controllers/profile.controller')
const {
  sendVerificationEmail,
  verifyEmail,
} = require('../middlewares/users/verifyEmail')
const {
  verifyCode,
  sendResetPasswordEmail,
} = require('../middlewares/users/forgotPassword')
const { addSuggestion } = require('../controllers/suggestion.controller')
const { createReport } = require('../controllers/report.controller')
const requireUserAuth = require('../middlewares/auth/userAuth')

router.post('/register', addUser, sendVerificationEmail)
router.get('/email-verify', verifyEmail)
router.post('/forgot-password', sendResetPasswordEmail)
router.get('/verify-reset-code', verifyCode)
router.patch('/reset-password', resetPassword)
router.get('/usernames', getAllUsernames)

router
  .get('/user', requireAuth, decodeToken, getUser)
  .put('/user', requireAuth, avatarUpload, updateUser)
  .delete('/user', requireAuth, decodeToken, deleteUser)

router.get('/following', requireAuth, decodeToken, getFollowingList)
router.get('/followers', requireAuth, decodeToken, getFollowersList)

router.get('/user/recipes', requireAuth, decodeToken, getRecipes)
router.get('/user/private-recipes', requireAuth, decodeToken, getPrivateRecipes)
router.get('/user/pending-recipes', requireAuth, decodeToken, getPendingRecipes)
router.get('/user/books', requireAuth, decodeToken, getBooks)
router.get('/user/liked-recipes', requireAuth, decodeToken, getLikedRecipes)

router.get('/public-users', requireAuth, decodeToken, getAllUsers)
router.get('/public-users/:id', requireAuth, decodeToken, getPublicUser)

router.post('/login', signin, sendVerificationEmail)
router.post('/refresh-token', refreshToken)
router.post('/logout', logout)

router.patch('/user/:id/follow', requireAuth, decodeToken, followUser)
router.patch('/user/:id/unfollow', requireAuth, decodeToken, unfollowUser)
router.patch(
  '/user/notification-preferences',
  requireAuth,
  decodeToken,
  changeNotificationPreferences,
)
router.patch('/user/change-password', requireAuth, decodeToken, changePassword)
router.post('/suggestion', requireUserAuth, addSuggestion)
router.post('/create-report/:id', requireUserAuth, createReport)

module.exports = router
