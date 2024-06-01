require('dotenv').config()
const express = require('express')
const Database = require('./config/db')
const cors = require('cors')
const app = express()
const usersRoute = require('./routes/user.route')
const recipesRoute = require('./routes/recipe.route.js')
const recipeBooksRoute = require('./routes/recipeBook.route.js')
const ingredientsRoute = require('./routes/ingredient.route.js')
const notificationsRoute = require('./routes/notification.route.js')
const adminsRoute = require('./routes/admin.route.js')
const passport = require('passport')
const port = 3000

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
require('./config/passport.js')

app.use(
  '/assets/userAvatars',
  express.static(__dirname + '/assets/userAvatars'),
)
app.use('/assets/bookImages', express.static(__dirname + '/assets/bookImages'))
app.use(
  '/assets/recipeImages',
  express.static(__dirname + '/assets/recipeImages'),
)

const db = new Database(process.env.MONGODB_URI)

db.connect().catch((err) => {
  console.error('Error connecting to database:', err)
})

app.use('/users', usersRoute)
app.use('/recipes', recipesRoute)
app.use('/books', recipeBooksRoute)
app.use('/ingredients', ingredientsRoute)
app.use('/notifications', notificationsRoute)
app.use('/admins', adminsRoute)

process.on('SIGINT', async () => {
  try {
    await db.disconnect()
    console.log('Disconnected from database.')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
