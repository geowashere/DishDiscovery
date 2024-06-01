const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String,
    required: true,
    unique: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  for: {
    type: String,
    required: true,
  },
  expiresAfter: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

module.exports = mongoose.model('Email', emailSchema)
