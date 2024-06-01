const mongoose = require('mongoose')
const RecipeIngredient = require('../models/recipeIngredient.model')
const Schema = mongoose.Schema

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    type: {
      type: String,
      //prettier-ignore
      enum: ['Alcoholic Beverage', 'Appetizer', 'Bread', 'Breakfast', 'Dessert', 'Main Course', 'Non Alcoholic Beverage', 'Salad', 'Sandwich', 'Side Dish', 'Snack', 'Soup', 'Vegan', 'Vegetarian'],
      default: '',
      required: true,
    },
    cookingTime: {
      type: String,
      enum: [
        '0-10 Minutes',
        '10-30 Minutes',
        '30-59 Minutes',
        '1-2 Hours',
        '2-3 Hours',
        '3-4 Hours',
        '4-5 Hours',
        'More Than 5 Hours',
        'Unknown',
      ],
      default: 'Unknown',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: '',
      // required: true,
    },
    culture: {
      type: String,
      //prettier-ignore
      enum: ['Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'American', 'Thai', 'Mediterranean', 'Greek', 'Korean', 'Spanish', 'Turkish', 'Vietnamese', 'Brazilian', 'Lebanese', 'Moroccan', 'British', 'Caribbean', 'Australian'],
      default: '',
      required: true,
    },
    status: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    caption: {
      type: String,
    },
    servings: {
      type: String,
      enum: ['1-5', '5-10', '10+'],
    },
    directions: {
      type: [String],
      required: true,
    },
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'RecipeIngredient',
        required: true,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  },
)

recipeSchema.pre('deleteMany', async function (next) {
  try {
    // Retrieve documents about to be deleted
    const recipes = await this.model.find(this.getFilter())

    // Extract recipe IDs
    const recipeIds = recipes.map((recipe) => recipe._id)

    // Delete associated RecipeIngredients
    await RecipeIngredient.deleteMany({ recipe: { $in: recipeIds } })

    // Continue with the deletion
    next()
  } catch (error) {
    // Handle error
    next(error)
  }
})

module.exports = mongoose.model('Recipe', recipeSchema)
