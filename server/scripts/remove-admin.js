require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const User = require('../models/user.model')
const { prompt } = require('enquirer')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    removeAdmin()
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const removeAdmin = async () => {
  const question = [
    {
      type: 'input',
      name: 'username',
      message: 'Enter username: ',
    },
  ]

  const answers = await prompt(question)

  try {
    const admin = await User.findOne({ username: answers.username })
    if (!admin) {
      console.log('Username does not exists')
      mongoose.connection.close()
      return
    }
    if (admin.role === 'general') {
      console.log('User is not an admin')
      mongoose.connection.close()
      return
    }
    admin.role = 'general'

    await admin.save()

    console.log('Changed to general')
  } catch (error) {
    console.log(error)
  } finally {
    mongoose.connection.close()
  }
}
