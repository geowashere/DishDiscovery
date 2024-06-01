const userActionsTemplate = (type, reason, title, content, date) =>
  type === 'warn' || type === 'unwarn' || type === 'ban' || type === 'unban'
    ? `<div style="max-width: 600px; margin: auto; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgb(104, 182, 255);">
<div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
  <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #4b5563;">You have been ${type === 'warn' ? `warned for <b>${reason}</b>` : type === 'unwarn' ? 'unwarned' : type === 'ban' ? `banned for <b>${reason}</b>` : 'unbanned'}</p>
 </div>
</div>`
    : type === 'deleteComment'
      ? `
    <div style="max-width: 600px; margin: auto; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgb(104, 182, 255);">
    <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
      <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #4b5563;">
      Your comment <b>'${content}'</b> on the recipe titled <b>'${title}'</b> posted on <b>'${date}'</b>, has been deleted.
      </p>
     </div>
    </div>
    `
      : `<div style="max-width: 600px; margin: auto; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgb(104, 182, 255);">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #4b5563;">
        Your recipe titled <b>'${title}'</b> posted on <b>'${date}'</b>, has been deleted.
        </p>
       </div>
      </div>`

module.exports = { userActionsTemplate }
