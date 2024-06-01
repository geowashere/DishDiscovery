const bannedEmailHTML = (username) =>
  `<div style="max-width: 600px; margin: auto; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgb(104, 182, 255);">
  <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
    <p style="font-size: 18px; margin-bottom: 20px; text-align: center; color: #4b5563; font-weight: bold;">Hello, ${username}!</p>
    <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #4b5563;">You cannot reset your password because you are banned</p>
    <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #4b5563;">If you did not send this email, please contact us.</p>
   </div>
</div>`

module.exports = { bannedEmailHTML }
