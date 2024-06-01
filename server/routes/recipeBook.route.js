const router = require('express').Router()
const passport = require('passport')

const {
  getRecipeBooksByUser,
  createRecipeBook,
  deleteRecipeBook,
  updateRecipeBook,
  addRecipeToBook,
  removeRecipeFromBook,
  getRecipesByBookId,
  checkRecipeInBooks,
} = require('../controllers/recipeBook.controller')

const bookImageUpload = require('../middlewares/books/bookImageUpload')

const decodeToken = require('../middlewares/auth/decodeToken')
const requireAuth = passport.authenticate('jwt', { session: false }, null)

router.use(requireAuth, decodeToken)
router.get('/user/:id', getRecipeBooksByUser)
router.get('/:recipeId/check', checkRecipeInBooks)
router.post('/book/create', bookImageUpload, createRecipeBook)
router.put('/book/:bookId/update', bookImageUpload, updateRecipeBook)
router.delete('/book/:bookId/delete', deleteRecipeBook)

//books & recipes
router.get('/book/:bookId/recipes', getRecipesByBookId)
router.patch('/book/:bookId/recipe/:recipeId/add', addRecipeToBook)
router.patch('/book/:bookId/recipe/:recipeId/remove', removeRecipeFromBook)
module.exports = router
