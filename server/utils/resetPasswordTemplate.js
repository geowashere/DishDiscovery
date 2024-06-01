const resetPasswordHTML = (username, resetCode) =>
  `<div style="max-width: 600px; margin: auto; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgb(138, 138, 92);">
  <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
    <p style="font-size: 18px; margin-bottom: 20px; text-align: center; color: #4b5563; font-weight: bold;">Hi, ${username}!</p>
    <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #4b5563;">We received a request to reset your password. Enter the following password reset code:</p>
    <p style="font-size: 16px; margin-bottom: 15px; text-align: center; color: #333329; font-weight: bold;">Your reset code is: <span style="color: #000000;">${resetCode}</span></p>
    <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #6b7280;">The code will expire in 30 minutes.</p>
    <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #6b7280;">You can resend another code after 30 minutes.</p>
    <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #4b5563;">If you did not request a new password, please ignore this email.</p>
   </div>
</div>`

module.exports = { resetPasswordHTML }
