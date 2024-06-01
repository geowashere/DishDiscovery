require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const User = require('../models/user.model')
const Ban = require('../models/ban.model')
const Token = require('../models/token.model')
const { prompt } = require('enquirer')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    banUser()
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const banUser = async () => {
  const reasonQuestion = {
    type: 'select',
    name: 'reason',
    message: 'Select reason for banning:',
    choices: [
      'Swearing',
      'Spamming',
      'Illegal Activities',
      'Misleading Content',
      'Harassment and Bullying',
      'Breaking the rules',
      'Multiple violations',
      'Cancel',
    ],
  }

  const usernameQuestion = {
    type: 'input',
    name: 'username',
    message: 'Enter username: ',
  }

  try {
    const { username } = await prompt([usernameQuestion])

    const user = await User.findOne({ username })

    if (!user) {
      console.log('Username does not exist')
      mongoose.connection.close()
      return
    }

    if (user.warns.length === 0) {
      console.log('User has no warns.')
      mongoose.connection.close()
      return
    }

    const { reason } = await prompt([reasonQuestion])

    if (reason === 'Cancel') {
      console.log('Cancel....')
      mongoose.connection.close()
      return
    }

    await Token.deleteMany({ user: user._id })

    const ban = new Ban({
      user: user._id,
      reason,
    })
    user.isBanned = true

    await user.save()

    await ban.save()

    console.log('User banned successfully')
  } catch (error) {
    console.error('Error: ', error)
  } finally {
    mongoose.connection.close()
  }
}
