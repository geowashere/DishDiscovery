const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const Recipe = require('../models/recipe.model')
const Comment = require('../models/comment.model')
const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const timeConverter = require('../utils/timeConverter')
const mongoose = require('mongoose')

//@route PATCH /comment/:commentId/like
const likeComment = async (req, res) => {
  try {
    const userId = req.userId
    const { commentId } = req.params
    const { username } = req.user.user

    const comment = await Comment.findOne({ _id: commentId }).lean()

    const updatedComment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        likes: { $ne: userId },
      },
      {
        $addToSet: { likes: userId },
      },
      { new: true },
    ).populate('user', 'username avatar')

    if (!updatedComment)
      return res.status(404).json({ message: 'Comment not found' })

    const updatedDate = dayjs(updatedComment.createdAt)
    const formattedDate = updatedDate.fromNow()

    if (userId != comment.user) {
      const notification = new Notification({
        actor: userId,
        recipient: comment.user,
        comment: commentId,
        type: 'like',
        message: `${username} liked your comment.`,
      })

      await notification.save()
    }

    res.json({ updatedComment, createdAt: formattedDate })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PATCH /comment/:commentId/unlike
const unlikeComment = async (req, res) => {
  try {
    const userId = req.userId
    const { commentId } = req.params

    const comment = await Comment.findOne({ _id: commentId }).lean()

    const updatedComment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        likes: userId,
      },
      {
        $pull: { likes: userId },
      },
      { new: true },
    ).populate('user', 'username avatar')

    if (!updatedComment)
      return res.status(404).json({ message: 'Comment not found' })

    const updatedDate = dayjs(updatedComment.createdAt)
    const formattedDate = updatedDate.fromNow()

    await Notification.deleteOne({
      actor: userId,
      recipient: comment.user,
      comment: commentId,
      type: 'like',
    })

    return res.json({ updatedComment, createdAt: formattedDate })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route POST /comment/:commentId/reply
const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { content } = req.body

    const { username, avatar } = req.user.user

    const parentComment = await Comment.findById(commentId)
      .populate('recipe', 'user')
      .lean()

    if (!parentComment)
      return res.status(404).json({ message: 'Parent comment not found' })

    const newComment = new Comment({
      content,
      user: req.userId,
      recipe: parentComment.recipe,
      parentComment: parentComment._id,
    })

    await newComment.save()

    await Recipe.findOneAndUpdate(
      {
        _id: parentComment.recipe,
      },
      { $addToSet: { comments: newComment._id } },
    )

    if (req.userId != parentComment.recipe.user) {
      const newNotification = new Notification({
        actor: req.userId,
        recipient: parentComment.recipe.user,
        type: 'comment',
        avatar,
        recipe: parentComment.recipe,
        message: `${username} replied to your comment: ${content}`,
      })

      await newNotification.save()
    }

    return res.status(201).json({
      message: 'Comment reply has been created successfully',
      newComment,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route GET /comment/:commentId/replies
const getCommentReplies = async (req, res) => {
  try {
    const { commentId } = req.params

    const replies = await Comment.find({ parentComment: commentId })
      .populate('user', 'avatar username')
      .lean()

    const modifiedReplies = replies.map((reply) => {
      const userIdObjectId = new mongoose.Types.ObjectId(req.userId)
      const isLikedByUser = reply.likes.some((like) =>
        like.equals(userIdObjectId),
      )
      return {
        id: reply._id,
        content: reply.content,
        nbOfLikes: reply.likes.length,
        isLikedByUser: !!isLikedByUser,
        createdAt: dayjs(reply.createdAt).fromNow(),
        commentedUserUsername: reply.user.username,
        commentedUserAvatar: reply.user.avatar,
        recipe: reply.recipe,
        canDelete: req.userId === reply.user._id.toString() ? true : false,
      }
    })

    return res.status(200).json(modifiedReplies)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route DELETE /comment/:commentId
const deleteComment = async (req, res, next) => {
  try {
    const userId = req.userId
    const { commentId } = req.params

    const user = await User.findById(userId)
    const comment = await Comment.findById(commentId).lean()
    const recipe = await Recipe.findOne({ _id: comment.recipe })

    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    req.title = recipe.title
    req.content = comment.content
    req.date = timeConverter(comment.createdAt)
    req.user = comment.user

    const repliesToComment = await Comment.find({
      parentComment: comment._id,
    })

    if (comment.user != userId && user.role === 'general')
      return res.status(403).json({ message: 'Invalid permissions!' })

    for (const reply of repliesToComment) {
      await Comment.findByIdAndDelete(reply._id)
    }

    // Update the Recipe to remove both the comment and its replies
    await Recipe.updateOne(
      { _id: comment.recipe },
      {
        $pull: {
          comments: {
            $in: [commentId, ...repliesToComment.map((reply) => reply._id)],
          },
        },
      },
    )
    await Comment.findByIdAndDelete(commentId)

    if (user.role === 'admin') {
      req.type = 'deleteComment'
      next()
    } else
      return res.status(200).json({ message: 'Comment deleted successfully!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route DELETE /comment/:commentId/reply/:replyId
const deleteReply = async (req, res, next) => {
  try {
    const userId = req.userId
    const { commentId, replyId } = req.params

    const user = await User.findById(userId)

    const reply = await Comment.findOne({
      _id: replyId,
      parentComment: commentId,
    }).lean()

    const recipe = await Recipe.findOne({ _id: reply.recipe })

    if (!reply) return res.status(404).json({ message: 'Reply not found!' })

    req.title = recipe.title
    req.content = reply.content
    req.date = timeConverter(reply.createdAt)
    req.user = reply.user

    if (reply.user.toString() !== userId && user.role === 'general')
      return res.status(403).json({ message: 'Invalid permissions!' })

    await Recipe.findOneAndUpdate(
      {
        _id: { $eq: reply.recipe },
      },
      {
        $pull: {
          comments: replyId,
        },
      },
    )

    await Comment.deleteOne({ _id: replyId, parentComment: commentId })

    if (user.role === 'admin') {
      req.type = 'deleteComment'
      next()
    } else
      return res.status(200).json({ message: 'Reply deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  likeComment,
  unlikeComment,
  replyToComment,
  getCommentReplies,
  deleteComment,
  deleteReply,
}
