import { useState } from 'react'
import registerImage from '../assets/register.jpeg'
import { TextField, Button, FormControl, IconButton } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { ThemeProvider } from '@mui/material/styles'
import {
  useGetAllUsernamesQuery,
  useRegisterUserMutation,
} from '../redux/slices/userApiSlice'
import { borderTheme } from '../utils/borderTheme'
import { ClipLoader } from 'react-spinners'
import { terror, twarn } from '../utils/toasts'

const SignUp = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerUser] = useRegisterUserMutation()
  const [isDisabled, setIsDisabled] = useState(false)

  const { data: usernames, isSuccess } = useGetAllUsernamesQuery()

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault()
    if (
      !email.trim() ||
      !password.trim() ||
      !username.trim() ||
      !confirmPassword.trim()
    ) {
      console.log('Field cannot be empty')
      return
    }

    if (username.toLowerCase().trim() === 'deleteduser') {
      twarn("Can't use that username!")
      return
    }

    if (!username.trim() || username.trim().length <= 3) {
      twarn('Your username must be 4 characters long')
      return
    }

    if (username.trim().length > 20) {
      twarn('Your username must be less than 20 characters long')
      return
    }
    const regex = /^[A-Za-z ]+$/
    if (!regex.test(username)) {
      twarn('Can only use characters and spaces for username!')
      return
    }
    if (
      isSuccess &&
      usernames.find(
        u => u.toLowerCase().trim() === username.toLowerCase().trim()
      )
    ) {
      twarn(`username ${username} is already taken`)
      return
    }

    setIsDisabled(true)
    try {
      await registerUser({
        email,
        password,
        username,
        confirmPassword,
      }).unwrap()
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      navigate('/verify-code', {
        state: {
          email,
        },
      })
    } catch (error) {
      setIsDisabled(false)
      terror(error?.data?.message || error.error)
    }
  }

  return (
    <ThemeProvider theme={borderTheme}>
      <div className="mx-auto min-h-screen overflow-auto bg-background flex flex-col justify-center gap-10 max-sm:gap-5">
        <div className="font-bold text-4xl text-primary text-center leading-normal max-sm:text-2xl">
          <p>Welcome to DishDiscovery!</p>
          <p>Create your own account!</p>
        </div>

        <div className="container rounded-lg flex justify-center items-center gap-14 h-2/3 p-5">
          <img
            src={registerImage}
            className="rounded-lg object-cover max-h-full max-w-[400px] max-md:hidden "
          />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col align-center gap-3 form"
          >
            <FormControl className="flex flex-col gap-1 text-primary text-1xl xl:w-[40ch] max-sm:w-full max-xl:[33ch]">
              <label htmlFor="username" className="text-primary">
                Username
              </label>
              <TextField
                id="username"
                required
                value={username}
                placeholder="Username"
                onChange={e => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl
              sx={{}}
              className="flex flex-col gap-1 text-primary text-1xl  xl:w-[40ch] max-sm:w-full max-xl:[33ch]"
            >
              <label htmlFor="email" className="text-primary">
                E-mail
              </label>
              <TextField
                id="email"
                required
                type="email"
                value={email}
                placeholder="E-mail"
                onChange={e => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl className="flex flex-col gap-1 text-primary text-1xl  xl:w-[40ch] max-sm:w-full max-xl:[33ch]">
              <label htmlFor="password" className="text-primary">
                Password
              </label>
              <div className=" flex items-center relative">
                <TextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  placeholder="Password"
                  fullWidth
                  onChange={e => setPassword(e.target.value)}
                />
                {password.length > 0 && (
                  <IconButton
                    sx={{ position: 'absolute', right: '0' }}
                    onClick={() => setShowPassword(state => !state)}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                )}
              </div>
            </FormControl>
            <FormControl className="flex flex-col gap-1 text-primary text-1xl xl:w-[40ch] max-sm:w-full max-xl:[33ch]">
              <label htmlFor="confirmPassword" className="text-primary">
                Confirm Password
              </label>
              <div className=" flex items-center relative">
                <TextField
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {confirmPassword.length > 0 && (
                  <IconButton
                    sx={{ position: 'absolute', right: '0' }}
                    onClick={() => setShowConfirmPassword(state => !state)}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                )}
              </div>
            </FormControl>
            <div className="flex flex-col gap-2 btn-alr">
              <Button
                type="submit"
                disabled={isDisabled}
                variant="contained"
                sx={{
                  background: '#333329',
                  padding: '15px 0',
                  marginTop: window.innerWidth <= 480 ? '0' : '15px',
                  '&:hover': {
                    background: '#fff',
                    color: '#333329',
                  },
                }}
              >
                {isDisabled ? <ClipLoader size={25} /> : 'Register'}
              </Button>
              <Link to="/login" className="text-primary text-lg cursor-pointer">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default SignUp
