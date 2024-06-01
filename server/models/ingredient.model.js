const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ingredientSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
})

module.exports = mongoose.model('Ingredient', ingredientSchema)
