require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const User = require('../models/user.model')
const Warn = require('../models/warn.model')
const { prompt } = require('enquirer')
const convertToISO = require('../utils/convertToISO')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    unWarnUser()
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const unWarnUser = async () => {
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

    const warns = await Warn.find({ user: user._id })
      .populate('admin', 'username')
      .lean()

    if (warns.length === 0) {
      console.log(`${user.username} has no warns`)
      mongoose.connection.close()
      return
    }

    // Extract admin names and reasons from warns
    const options = warns.map((warn) => ({
      name: `${warn.admin ? warn.admin.username : 'Owner'}:${warn.reason},${warn.updatedAt}`,
      value: warn._id,
    }))

    // Add an option for not selecting any warn
    options.push({ name: 'Cancel', value: null })

    const selectQuestion = {
      type: 'select',
      name: 'selectedWarn',
      message: 'Select a warning to remove:',
      choices: options,
    }

    const { selectedWarn } = await prompt(selectQuestion)

    if (selectedWarn !== 'Cancel') {
      const data = selectedWarn.split(',')
      const updatedAt = data[1]
      const details = data[0]
      const adminName = details.split(':')[0]
      const reason = details.split(':')[1]

      if (adminName !== 'Owner') {
        const { _id } = await User.findOne({ username: adminName })

        let warnId
        const warns = await Warn.find({
          admin: _id,
          reason,
        })

        warns.forEach((warn) => {
          if (
            convertToISO(warn.updatedAt).split('.')[0] ===
            convertToISO(updatedAt).split('.')[0]
          ) {
            warnId = warn._id
          }
        })

        await User.findByIdAndUpdate(user._id, { $pull: { warns: warnId } })

        await Warn.findByIdAndDelete(warnId)

        console.log('Warn has been deleted')
      } else {
        let warnId
        const warns = await Warn.find({
          admin: null,
          reason,
        })

        warns.forEach((warn) => {
          if (
            convertToISO(warn.updatedAt).split('.')[0] ===
            convertToISO(updatedAt).split('.')[0]
          ) {
            warnId = warn._id
          }
        })

        await User.findByIdAndUpdate(user._id, { $pull: { warns: warnId } })

        await Warn.findByIdAndDelete(warnId)

        console.log('Warn has been deleted')
      }
    } else {
      console.log('Operation cancelled')
    }

    mongoose.connection.close()
  } catch (error) {
    console.error(error)
  } finally {
    mongoose.connection.close()
  }
}
