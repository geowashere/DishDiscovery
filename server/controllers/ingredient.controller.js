const Ingredient = require('../models/ingredient.model')

//@route POST /ingredient/add
const addIngredient = async (req, res) => {
  try {
    const { ingredient: name } = req.body

    if (!name) return res.status(400).json({ message: 'Missing parameters' })

    const ingredient = await Ingredient.findOne({ name })

    if (ingredient) {
      return res
        .status(400)
        .json({ message: `Ingredient '${name}' is already added` })
    }

    const newIngredient = new Ingredient({
      name,
    })

    await newIngredient.save()

    return res
      .status(200)
      .json({ message: 'Ingredient added successfully', newIngredient })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route GET /ingredients/get
const getAllIngredients = async (req, res) => {
  try {
    const allIngredients = await Ingredient.find().lean()

    return res.json(allIngredients)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PATCH /update/:ingredientId
const updateIngredient = async (req, res) => {
  const { ingredientId } = req.params
  const { updatedIngredient } = req.body

  try {
    const ingredientExists = await Ingredient.findById(ingredientId)

    if (!ingredientExists)
      return res.status(400).json({ message: 'Ingredient is not found' })

    if (ingredientExists.name === updatedIngredient)
      return res.status(400).json({ message: 'Value already exists' })

    ingredientExists.name = updatedIngredient

    await ingredientExists.save()

    return res.status(200).json({ message: 'Ingredient updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  addIngredient,
  getAllIngredients,
  updateIngredient,
}
