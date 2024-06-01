const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    bio: {
      type: String,
      default: '',
    },
    notificationPreferences: {
      follow: {
        type: Boolean,
        default: true,
      },
      like: {
        type: Boolean,
        default: true,
      },
      comment: {
        type: Boolean,
        default: true,
      },
      post: {
        type: Boolean,
        default: true,
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enums: ['general', 'admin'],
      required: true,
      default: 'general',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    warns: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Warn',
      },
    ],
  },
  {
    timestamps: true,
  },
)

userSchema.index({ email: 'text' })
module.exports = mongoose.model('User', userSchema)
