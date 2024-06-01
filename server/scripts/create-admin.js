require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const User = require('../models/user.model')
const { prompt } = require('enquirer')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    createAdmin()
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const createAdmin = async () => {
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
    if (admin.role === 'admin') {
      console.log('Already an admin')
      mongoose.connection.close()
      return
    }
    admin.role = 'admin'

    await admin.save()

    console.log('Changed to admin')
  } catch (error) {
    console.log(error)
  } finally {
    mongoose.connection.close()
  }
}
