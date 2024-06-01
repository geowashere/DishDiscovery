const router = require('express').Router()
const passport = require('passport')

const {
  getRecipesByUserId,
  createRecipe,
  deleteRecipe,
  updateRecipe,
  likeRecipe,
  unlikeRecipe,
  getRecipe,
  getEnums,
  getPublicRecipes,
  addComment,
  getRecipeComments,
  getAllTitles,
  createPendingRecipe,
  updatePendingRecipe,
  deletePendingRecipe,
  toggleStatus,
} = require('../controllers/recipe.controller')

const {
  likeComment,
  unlikeComment,
  replyToComment,
  getCommentReplies,
  deleteComment,
  deleteReply,
} = require('../controllers/comment.controller')

const recipeImageUpload = require('../middlewares/recipes/recipeImageUpload')

const { sendEmail } = require('../middlewares/users/userActions')

const decodeToken = require('../middlewares/auth/decodeToken')
const requireAuth = passport.authenticate('jwt', { session: false }, null)

router.use(requireAuth, decodeToken)

router.get('/public-recipes', getPublicRecipes)
router.get('/recipe/enums', getEnums)
router.get('/recipe/:recipeId/comments', getRecipeComments)
router.get('/user/:id', getRecipesByUserId)
router.get('/comment/:commentId/replies', getCommentReplies)
router.get('/titles', getAllTitles)
router.get('/recipe/:recipeId', getRecipe)

router.post('/recipe/create', recipeImageUpload, createRecipe)
router.post('/pending-recipe', recipeImageUpload, createPendingRecipe)
router
  .route('/pending-recipe/:recipeId')
  .put(recipeImageUpload, updatePendingRecipe)
  .delete(deletePendingRecipe)

router.put('/recipe/:recipeId/update', recipeImageUpload, updateRecipe)
router.delete('/recipe/:recipeId/delete', deleteRecipe, sendEmail)

router.post('/recipe/:recipeId/comment', addComment)
router.post('/comment/:commentId/reply', replyToComment)

router.delete('/comment/:commentId', deleteComment, sendEmail)
router.delete('/comment/:commentId/reply/:replyId', deleteReply, sendEmail)

router.patch('/recipe/:recipeId/like', likeRecipe)
router.patch('/recipe/:recipeId/unlike', unlikeRecipe)
router.patch('/comment/:commentId/like', likeComment)
router.patch('/comment/:commentId/unlike', unlikeComment)
router.patch('/:recipeId/toggle-status', toggleStatus)

module.exports = router
