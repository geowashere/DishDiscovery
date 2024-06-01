const router = require('express').Router()
const requireAdminAuth = require('../middlewares/auth/adminAuth')
const {
  getAllSuggestions,
  deleteSuggestion,
  checkSuggestion,
  unCheckSuggestion,
} = require('../controllers/suggestion.controller')
const {
  closeReport,
  deleteReport,
  getAllReports,
} = require('../controllers/report.controller')
const {
  banUser,
  unbanUser,
  updateBan,
  getBanByUserId,
} = require('../controllers/ban.controller')
const {
  warnUser,
  unwarnUser,
  getAllWarnsByUserId,
  updateWarn,
} = require('../controllers/warn.controller')
const { sendEmail } = require('../middlewares/users/userActions')

router.use(requireAdminAuth)

router.get('/suggestions', getAllSuggestions)
router.delete('/suggestion/:suggestionId', deleteSuggestion)
router.patch('/suggestion/:suggestionId/check', checkSuggestion)
router.patch('/suggestion/:suggestionId/uncheck', unCheckSuggestion)

router.patch('/report/:reportId/close', closeReport)
router.delete('/report/:reportId', deleteReport)
router.get('/reports', getAllReports)

router.post('/ban/:id', banUser, sendEmail)
router.patch('/unban/:id', unbanUser, sendEmail)
router.patch('/ban/:id/update', updateBan)
router.get('/ban/:id', getBanByUserId)

router.post('/warn/:id', warnUser, sendEmail)
router.delete('/:warnId/unwarn/:id', unwarnUser, sendEmail)
router.get('/warns/:id', getAllWarnsByUserId)
router.patch('/warn/:warnId/update', updateWarn)

module.exports = router
