const User = require('../models/user.model')
const Relationship = require('../models/relationship.model')
const Recipe = require('../models/recipe.model')
const PendingRecipe = require('../models/pendingRecipe.model')
const RecipeBook = require('../models/recipeBook.model')
const Notification = require('../models/notification.model')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

/*
 * @route GET /users/public-users/:id
 *
 * @param {string} req.userId - The id of the current user
 * @param {string} req.params.id - The id of the user to retrieve
 *
 */
const getPublicUser = async (req, res) => {
  try {
    const authenticatedUserId = req.userId
    const userToRetrieveId = req.params.id

    const user = await User.findById(userToRetrieveId)
      .select('-password -email')
      .lean()

    if (!user) return res.status(404).json({ message: 'User not found' })

    let relationshipExists = await Relationship.exists({
      follower: authenticatedUserId,
      following: userToRetrieveId,
    })

    relationshipExists = relationshipExists ? true : false

    const username = user.username
    const avatar = user.avatar
    const bio = user.bio
    const recipes = await Recipe.find({ user: user._id })
    const totalRecipes = recipes.length
    const totalFollowers = user.followers.length
    const totalFollowing = user.following.length

    return res.json({
      username,
      avatar,
      bio,
      totalRecipes,
      totalFollowers,
      totalFollowing,
      relationshipExists,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PATCH /user/:id/follow
const followUser = async (req, res) => {
  try {
    const authenticatedUserId = req.userId
    const toFollowId = req.params.id
    const { username, avatar } = req.user.user

    const isFollowing = await Relationship.exists({
      follower: authenticatedUserId,
      following: toFollowId,
    })

    if (isFollowing)
      return res.status(400).json({ message: 'Already following this user' })

    //promise.all takes array of promises and will concurently execute both
    await Promise.all([
      User.findByIdAndUpdate(
        authenticatedUserId,
        { $addToSet: { following: toFollowId } },
        { new: true },
      ),
      User.findByIdAndUpdate(
        toFollowId,
        { $addToSet: { followers: authenticatedUserId } },
        { new: true },
      ),
    ])

    const newRelationShip = {
      follower: authenticatedUserId,
      following: toFollowId,
    }
    await Relationship.create(newRelationShip)

    const notification = new Notification({
      actor: authenticatedUserId,
      recipient: toFollowId,
      type: 'follow',
      avatar,
      message: `${username} started following you.`,
    })

    await notification.save()

    return res.status(200).json({ message: 'User followed successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PATCH /user/:id/unfollow
const unfollowUser = async (req, res) => {
  try {
    const authenticatedUserId = req.userId
    const toUnfollowId = req.params.id

    const isFollowing = await Relationship.exists({
      follower: authenticatedUserId,
      following: toUnfollowId,
    })

    if (!isFollowing)
      return res.status(400).json({ message: 'User not followed' })

    await Promise.all([
      User.findByIdAndUpdate(
        authenticatedUserId,
        { $pull: { following: toUnfollowId } },
        { new: true },
      ),
      User.findByIdAndUpdate(
        toUnfollowId,
        { $pull: { followers: authenticatedUserId } },
        { new: true },
      ),
    ])

    await Relationship.deleteOne({
      follower: authenticatedUserId,
      following: toUnfollowId,
    })

    await Notification.deleteOne({
      actor: authenticatedUserId,
      recipient: toUnfollowId,
      type: 'follow',
    })
    return res.status(200).json({ message: 'User unfollowed successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route GET /users/following
const getFollowingList = async (req, res) => {
  try {
    const relationships = await Relationship.find({
      follower: req.userId,
    })
      .populate('following', '_id username avatar')
      .lean()

    const followingList = relationships
      .map((relationship) => ({
        ...relationship.following,
        followingSince: relationship.createdAt,
      }))
      .sort((a, b) => b.followingSince - a.followingSince)

    return res.json(followingList)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /users/followers
const getFollowersList = async (req, res) => {
  try {
    const relationships = await Relationship.find({
      following: req.userId,
    })
      .populate('follower', '_id username avatar')
      .lean()

    const followersWithFollowBack = await Promise.all(
      relationships.map(async (relationship) => {
        const isFollowingBack = (await Relationship.exists({
          follower: req.userId,
          following: relationship.follower._id,
        }))
          ? true
          : false
        return {
          ...relationship.follower,
          isFollowingBack,
        }
      }),
    )

    return res.status(200).json(followersWithFollowBack)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route GET /user/recipes
const getRecipes = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: 'User not found' })

    const recipesWithIngredients = await Recipe.find({ user: req.userId })
      .populate({
        path: 'ingredients',
        populate: {
          path: 'ingredient',
          select: 'name',
        },
      })
      .lean()

    const recipes = recipesWithIngredients.map((recipe) => {
      //prettier-ignore
      const {
        _id,
        title,
        description,
        image,
        type,
        difficulty,
        cookingTime,
        culture,
        servings,
        status,
        ingredients,
        directions,
        caption,
        createdAt
      } = recipe;
      //prettier-ignore

      const modifiedIngredients = ingredients.map((ingredient) => ({
        quantity: ingredient.quantity,
        measurementUnit: ingredient.measurementUnit,
        name: ingredient.ingredient.name,
      }));

      return {
        id: _id,
        title,
        description,
        image,
        type,
        difficulty,
        cookingTime,
        culture,
        servings,
        status,
        ingredients: modifiedIngredients,
        directions,
        caption,
        createdAt,
      }
    })

    return res.status(200).json(recipes)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

//@route GET /user/private-recipes
const getPrivateRecipes = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: 'User not found' })

    const recipes = await Recipe.find({
      user: req.userId,
      status: 'private',
    }).lean()

    return res.status(200).json(recipes)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

//@route GET /user/pending-recipes
const getPendingRecipes = async (req, res) => {
  try {
    const pendingRecipes = await PendingRecipe.find({ user: req.userId }).lean()

    return res.status(200).json(pendingRecipes)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route GET /user/books
const getBooks = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: 'User not found' })

    const books = await RecipeBook.find({ user: req.userId }).lean()

    return res.status(200).json(books)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /user/liked-recipes
const getLikedRecipes = async (req, res) => {
  try {
    const likedRecipes = await Recipe.find({ likes: { $in: [req.userId] } })

    res.json(likedRecipes)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route GET /users/public-users
const getAllUsers = async (req, res) => {
  try {
    const userId = req.userId

    // Find all users except the authenticated user
    const users = await User.find({
      _id: { $ne: userId },
      username: { $ne: 'Deleted User' },
    }).select('-password')

    const usersPromise = await Promise.all(
      users.map(async (user) => {
        const isFollowing = (await Relationship.exists({
          follower: userId,
          following: user._id,
        }))
          ? true
          : false
        return {
          id: user._id,
          avatar: user.avatar,
          username: user.username,
          isFollowing,
          isEmailVerified: user.isEmailVerified,
          nbOfFollowers: user.followers.length,
          role: user.role,
          isBanned: user.isBanned,
          nbOfWarns: user.warns.length,
        }
      }),
    )

    return res.json(usersPromise)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  getPublicUser,
  followUser,
  unfollowUser,
  getFollowingList,
  getFollowersList,
  getRecipes,
  getPrivateRecipes,
  getPendingRecipes,
  getBooks,
  getLikedRecipes,
  getAllUsers,
}
