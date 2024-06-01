const nodemailer = require('nodemailer')
const { userActionsTemplate } = require('../../utils/userActionsTemplate')
const User = require('../../models/user.model')

const sendEmail = async (req, res) => {
  const EMAIL = process.env.GMAIL_EMAIL
  const PASS = process.env.GMAIL_PASSWORD

  const { id } = req.params
  const { reason } = req.body
  const { type, title, content, date, user: userId } = req

  const user = await User.findById(id || userId)

  let subject
  switch (type) {
    case 'warn':
      subject = 'You have been warned'
      break
    case 'unwarn':
      subject = 'You have been unwarned'
      break
    case 'ban':
      subject = 'You have been banned'
      break
    case 'unban':
      subject = 'You have been unbanned'
      break
    case 'deleteComment':
      subject = 'Your comment has been deleted'
      break
    case 'deleteRecipe':
      subject = 'Your recipe has been deleted'
      break
    default:
      subject = ''
      break
  }

  try {
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL,
        pass: PASS,
      },
    })

    await transporter.sendMail({
      from: `Recipe App <${EMAIL}>`,
      to: user.email,
      subject,
      html: userActionsTemplate(type, reason, title, content, date),
    })

    return res.status(200).json({
      message: `An email is sent to the user.`,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

module.exports = { sendEmail }
