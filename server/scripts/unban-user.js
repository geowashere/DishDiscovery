require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const User = require('../models/user.model')
const Ban = require('../models/ban.model')
const Warn = require('../models/warn.model')
const { prompt } = require('enquirer')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    unBanUser()
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const unBanUser = async () => {
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

    if (!user.isBanned) {
      console.log('User is not banned')
      mongoose.connection.close()
      return
    }

    await Ban.deleteOne({ user: user._id })

    await Warn.deleteMany({ user: user._id })

    user.isBanned = false

    user.warns = []

    await user.save()

    console.log('User unBanned successfully')
  } catch (error) {
    console.error('Error: ', error)
  } finally {
    mongoose.connection.close()
  }
}
