const mongoose = require('mongoose')

const bookRecipeRelationshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecipeBook',
    required: true,
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
})

module.exports = mongoose.model(
  'BookRecipeRelationship',
  bookRecipeRelationshipSchema,
)
