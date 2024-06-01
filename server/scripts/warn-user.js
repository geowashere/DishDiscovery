require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const User = require('../models/user.model')
const Warn = require('../models/warn.model')
const { prompt } = require('enquirer')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    warnUser()
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const warnUser = async () => {
  const reasonQuestion = {
    type: 'select',
    name: 'reason',
    message: 'Select reason for warning:',
    choices: [
      'Swearing',
      'Spamming',
      'Illegal Activities',
      'Misleading Content',
      'Harassment and Bullying',
      'Breaking the rules',
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

    const user = await User.findOne({ username }).lean()

    if (!user) {
      console.log('Username does not exist')
      mongoose.connection.close()
      return
    }

    if (user.isBanned) {
      console.log('User already banned')
      mongoose.connection.close()
      return
    }

    const { reason } = await prompt([reasonQuestion])

    if (reason === 'Cancel') {
      console.log('Cancel....')
      mongoose.connection.close()
      return
    }

    const warn = new Warn({
      user: user._id,
      reason: reason,
    })

    await warn.save()
    await User.findByIdAndUpdate(user._id, {
      $addToSet: {
        warns: warn,
      },
    })

    console.log('User warned successfully')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    mongoose.connection.close()
  }
}
