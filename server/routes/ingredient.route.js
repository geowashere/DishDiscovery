const router = require('express').Router()
const passport = require('passport')

const {
  addIngredient,
  getAllIngredients,
  updateIngredient,
} = require('../controllers/ingredient.controller')

const decodeToken = require('../middlewares/auth/decodeToken')
const requireAuth = passport.authenticate('jwt', { session: false }, null)
const requireAdminAuth = require('../middlewares/auth/adminAuth')

router.get('/get', requireAuth, decodeToken, getAllIngredients)
router.post('/add', requireAdminAuth, addIngredient)
router.patch('/update/:ingredientId', requireAdminAuth, updateIngredient)

module.exports = router
