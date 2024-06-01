const User = require('../models/user.model')
const Suggestion = require('../models/suggestion.model')
const timeConverter = require('../utils/timeConverter')

// @route POST /users/suggestion
const addSuggestion = async (req, res) => {
  const userId = req.userId

  const { content } = req.body
  try {
    const userExists = await User.findById(userId)

    if (!userExists) return res.status(404).json({ message: 'User not found' })

    const newSuggestion = new Suggestion({
      content,
      user: userId,
    })

    await newSuggestion.save()
    return res
      .status(201)
      .json({ message: 'Suggestion has been added successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route GET /admins/suggestions
const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find().populate('user').lean()

    const modifiedSuggestions = suggestions.map((suggestion) => {
      return {
        id: suggestion._id,
        content: suggestion.content,
        handledBy: suggestion.handledBy,
        isAccepted: suggestion.isAccepted,
        user: suggestion.user.username,
        createdAt: timeConverter(suggestion.createdAt),
      }
    })
    return res.json(modifiedSuggestions)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route DELETE admins/suggestion/:suggestionId
const deleteSuggestion = async (req, res) => {
  try {
    const { suggestionId } = req.params

    const deletedSuggestion = await Suggestion.findOneAndDelete({
      _id: suggestionId,
    })

    if (!deletedSuggestion)
      return res.status(404).json({ message: 'Suggestion not found' })

    return res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route PATCH admins/suggestion/:suggestionId/check
const checkSuggestion = async (req, res) => {
  try {
    const { adminId } = req
    const { suggestionId } = req.params

    const checkedSuggestion = await Suggestion.findOneAndUpdate(
      { _id: suggestionId },
      {
        isAccepted: true,
        handledBy: adminId,
      },
    )
    if (!checkedSuggestion)
      return res.status(404).json({ message: 'Suggestion not found' })

    return res.status(200).json({ message: 'Suggestion checked successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @route PATCH admins/suggestion/:suggestionId/uncheck
const unCheckSuggestion = async (req, res) => {
  try {
    const { adminId } = req
    const { suggestionId } = req.params
    const unCheckedSuggestion = await Suggestion.findOneAndUpdate(
      {
        _id: suggestionId,
      },
      {
        isAccepted: false,
        handledBy: adminId,
      },
    )
    if (!unCheckedSuggestion)
      return res.status(404).json({ message: 'Suggestion not found' })
    return res
      .status(200)
      .json({ message: 'Suggestion unchecked successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  addSuggestion,
  getAllSuggestions,
  deleteSuggestion,
  checkSuggestion,
  unCheckSuggestion,
}
