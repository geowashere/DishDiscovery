const mongoose = require('mongoose')
const Schema = mongoose.Schema

const suggestionSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    handledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Suggestion', suggestionSchema)
