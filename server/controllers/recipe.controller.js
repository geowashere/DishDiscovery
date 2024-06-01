const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const mongoose = require('mongoose')
const Recipe = require('../models/recipe.model')
const RecipeBook = require('../models/recipeBook.model')
const PendingRecipe = require('../models/pendingRecipe.model')
const User = require('../models/user.model')
const Ingredient = require('../models/ingredient.model')
const RecipeIngredient = require('../models/recipeIngredient.model')
const Comment = require('../models/comment.model')
const Notification = require('../models/notification.model')
const Relationship = require('../models/relationship.model')
const BookRecipeRelationship = require('../models/bookRecipeRelationship.model')
const formatCreatedAt = require('../utils/timeConverter')

// @route GET /recipes
const getPublicRecipes = async (req, res) => {
  try {
    let recipes = await Recipe.find({ status: 'public' })
      .select('title image createdAt comments likes caption user')
      .populate('user', 'username')
      .lean()

    const userId = req.userId

    recipes = recipes.map((recipe) => {
      const userIdObjectId = new mongoose.Types.ObjectId(userId)
      const isLikedByUser = recipe.likes.some((like) =>
        like.equals(userIdObjectId),
      )
      const username = recipe.user?.username
      const user_id = recipe.user?._id
      return {
        _id: recipe._id,
        title: recipe.title,
        image: recipe.image,
        caption: recipe.caption,
        nbOfComments: recipe.comments.length,
        nbOfLikes: recipe.likes.length,
        isLikedByUser,
        user: username,
        user_id,
        createdAt: recipe.createdAt,
      }
    })

    return res.status(200).json(recipes)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

//@route GET /recipes/user/:id
const getRecipesByUserId = async (req, res) => {
  try {
    const userId = req.params.id

    const existingUser = await User.findById(userId)

    if (!existingUser)
      return res.status(400).json({ message: 'User not found' })

    const recipes = await Recipe.find({ user: userId, status: 'public' }).lean()
    return res.json(recipes)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// @route POST /recipe/create
const createRecipe = async (req, res) => {
  try {
    const userId = req.userId
    const newRecipeIngredients = []
    const { username, avatar } = req.user.user

    //prettier-ignore
    const { title, description, type, cookingTime, difficulty, culture, status, servings, directions, caption, ingredients,rcpImg} = req.body
    let image
    //prettier-ignore
    if (!title || !type || !difficulty || !culture || !directions || !ingredients)
      return res.status(400).json({ message: 'Missing parameters' })

    const user = await User.findById(userId)

    const pendingRecipeId = req.body?.pendingRecipeId

    if (pendingRecipeId !== 'undefined') {
      await PendingRecipe.deleteOne({ _id: pendingRecipeId, user: userId })
    }

    const recipe = await Recipe.findOne({ title })
    const recipeExists = recipe === null ? false : true
    if (recipeExists)
      return res.status(400).json({ message: 'Recipe already exists' })

    image = req?.file?.filename
      ? `http://localhost:3000/assets/recipeImages/${req.file.filename}`
      : 'http://localhost:3000/assets/recipeImages/di.jpg'

    if (rcpImg && rcpImg !== '/src/assets/defaultRecipe.jpg') image = rcpImg

    //prettier-ignore
    const newRecipe = await Recipe.create({user: userId, title, description, type, image, cookingTime, difficulty, culture, status, servings, directions, caption })

    const ingredientPromises = ingredients.map(async (ingredient) => {
      //! when testing in thunder client use line 94 and comment line 95
      // const { name, quantity, measurementUnit } = ingredient
      const { name, quantity, measurementUnit } = JSON.parse(ingredient) //objects inside strings
      const existingIngredient = await Ingredient.findOne({ name })
      if (!existingIngredient) {
        await Recipe.deleteOne({ _id: newRecipe._id }) //happens only if there is a bug or the recipe is created in thunder client
        throw new Error(`Ingredient "${name}" not found`)
      }
      const newRecipeIng = await RecipeIngredient.create({
        quantity,
        measurementUnit,
        ingredient: existingIngredient._id,
        recipe: newRecipe._id,
      })
      // console.log('NEWRECIPEING._ID: ' + newRecipeIng._id)
      newRecipeIngredients.push(newRecipeIng._id)
    })

    await Promise.all(ingredientPromises)
    newRecipe.ingredients.push(...newRecipeIngredients)
    await newRecipe.save()
    // Call getFollowingListAndNotify function and await its execution
    await getFollowersListAndNotify(
      username,
      userId,
      newRecipe._id,
      image,
      avatar,
    )

    return res
      .status(201)
      .json({ message: 'Recipe created successfully', recipe: newRecipe, user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route POST /recipes/pending-recipe
const createPendingRecipe = async (req, res) => {
  try {
    const userId = req.userId
    const { title, status, ...rest } = req.body
    if (!title || !status)
      return res.status(400).json({ message: 'Missing parameters!' })

    const ingredients = req.body?.ingredients
    const image = req?.file?.filename
      ? `http://localhost:3000/assets/recipeImages/${req.file.filename}`
      : 'http://localhost:3000/assets/recipeImages/di.jpg'

    const newPendingRecipe = await PendingRecipe.create({
      user: userId,
      title,
      status,
      image,
      ...rest,
    })

    if (ingredients) newPendingRecipe.ingredients = ingredients

    await newPendingRecipe.save()

    res.status(201).json({
      message: 'Pending recipe has been created successfully',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route PUT /recipes/pending-recipe/:recipeId
const updatePendingRecipe = async (req, res) => {
  try {
    const userId = req.userId
    const { recipeId } = req.params

    const { title, status } = req.body
    if (!title || !status)
      return res.status(400).json({ message: 'Missing parameters!' })

    const description = req.body?.description
    const type = req.body?.type
    const cookingTime = req.body?.cookingTime
    const difficulty = req.body?.difficulty
    const culture = req.body?.culture
    const servings = req.body?.servings
    const ingredients = req.body?.ingredients
    const directions = req.body?.directions
    const rcpImg = req.body?.rcpImg

    const pendingRecipe = await PendingRecipe.findOne({
      _id: recipeId,
      user: userId,
    })

    if (!pendingRecipe)
      return res.status(404).json({ message: 'Pending recipe not found!' })

    pendingRecipe.title = title

    if (rcpImg === `/src/assets/defaultRecipe.jpg`)
      pendingRecipe.image = `http://localhost:3000/assets/recipeImages/di.jpg`

    if (req?.file?.filename)
      pendingRecipe.image = `http://localhost:3000/assets/recipeImages/${req.file.filename}`

    if (description) pendingRecipe.description = description
    if (type) pendingRecipe.type = type
    if (cookingTime) pendingRecipe.cookingTime = cookingTime
    if (difficulty) pendingRecipe.difficulty = difficulty
    if (culture) pendingRecipe.culture = culture
    if (servings) pendingRecipe.servings = servings
    if (ingredients) pendingRecipe.ingredients = ingredients
    if (directions) pendingRecipe.directions = directions

    await pendingRecipe.save()

    res.status(200).json({
      message: 'Pending recipe has been updated successfully',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route DELETE /recipes/pending-recipe/:recipeId
const deletePendingRecipe = async (req, res) => {
  try {
    const userId = req.userId
    const { recipeId } = req.params

    const deletedPendingRecipe = await PendingRecipe.deleteOne({
      _id: recipeId,
      user: userId,
    })

    if (!deletedPendingRecipe)
      return res.status(404).json({ message: 'Pending recipe not found!' })

    return res
      .status(200)
      .json({ message: 'Pending recipe deleted successfully!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const getFollowersListAndNotify = async (
  username,
  userId,
  recipeId,
  image,
  avatar,
) => {
  try {
    const relationships = await Relationship.find({ following: userId })
      .populate('follower', '_id username avatar')
      .lean()

    const notifications = [] // Array to store notifications

    for (const relationship of relationships) {
      const notification = new Notification({
        actor: relationship.following,
        recipient: relationship.follower,
        type: 'post',
        avatar,
        recipe: recipeId,
        image,
        message: `${username} made a post.`,
      })

      // Save the notification to the database
      const savedNotification = await notification.save()

      notifications.push(savedNotification) // Add saved notification to the array
    }

    return notifications // Return array of saved notifications
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch following list and notify')
  }
}

const deleteNotificationsForPost = async (userId, recipeId) => {
  try {
    // Find followers of the user
    const followers = await Relationship.find(
      { following: userId },
      'follower',
    ).lean()

    // Extract follower IDs
    const followerIds = followers.map((follower) => follower.follower)

    // Delete notifications where recipeId matches, recipient is one of the followers, and actor is the user
    const deletedNotifications = await Notification.deleteMany({
      recipe: recipeId,
      recipient: { $in: followerIds },
      actor: userId, // Ensure actor is the user
    })

    return deletedNotifications
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete notifications for the post')
  }
}

// @route PUT /recipe/:recipeId/update
const updateRecipe = async (req, res) => {
  try {
    const userId = req.userId
    const { recipeId } = req.params

    //prettier-ignore
    const { title, description, rcpImg, type, cookingTime, difficulty, culture, status, servings, directions, caption, ingredients } = req.body

    //prettier-ignore
    if (!title || !type || !difficulty || !culture || !directions || !ingredients) 
      return res.status(400).json({ message: 'Missing parameters' })

    const recipe = await Recipe.findOne({
      _id: recipeId,
      user: userId,
    })

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }
    if (rcpImg === `/src/assets/defaultRecipe.jpg`)
      recipe.image = `http://localhost:3000/assets/recipeImages/di.jpg`

    //!not tested but should work
    if (req?.file?.filename) {
      recipe.image = `http://localhost:3000/assets/recipeImages/${req.file.filename}`
    }

    // Update recipe fields
    recipe.title = title
    recipe.description = description
    recipe.type = type
    recipe.cookingTime = cookingTime
    recipe.difficulty = difficulty
    recipe.culture = culture
    recipe.status = status
    recipe.servings = servings
    recipe.directions = directions
    recipe.caption = caption
    // recipe.image = image

    // Update ingredients
    const updatedIngredients = []

    for (const ingredient of ingredients) {
      const { name, quantity, measurementUnit } = JSON.parse(ingredient) //input is string
      let existingIngredient = await Ingredient.findOne({ name })

      //only admins can create ingredients
      if (!existingIngredient) throw new Error('Ingredient not found')

      // Check if this ingredient is already associated with the recipe
      const existingRecipeIngredient = await RecipeIngredient.findOne({
        recipe: recipeId,
        ingredient: existingIngredient._id,
      })

      if (existingRecipeIngredient) {
        // If it exists, update it
        existingRecipeIngredient.quantity = quantity
        existingRecipeIngredient.measurementUnit = measurementUnit
        await existingRecipeIngredient.save()
        updatedIngredients.push(existingRecipeIngredient._id)
      } else {
        // If it doesn't exist, create a new one
        const newRecipeIng = await RecipeIngredient.create({
          quantity,
          measurementUnit,
          ingredient: existingIngredient._id,
          recipe: recipeId,
        })
        updatedIngredients.push(newRecipeIng._id)
      }
    }
    recipe.ingredients = updatedIngredients

    // Remove any ingredients that were not updated
    await RecipeIngredient.deleteMany({
      recipe: recipeId,
      _id: { $nin: updatedIngredients },
    })

    await recipe.save()

    return res.status(200).json({ message: 'Recipe updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route DELETE /recipe/:recipeId/delete
const deleteRecipe = async (req, res, next) => {
  const { recipeId } = req.params
  const userId = req.userId
  try {
    const recipe = await Recipe.findOne({
      _id: recipeId,
    })

    const user = await User.findById(userId)

    const userRecipeExists = recipe === null ? false : true
    if (!userRecipeExists)
      throw new Error('recipe does not exist or invalid permissions')

    req.title = recipe.title
    req.date = formatCreatedAt(recipe.createdAt)
    req.user = recipe.user

    // Delete related documents in a batch
    await Promise.all([
      // delete recipe ingredients
      RecipeIngredient.deleteMany({ recipe: recipeId }),
      // delete recipe comments (public recipes), delete comments replies
      Comment.deleteMany({ recipe: recipeId }),
      // delete recipe in all books
      RecipeBook.updateMany({}, { $pull: { recipes: recipeId } }),

      BookRecipeRelationship.deleteMany({ recipe: recipeId }),
      // delete notifications (like, comments, post)
      deleteNotificationsForPost(recipe.user, recipeId),
    ])
    // Delete the recipe
    await Recipe.findByIdAndDelete(recipeId)

    if (user.role === 'admin' && userId !== recipe.user.toString()) {
      req.type = 'deleteRecipe'
      next()
    } else
      return res.status(200).json({ message: 'Recipe deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PATCH /recipe/:recipeId/like
const likeRecipe = async (req, res) => {
  try {
    const userId = req.userId
    const { recipeId } = req.params
    const { username, avatar } = req.user.user

    const recipe = await Recipe.findOne({ _id: recipeId }).select('user image')

    const updatedRecipe = await Recipe.findOneAndUpdate(
      {
        _id: recipeId,
        likes: { $ne: userId },
      },
      {
        $addToSet: { likes: userId },
      },
      { new: true },
    ).populate('user', 'username avatar')

    if (!updatedRecipe)
      return res.status(404).json({ message: 'Recipe not found' })

    const updatedDate = dayjs(updatedRecipe.createdAt)
    const formattedDate = updatedDate.fromNow()

    if (userId != recipe.user) {
      const notification = new Notification({
        actor: userId,
        recipient: recipe.user,
        recipe: recipeId,
        type: 'like',
        avatar,
        image: recipe.image,
        message: `${username} liked your post.`,
      })

      await notification.save()
    }

    return res.json({ updatedRecipe, createdAt: formattedDate })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PATCH /recipe/:recipeId/unlike
const unlikeRecipe = async (req, res) => {
  try {
    const userId = req.userId
    const { recipeId } = req.params

    const recipe = await Recipe.findOne({ _id: recipeId }).select('user')

    const updatedRecipe = await Recipe.findOneAndUpdate(
      {
        _id: recipeId,
        likes: userId,
      },
      {
        $pull: { likes: userId },
      },
      { new: true },
    ).populate('user', 'username avatar')

    if (!updatedRecipe)
      return res.status(404).json({ message: 'Recipe not found' })

    const updatedDate = dayjs(updatedRecipe.createdAt)
    const formattedDate = updatedDate.fromNow()

    await Notification.deleteOne({
      actor: userId,
      recipient: recipe.user,
      recipe: recipeId,
      type: 'like',
    })

    return res.json({ updatedRecipe, createdAt: formattedDate })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route GET /recipe/:recipeId
const getRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params

    const recipe = await Recipe.findById(recipeId)
      .populate('user', 'name avatar')
      .lean()

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' })

    const comments = await Comment.find({ recipe: recipeId })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar')
      .lean()

    const ings = await Recipe.findOne({ _id: recipeId }).populate({
      path: 'ingredients',
      populate: {
        path: 'ingredient', // Populate RecipeIngredient's ingredient field
        select: 'name', // Select only the name field from Ingredient
      },
    })

    const modifiedIngredients = ings.ingredients.map((ingredient) => ({
      ...ingredient.toObject(), // Spread the properties of the original ingredient
      name: ingredient.ingredient.name, // Populate the name from the nested object
    }))

    // console.log(modifiedIngredients)

    recipe.comments = formatComments(comments)
    recipe.dateTime = formatCreatedAt(recipe.createdAt)
    recipe.createdAt = dayjs(recipe.createdAt).fromNow()

    res.status(200).json({ recipe, ingredients: modifiedIngredients })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@desc format the date of a comment
const formatComments = (comments) =>
  comments.map((comment) => ({
    ...comment,
    createdAt: dayjs(comment.createdAt).fromNow(),
  }))

//@route POST /recipe/:recipeId/comment
const addComment = async (req, res) => {
  try {
    const { content } = req.body
    const { recipeId } = req.params
    const userId = req.userId
    const { username, avatar } = req.user.user

    const recipe = await Recipe.findOne({ _id: recipeId }).select('user image')

    const newComment = new Comment({
      user: userId,
      recipe: recipeId,
      content,
    })
    await newComment.save()
    await Recipe.findOneAndUpdate(
      {
        _id: { $eq: recipeId },
      },
      {
        $addToSet: {
          comments: newComment._id,
        },
      },
    )
    if (userId != recipe.user) {
      const notification = new Notification({
        actor: userId,
        recipient: recipe.user,
        recipe: recipeId,
        type: 'comment',
        avatar,
        image: recipe.image,
        message: `${username} commented on your post: "${content}"`,
      })

      await notification.save()
    }
    res.status(201).json({
      message: 'Comment added successfully',
      newComment,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /recipe/:recipeId/comments
const getRecipeComments = async (req, res) => {
  try {
    const { recipeId } = req.params

    const recipe = await Recipe.findById(recipeId)
      .select('title image caption createdAt')
      .populate('user', 'avatar username')
      .lean()

    if (recipe?.createdAt) recipe.createdAt = dayjs(recipe.createdAt).fromNow()

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' })

    const comments = await Comment.find({
      recipe: recipeId,
      parentComment: { $exists: false },
    }).populate('user', 'avatar username user')

    const commentsPromise = comments.map(async (comment) => {
      const userIdObjectId = new mongoose.Types.ObjectId(req.userId)
      const isCommentLikedByUser = comment.likes.some((like) =>
        like.equals(userIdObjectId),
      )
      const foundComment = await Comment.findById(comment._id)
        .populate('user', 'username avatar')
        .lean()

      const hasReplies = await Comment.find({
        parentComment: comment._id,
      }).lean()

      return {
        id: comment._id,
        content: comment.content,
        createdAt: dayjs(comment.createdAt).fromNow(),
        nbOfLikes: comment.likes.length,
        isCommentLikedByUser: !!isCommentLikedByUser,
        hasReplies: hasReplies.length,
        commentedUserUsername: foundComment.user.username,
        commentedUserAvatar: foundComment.user.avatar,
        canDelete: req.userId === comment.user._id.toString() ? true : false,
      }
    })

    const modifiedComments = await Promise.all(commentsPromise)

    return res.status(200).json({ comments: modifiedComments, recipe })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route GET /recipe/enums
const getEnums = async (req, res) => {
  try {
    const type = Recipe.schema.path('type').enumValues
    const cookingTime = Recipe.schema.path('cookingTime').enumValues
    const difficulty = Recipe.schema.path('difficulty').enumValues
    const culture = Recipe.schema.path('culture').enumValues
    const status = Recipe.schema.path('status').enumValues
    const servings = Recipe.schema.path('servings').enumValues
    const measurementUnit =
      RecipeIngredient.schema.path('measurementUnit').enumValues

    res.json({
      type,
      cookingTime,
      difficulty,
      culture,
      status,
      servings,
      measurementUnit,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route PATCH /:recipeId/toggle-status
const toggleStatus = async (req, res) => {
  try {
    const { recipeId } = req.params

    const { caption } = req.body

    const recipe = await Recipe.findOne({
      _id: recipeId,
      user: req.userId,
    })
    if (!recipe) return res.status(404).json({ message: 'Recipe not found!' })

    if (recipe.status === 'private') {
      recipe.status = 'public'
      recipe.caption = caption
    } else {
      recipe.status = 'private'
      recipe.caption = ''
    }

    await recipe.save()

    return res
      .status(200)
      .json({ message: 'Status has been toggled successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /recipes/titles
const getAllTitles = async (req, res) => {
  try {
    const recipes = await Recipe.find().select('title').lean()

    const titles = recipes.map((recipe) => {
      const { title } = recipe
      return title
    })
    res.json(titles)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  getRecipesByUserId,
  createRecipe,
  createPendingRecipe,
  updatePendingRecipe,
  deletePendingRecipe,
  deleteRecipe,
  updateRecipe,
  likeRecipe,
  unlikeRecipe,
  getRecipe,
  getEnums,
  getPublicRecipes,
  getRecipeComments,
  addComment,
  toggleStatus,
  getAllTitles,
}
