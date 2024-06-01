require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const User = require('../models/user.model')
const Ban = require('../models/ban.model')
const { prompt } = require('enquirer')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    updateBan()
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const updateBan = async () => {
  const reasonQuestion = {
    type: 'select',
    name: 'reason',
    message: 'Select reason for updating the ban:',
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
  const question = [
    {
      type: 'input',
      name: 'username',
      message: 'Enter username: ',
    },
  ]

  const answers = await prompt(question)

  try {
    const user = await User.findOne({ username: answers.username })

    if (!user) {
      console.log('User not found')
      mongoose.connection.close()
      return
    }

    if (!user.isBanned) {
      console.log('User is not banned')
      mongoose.connection.close()
      return
    }

    const { reason } = await prompt([reasonQuestion])

    const ban = await Ban.findOne({ user: user._id })

    if (reason === 'Cancel') {
      console.log('Cancel....')
      mongoose.connection.close()
      return
    }

    if (ban.reason === reason) {
      console.log('Please enter a different value')
      mongoose.connection.close()
      return
    }

    ban.reason = reason

    await ban.save()
  } catch (error) {
    console.error(error)
  } finally {
    mongoose.connection.close()
  }
}
