import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../redux/slices/authApiSlice'
import { setCredentials } from '../redux/slices/authSlice'
import { TextField, Button, FormControl, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { ThemeProvider } from '@mui/material/styles'
import { borderTheme } from '../utils/borderTheme'
import registerImage from '../assets/register.jpeg'
import { ClipLoader } from 'react-spinners'
import { terror } from '../utils/toasts'
import { ToastContainer } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [isDisabled, setIsDisabled] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login] = useLoginMutation()

  const signIn = async e => {
    e.preventDefault()
    setIsDisabled(true)
    try {
      const { accessToken, refreshToken, user, isEmailVerified } = await login({
        email,
        password,
      }).unwrap()
      if (isEmailVerified) {
        if (user.isBanned) {
          terror('Your are banned')
          setIsDisabled(false)
          return
        }
        dispatch(setCredentials({ accessToken, refreshToken, user }))
        setEmail('')
        setPassword('')
        navigate('/home')
      } else {
        navigate('/verify-code', {
          state: {
            email,
          },
        })
      }
    } catch (error) {
      setIsDisabled(false)
      terror(error?.data?.message)
      if (error?.data?.message === 'Please verify your email') {
        setTimeout(() => {
          navigate('/verify-code', {
            state: {
              email,
            },
          })
        }, 1500)
      }
    }
  }

  const handleForgotPassword = () => {
    navigate('/reset-password', {
      state: {
        previousRoute: '/login',
      },
    })
  }

  return (
    <ThemeProvider theme={borderTheme}>
      <div className="mx-auto min-h-screen overflow-auto bg-background flex flex-col justify-center gap-10 max-sm:gap-5">
        <p className="font-bold text-4xl text-primary text-center leading-normal max-sm:text-2xl">
          Log in to your account
        </p>
        <div className="container flex justify-center items-center gap-14 h-2/3 p-5">
          <img
            src={registerImage}
            className="rounded-lg object-cover max-h-full w-5/12  max-w-[400px] max-md:hidden"
          />
          <form
            className="flex flex-col align-center gap-3 form"
            onSubmit={signIn}
          >
            <FormControl className="flex flex-col gap-1 text-primary text-1xl  w-[40ch] max-mobile:w-full">
              <label htmlFor="email" className="text-primary">
                Email
              </label>
              <TextField
                id="email"
                required
                type="text" //! email
                value={email}
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl className="flex flex-col gap-1 text-primary text-1xl w-[40ch] max-mobile:w-full">
              <label htmlFor="password">Password</label>
              <div className="flex items-center relative">
                <TextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  required
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
              {isDisabled ? <ClipLoader size={25} /> : 'Sign In'}
            </Button>
            <button
              className="text-left text-lg text-primary"
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </button>
            <br />
            <p className="text-center text-lg text-primary">
              Don't have an account?
              <Link to="/register"> Sign up</Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </ThemeProvider>
  )
}

export default Login
