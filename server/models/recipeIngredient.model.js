const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeIngredientSchema = new Schema({
  quantity: {
    type: String,
    required: true,
  },
  measurementUnit: {
    type: String,
    //prettier-ignore
    enum: ['', 'teaspoon', 'tablespoon', 'fluid ounce', 'cup', 'pint', 'quart', 'gallon', 'clove', 'milliliter', 'liter', 'gram', 'kilogram', 'ounce', 'pound', 'package', 'unit', 'handful', 'slice','piece','pinch'],
    default: '',
    required: true,
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  ingredient: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true,
  },
})

module.exports = mongoose.model('RecipeIngredient', recipeIngredientSchema)
