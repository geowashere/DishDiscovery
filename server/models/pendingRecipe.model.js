const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pendingRecipeSchema = new Schema(
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
      enum: ['', 'Alcoholic Beverage', 'Appetizer', 'Bread', 'Breakfast', 'Dessert', 'Main Course', 'Non Alcoholic Beverage', 'Salad', 'Sandwich', 'Side Dish', 'Snack', 'Soup', 'Vegan', 'Vegetarian'],
      default: '',
    },
    cookingTime: {
      type: String,
      enum: [
        '',
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
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['', 'Easy', 'Medium', 'Hard'],
      default: '',
    },
    culture: {
      type: String,
      //prettier-ignore
      enum: ['', 'Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'American', 'Thai', 'Mediterranean', 'Greek', 'Korean', 'Spanish', 'Turkish', 'Vietnamese', 'Brazilian', 'Lebanese', 'Moroccan', 'British', 'Caribbean', 'Australian'],
      default: '',
    },
    status: {
      type: String,
      enum: ['private'],
      required: true,
    },
    servings: {
      type: String,
      enum: ['', '1-5', '5-10', '10+'],
      default: '',
    },
    directions: {
      type: [String],
    },
    ingredients: [],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('PendingRecipe', pendingRecipeSchema)
