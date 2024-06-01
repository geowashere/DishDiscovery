import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Notifications from './pages/Notifications'
import CreateRecipe from './pages/CreateRecipe'
import CreateBook from './pages/CreateBook'
import Settings from './pages/Settings'
import Recipe from './pages/Recipe'
import Book from './pages/Book'
import EmailVerifiedMessage from './pages/EmailVerifiedMessage'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import GeneralProfile from './pages/GeneralProfile'

export const privateRoutes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/notifications',
    component: Notifications,
  },
  {
    path: '/create-recipe',
    component: CreateRecipe,
  },
  {
    path: '/edit-recipe',
    component: CreateRecipe, // almost same component
  },
  {
    path: '/create-book',
    component: CreateBook,
  },
  {
    path: '/edit-book',
    component: CreateBook, // edit book page is 99% identical to create book page
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/user/:id',
    component: GeneralProfile,
  },
  {
    path: '/recipe/:recipeId',
    component: Recipe,
  },
  {
    path: '/book/:bookId',
    component: Book,
  },
  {
    path: '/admin-panel',
    component: Admin,
  },
]

export const publicRoutes = [
  {
    path: '/register',
    component: SignUp,
  },
  {
    path: '/verify',
    component: EmailVerifiedMessage,
  },
  {
    path: '/verify-code',
    component: VerifyEmail,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
  },
  {
    path: '*',
    component: NotFound,
  },
]
