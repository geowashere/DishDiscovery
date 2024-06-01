require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const Token = require('../models/token.model')
const Recipe = require('../models/recipe.model')
const PendingRecipe = require('../models/pendingRecipe.model')
const RecipeBook = require('../models/recipeBook.model')
const BookRecipeRelationship = require('../models/bookRecipeRelationship.model')
const Relationship = require('../models/relationship.model')
const Notification = require('../models/notification.model')
const EmailVerification = require('../models/email.model')
const Warn = require('../models/warn.model')

//@route POST /login
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!password.trim() || !email.trim()) {
      res.status(401).json({ message: 'Fields are empty' })
      return
    }

    const existingUser = await User.findOne({ email })
    if (!existingUser)
      return res.status(404).json({ message: 'User not found, please sign up' })

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    )

    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid Password' })

    if (!existingUser.isEmailVerified) {
      const isEmailVerificationExpired = await EmailVerification.findOne({
        email,
        for: 'emailVerification',
      })
      if (!isEmailVerificationExpired) {
        next()
        return
      }
      return res.status(403).json({ message: 'Please verify your email' })
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: '6h',
    })

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: '7d',
    })

    const newRefreshToken = new Token({
      user: existingUser._id,
      refreshToken,
      accessToken,
    })
    await newRefreshToken.save()

    const totalFollowers = existingUser.followers.length
    const totalFollowing = existingUser.following.length

    const totalRecipes = await Recipe.countDocuments({ user: existingUser._id })

    res.status(200).json({
      accessToken,
      refreshToken,
      isEmailVerified: true,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        avatar: existingUser.avatar,
        bio: existingUser.bio,
        totalRecipes,
        totalFollowers,
        totalFollowing,
        notificationPreferences: existingUser.notificationPreferences,
        isEmailVerified: existingUser.isEmailVerified,
        role: existingUser.role,
        isBanned: existingUser.isBanned,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route POST /refresh-token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken)
      return res.status(400).json({ message: 'Refresh token is required' })

    const tokenDoc = await Token.findOne({ refreshToken }).lean()
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const existingUser = await User.findById(tokenDoc.user)
    if (!existingUser)
      return res
        .status(401)
        .json({ message: 'Error refreshing token, user not found' })

    const refreshTokenExpiresAt = jwt.decode(tokenDoc.refreshToken).exp * 1000
    if (Date.now() >= refreshTokenExpiresAt) {
      await Token.deleteOne({ refreshToken })
      return res.status(401).json({
        message: 'Expired refresh token',
      })
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: '6h',
    })

    tokenDoc.accessToken = accessToken
    await Token.findOneAndUpdate({ refreshToken }, tokenDoc)
    res.status(200).json({
      accessToken,
      refreshToken: tokenDoc.refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route POST /logout
const logout = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] ?? null
    // const tokenExists = await Token.findOne({ accessToken })
    // if (!tokenExists)
    //   res
    //     .status(404)
    //     .json({ message: 'Token not found! You are already logged out' })

    if (accessToken) await Token.deleteOne({ accessToken })

    res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /user
// @desc Get the authenticated user's info
const getUser = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: 'User not found' })

    const user = await User.findById(req.userId).select('-password').lean()

    const username = user.username
    const email = user.email
    const bio = user.bio
    const role = user.role

    const avatar = user.avatar
    const filteredFollowing = await Promise.all(
      user.following.map(async (following) => {
        const _following = await User.findById(following).lean()
        return _following.username !== 'Deleted User' ? following : null
      }),
    )

    const finalFollowing = filteredFollowing.filter(
      (following) => following !== null,
    )

    const filteredFollower = await Promise.all(
      user.followers.map(async (follower) => {
        const _follower = await User.findById(follower).lean()
        return _follower.username !== 'Deleted User' ? follower : null
      }),
    )

    const finalFollowers = filteredFollower.filter(
      (following) => following !== null,
    )

    const totalFollowers = finalFollowers.length

    const totalFollowing = finalFollowing.length

    const totalRecipes = await Recipe.countDocuments({ user: user._id })

    const notificationPreferences = user.notificationPreferences
    return res.json({
      _id: user._id,
      username,
      email,
      avatar,
      bio,
      totalRecipes,
      totalFollowers,
      totalFollowing,
      notificationPreferences,
      role,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route POST /register
const addUser = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body

  let newUser
  const avatar = 'http://localhost:3000/assets/userAvatars/dp.jpg'

  const foundEmail = await User.findOne({ email }).lean()

  if (foundEmail) {
    return res.status(400).json({ message: 'Email is already in use' })
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Invalid password and confirmPassword combination' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  newUser = new User({
    username,
    email,
    password: hashedPassword,
    avatar,
  })

  try {
    await newUser.save()

    if (newUser.isNew) {
      throw new Error('Failed to add user')
    }

    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route PUT /user
const updateUser = async (req, res) => {
  const { username, bio, avatar } = req.body

  try {
    const { user } = req.user
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.username = username
    user.bio = bio
    if (avatar === '/src/assets/dp.jpg')
      user.avatar = `http://localhost:3000/assets/userAvatars/dp.jpg`
    if (req?.file?.filename) {
      user.avatar = `http://localhost:3000/assets/userAvatars/${req.file.filename}`
    }

    await user.save()

    return res.status(200).json({ message: 'user updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route DELETE /user
const deleteUser = async (req, res) => {
  try {
    const userId = req.userId
    if (!req.user) return res.status(404).json({ message: 'user not found' })

    const users = await User.find().select('email').lean()

    const existingEmails = users.map((user) => user.email)

    const emailsSet = new Set(existingEmails)
    const uniqueString = generateRandomUniqueString(18, emailsSet)

    const userToDelete = await User.findById(userId).lean()
    const currentEmail = userToDelete.email

    await Promise.all([
      Recipe.deleteMany({ user: userId }),
      PendingRecipe.deleteMany({ user: userId }),
      RecipeBook.deleteMany({ user: userId }),
      BookRecipeRelationship.deleteMany({ user: userId }),
      Relationship.deleteMany({ follower: userId }),
      Relationship.deleteMany({ following: userId }),
      Notification.deleteMany({ recipient: userId }),
      Warn.deleteMany({ user: userId }),
      Token.deleteMany({ user: userId }),
      User.findByIdAndUpdate(userId, {
        username: 'Deleted User',
        email: currentEmail + uniqueString,
        followers: [],
        following: [],
        warns: [],
      }),
    ])

    return res.json({ message: 'user deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

function generateRandomUniqueString(length, existingEmails = new Set()) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()<>;[]/.,{}'
  let result = ''

  do {
    result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
  } while (existingEmails.has(result))

  existingEmails.add(result)
  return result
}

// @route PATCH /user/notification-preferences
const changeNotificationPreferences = async (req, res) => {
  try {
    const userId = req.userId
    const { type, value } = req.body

    if (!type || typeof value !== 'boolean')
      return res.status(400).json({ message: 'Missing parameters' })

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },

      { $set: { [`notificationPreferences.${type}`]: value } },
      { new: true }, // Return the updated document
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    updatedUser.save()

    return res
      .status(200)
      .json({ message: `${type} Preference has been changed successfully` })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route PATCH /user/change-password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body

    // Check if any required parameter is missing
    if (
      !oldPassword.trim() ||
      !newPassword.trim() ||
      !confirmNewPassword.trim()
    )
      return res.status(400).json({ message: 'Missing Parameters!' })

    const user = await User.findOne({ _id: req.userId })

    // Check if user exists
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Check if old password matches
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordValid)
      return res.status(400).json({ message: 'Invalid old password' })

    // Check if new password matches confirm new password
    if (newPassword !== confirmNewPassword)
      return res
        .status(400)
        .json({ message: 'New password and confirm password do not match' })

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user's password
    user.password = hashedPassword
    await user.save()

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route PATCH /users/reset-password
const resetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body

    const user = await User.findOne({ email })

    if (!user.username)
      return res.status(404).json({ message: 'User not found' })

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    await user.save()

    return res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const getAllUsernames = async (req, res) => {
  try {
    const users = await User.find().select('username').lean()

    const usernames = users.map((user) => user.username)

    return res.json(usernames)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  getUser,
  addUser,
  signin,
  refreshToken,
  updateUser,
  logout,
  changeNotificationPreferences,
  changePassword,
  deleteUser,
  resetPassword,
  getAllUsernames,
}
