const nodemailer = require('nodemailer')
const { resetPasswordHTML } = require('../../utils/resetPasswordTemplate')
const { bannedEmailHTML } = require('../../utils/bannedTemplate')
const EmailVerification = require('../../models/email.model')
const User = require('../../models/user.model')

const sendResetPasswordEmail = async (req, res) => {
  const EMAIL = process.env.GMAIL_EMAIL
  const PASS = process.env.GMAIL_PASSWORD

  const { email } = req.body
  const user = await User.findOne({ email }).lean()

  if (!user) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid email address' })
  }

  const isEmailNotExpired = await EmailVerification.findOne({
    email,
    for: 'resetPassword',
  })

  if (isEmailNotExpired) {
    return res.status(400).json({ message: 'Please check your email' })
  }

  const verificationCode = Math.floor(10000 + Math.random() * 90000)

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
    let info = await transporter.sendMail({
      from: `Recipe App <${EMAIL}>`,
      to: email,
      subject: user.isBanned ? 'You are banned' : 'Reset your password',
      html: user.isBanned
        ? bannedEmailHTML(user.username)
        : resetPasswordHTML(user.username, verificationCode),
    })

    if (!user.isBanned) {
      const resetCode = new EmailVerification({
        email,
        verificationCode,
        messageId: info.messageId,
        for: 'resetPassword',
      })
      await resetCode.save()

      return res.status(200).json({
        message: `Reset code  email was successfully sent to ${email}`,
      })
    } else {
      return res.status(200).json({
        message: `An email is sent to ${email}`,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

const verifyCode = async (req, res) => {
  const { code, email } = req.query
  const isCodeTrue = await EmailVerification.findOne({
    email,
    for: 'resetPassword',
    verificationCode: code,
  })

  if (!isCodeTrue)
    return res
      .status(400)
      .json({ message: 'The code you entered is incorrect.' })

  await EmailVerification.deleteOne({ email, for: 'resetPassword' })
  return res.status(200).json({ message: 'Success' })
}

module.exports = { sendResetPasswordEmail, verifyCode }
