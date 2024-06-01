const mongoose = require('mongoose')
const Schema = mongoose.Schema

const banSchema = mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reason: {
      type: String,
      enum: [
        'Swearing',
        'Spamming',
        'Illegal Activities',
        'Misleading Content',
        'Harassment and Bullying',
        'Breaking the rules',
        'Multiple violations',
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Ban', banSchema)
