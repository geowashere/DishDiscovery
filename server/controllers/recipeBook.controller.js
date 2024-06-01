const RecipeBook = require('../models/recipeBook.model')
const Recipe = require('../models/recipe.model')
const Book = require('../models/recipeBook.model')
const User = require('../models/user.model')
const BookRecipeRelationship = require('../models/bookRecipeRelationship.model')
const bookRecipeRelationship = require('../models/bookRecipeRelationship.model')

//@route GET /books/user/:id
const getRecipeBooksByUser = async (req, res) => {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'User is not found' })
    }
    const books = await RecipeBook.find({ user: userId })

    return res.status(200).json(books)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route POST /book/create
const createRecipeBook = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).select('-password')

    const { title, description } = req.body

    const image = req?.file?.filename
      ? `http://localhost:3000/assets/bookImages/${req.file.filename}`
      : 'http://localhost:3000/assets/bookImages/di.jpg'

    if (!title)
      return res.status(400).json({ message: 'Missing Title in params' })

    const newBook = await RecipeBook.create({
      user,
      title,
      description,
      image,
    })

    return res
      .status(201)
      .json({ message: 'Book created successfully', book: newBook })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route DELETE /book/:bookId/delete
const deleteRecipeBook = async (req, res) => {
  try {
    const userId = req.userId
    const { bookId } = req.params

    const bookExists = await RecipeBook.findOne({ user: userId, _id: bookId })
    if (!bookExists) return res.status(404).json({ message: 'Book not found' })

    await bookRecipeRelationship.deleteMany({ book: bookId, user: userId })
    await RecipeBook.findByIdAndDelete(bookId)

    return res.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PUT /book/:bookId/update
const updateRecipeBook = async (req, res) => {
  try {
    const userId = req.userId
    const { bookId } = req.params

    const { title, description, bookImg } = req.body

    if (!title)
      return res.status(400).json({ message: 'Missing title in params' })

    const bookExists = await RecipeBook.findOne({ user: userId })
    if (!bookExists) return res.status(404).json({ message: 'Book not found' })

    const book = await RecipeBook.findOne({ _id: bookId, user: userId })

    book.title = title
    book.description = description
    if (bookImg === `/src/assets/di.jpg`)
      book.image = `http://localhost:3000/assets/bookImages/di.jpg`

    if (req?.file?.filename) {
      book.image = `http://localhost:3000/assets/bookImages/${req.file.filename}`
    }

    await book.save()

    return res.json({ message: 'Book updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PATCH /book/:bookId/recipe/:recipeId/add
const addRecipeToBook = async (req, res) => {
  try {
    const userId = req.userId
    const { bookId, recipeId } = req.params

    const bookExists = await RecipeBook.findOne({ _id: bookId })
    const recipeExists = await Recipe.findOne({ _id: recipeId })

    if (!req.user || !bookExists || !recipeExists)
      return res.status(400).json({ message: 'invalid user or book or recipe' })

    const relationshipExists = await BookRecipeRelationship.exists({
      user: userId,
      book: bookId,
      recipe: recipeId,
    })

    if (relationshipExists) throw new Error('Recipe is already in this book!')

    await RecipeBook.findByIdAndUpdate(
      bookId,
      { $addToSet: { recipes: recipeId } },
      { new: true },
    )

    const newRelationShip = {
      user: userId,
      book: bookId,
      recipe: recipeId,
    }

    await BookRecipeRelationship.create(newRelationShip)

    return res.status(200).json({ message: 'Recipe added to book!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PATCH /book/:bookId/recipe/:recipeId/remove
const removeRecipeFromBook = async (req, res) => {
  try {
    const userId = req.userId
    const { bookId, recipeId } = req.params

    const bookExists = await RecipeBook.findOne({ _id: bookId })
    const recipeExists = await Recipe.findOne({ _id: recipeId })

    if (!req.user || !bookExists || !recipeExists)
      return res.status(400).json({ message: 'invalid user or book or recipe' })

    const relationshipExists = await BookRecipeRelationship.exists({
      user: userId,
      book: bookId,
      recipe: recipeId,
    })

    if (!relationshipExists) throw new Error('Recipe is not in book!')

    await RecipeBook.findByIdAndUpdate(
      bookId,
      { $pull: { recipes: recipeId } },
      { new: true },
    )

    await BookRecipeRelationship.deleteOne({
      user: userId,
      book: bookId,
      recipe: recipeId,
    })

    return res
      .status(200)
      .json({ message: 'Recipe delete from book successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /book/:bookId/recipes
// @desc getBook + recipes
// @access - anyone logged in
const getRecipesByBookId = async (req, res) => {
  try {
    const { bookId } = req.params

    const book = await RecipeBook.findOne({ _id: bookId })
    if (!req.user || !book) throw new Error('Invalid user or book')

    const relationships = await BookRecipeRelationship.find({
      book: bookId,
    })
      .populate('recipe', 'title image status user')
      .populate('user', 'username')
      .lean()

    const modifiedRelationships = relationships.map(async (relationship) => {
      const { user } = relationship.recipe

      const _user = await User.findById(user)

      return {
        id: relationship.recipe._id,
        username: _user.username,
        title: relationship.recipe.title,
        image: relationship.recipe.image,
        status: relationship.recipe.status,
      }
    })

    const result = await Promise.all(modifiedRelationships)

    return res.status(200).json({ book, recipes: result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /books/:recipeId/check
// @desc check if a recipe is in the user's books
const checkRecipeInBooks = async (req, res) => {
  try {
    const { recipeId } = req.params

    const books = await Book.find({ user: req.userId }).select('title').lean()

    const relationshipPromise = books.map(async (book) => {
      const isInBook = await bookRecipeRelationship
        .findOne({
          book: book._id.toString(),
          recipe: recipeId,
        })
        .lean()

      return {
        id: book._id,
        title: book.title,
        isInBook: !!isInBook, //send as boolean
      }
    })
    const result = await Promise.all(relationshipPromise)

    return res.status(200).json(result)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  getRecipeBooksByUser,
  createRecipeBook,
  deleteRecipeBook,
  updateRecipeBook,
  addRecipeToBook,
  removeRecipeFromBook,
  getRecipesByBookId,
  checkRecipeInBooks,
}
