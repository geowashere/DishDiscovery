const Report = require('../models/report.model')
const User = require('../models/user.model')
const timeConverter = require('../utils/timeConverter')

//@route POST users/create-report/:id
//@desc - id: user to be reported, userId: user who is reporting
const createReport = async (req, res) => {
  const { id } = req.params
  const { userId } = req
  const { type, description } = req.body

  try {
    const userExists = await User.findById(userId)
    const reportedUserExists = await User.findById(id)

    if (!userExists || !reportedUserExists) {
      return res.status(404).json({ message: 'User(s) not found' })
    }

    if (!type.trim()) {
      return res.status(404).json({ message: 'Type not found' })
    }

    const newReport = new Report({
      reportedUser: id,
      user: userId,
      type,
      description,
    })

    await newReport.save()

    return res.status(201).json({ message: 'Report added Successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@route PATCH admins/report/:reportId/close
const closeReport = async (req, res) => {
  const { adminId } = req
  const { reportId } = req.params

  try {
    const adminExists = await User.findById(adminId)
    if (!adminExists)
      return res.status(404).json({ message: 'Admin not found' })

    const reportExists = await Report.findById(reportId)
    if (!reportExists)
      return res.status(404).json({ message: 'Report not found' })

    if (reportExists.isClosed)
      return res.status(400).json({ message: 'Report already closed' })

    reportExists.isClosed = true
    reportExists.closedBy = adminId

    await reportExists.save()

    return res.status(200).json({ message: 'Report  closed successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@router DELETE admins/report/:reportId
const deleteReport = async (req, res) => {
  const { adminId } = req
  const { reportId } = req.params

  try {
    const adminExists = await User.findById(adminId)
    if (!adminExists)
      return res.status(404).json({ message: 'Admin not found' })

    const reportExists = await Report.findOneAndDelete({ _id: reportId })
    if (!reportExists)
      return res.status(404).json({ message: 'Report not found' })

    return res.status(200).json({ message: 'Report  deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

//@router GET admins/reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('user reportedUser closedBy')
      .lean()

    const modifiedReports = reports.map((report) => {
      return {
        id: report._id,
        description: report.description,
        username: report.user.username,
        reportedUserName: report.reportedUser.username,
        type: report.type,
        closedBy: report.closedBy?.username || null,
        isClosed: report.isClosed,
        createdAt: timeConverter(report.createdAt),
      }
    })

    return res.json(modifiedReports)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  createReport,
  closeReport,
  deleteReport,
  getAllReports,
}
