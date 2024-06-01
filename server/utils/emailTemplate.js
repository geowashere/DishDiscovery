const verifyEmailHTML = (username, verificationLink, verificationCode) =>
  `<div style="max-width: 600px; margin: auto; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgb(104, 182, 255);">
  <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
    <p style="font-size: 18px; margin-bottom: 20px; text-align: center; color: #4b5563; font-weight: bold;">Welcome to DishDiscovery, ${username}!</p>
    <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #4b5563;">Please click the button below to verify your email address and activate your account:</p>
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="${verificationLink}" style="background-color: #333329; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; font-size: 16px; font-weight: bold;">Verify Email Address</a>
   </div>
    <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #6b7280;">The link will expire in 30 minutes.</p>
    <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #6b7280;">You can resend another email after 30 minutes.</p>
    <p style="font-size: 16px; margin-bottom: 15px; text-align: center; color: #333329; font-weight: bold;">Your verification code is: <span style="color: #000000;">${verificationCode}</span></p>
    <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #4b5563;">If you did not create an account, please ignore this email.</p>
   </div>
</div>`

module.exports = { verifyEmailHTML }
