const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportSchema = mongoose.Schema(
  {
    description: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'Swearing',
        'Spamming',
        'Illegal Activities',
        'Misleading Content',
        'Harassment and Bullying',
        'Breaking the rules',
      ],
      required: true,
    },
    closedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Report', reportSchema)
