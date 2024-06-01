const nodemailer = require('nodemailer')
const { verifyEmailHTML } = require('../../utils/emailTemplate')
const EmailVerification = require('../../models/email.model')
const User = require('../../models/user.model')

const sendVerificationEmail = async (req, res) => {
  const EMAIL = process.env.GMAIL_EMAIL
  const PASS = process.env.GMAIL_PASSWORD

  const { email } = req.body
  const user = await User.findOne({ email }).lean()

  const verificationCode = Math.floor(10000 + Math.random() * 90000)
  const verificationLink = `http://localhost:5173/verify?code=${verificationCode}&email=${email}`

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
      subject: 'Verify your email address',
      html: verifyEmailHTML(user.username, verificationLink, verificationCode),
    })

    const newVerification = new EmailVerification({
      email,
      verificationCode,
      messageId: info.messageId,
      for: 'emailVerification',
    })

    await newVerification.save()
    return res.status(200).json({
      isEmailVerified: false,
      message: `Verification email was successfully sent to ${email}`,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

const verifyEmail = async (req, res) => {
  const { code, email } = req.query

  try {
    const [isVerified, verification] = await Promise.all([
      User.findOne({ email: { $eq: email }, isEmailVerified: true }),
      EmailVerification.findOne({
        email: { $eq: email },
        verificationCode: { $eq: code },
      }),
    ])

    if (isVerified) {
      return res.status(400).json({ message: 'Email is already verified' })
    }

    if (!verification) {
      return res
        .status(400)
        .json({ message: 'Verification code is invalid or has expired' })
    }

    await User.findOneAndUpdate(
      { email: { $eq: email } },
      { isEmailVerified: true },
      { new: true },
    ).exec()

    await Promise.all([
      EmailVerification.deleteMany({
        email: { $eq: email },
        for: 'emailVerification',
      }).exec(),
    ])

    return res.status(200).json({ message: 'success' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { sendVerificationEmail, verifyEmail }
