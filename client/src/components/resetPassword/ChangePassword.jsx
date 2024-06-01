import { useNavigate } from 'react-router-dom'
import { useResetPasswordMutation } from '../../redux/slices/userApiSlice'
import { ClipLoader } from 'react-spinners'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { IconButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { terror } from '../../utils/toasts'

const ChangePassword = ({ email }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfimNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [resetPassword] = useResetPasswordMutation()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const confirm = async () => {
    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      terror('All fields are required')
      return
    }
    if (newPassword !== confirmNewPassword) {
      terror(
        'Please ensure that the new password and confirmed new password match.'
      )
      return
    }
    setIsLoading(true)
    try {
      const res = await resetPassword({ newPassword, email })
      if (res?.error) {
        terror('An error has occurred. Please try again.')
        setIsLoading(false)
      } else {
        navigate('/login')
      }
    } catch (error) {
      alert('An error has occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-primary font-[600] text-xl max-sm:text-center">
        Choose a new password
      </h1>
      <p className="max-sm:text-center">Create a new password.</p>
      <div className="flex items-center relative">
        <input
          className="w-[90%] rounded-lg border-2 border-gray-200 p-2"
          placeholder="New Password"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        {newPassword.length > 0 && (
          <IconButton
            sx={{
              position: 'absolute',
              right: windowWidth < 640 ? '-8px' : '0',
            }}
            onClick={() => setShowNewPassword(state => !state)}
          >
            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        )}
      </div>
      <div className="flex items-center relative">
        <input
          className="w-[90%] rounded-lg border-2 border-gray-200 p-2"
          placeholder="Confirm new Password"
          type={showConfirmNewPassword ? 'text' : 'password'}
          value={confirmNewPassword}
          onChange={e => setConfimNewPassword(e.target.value)}
        />
        {confirmNewPassword.length > 0 && (
          <IconButton
            sx={{
              position: 'absolute',
              right: windowWidth < 640 ? '-8px' : '0',
            }}
            onClick={() => setShowConfirmNewPassword(state => !state)}
          >
            {showConfirmNewPassword ? (
              <VisibilityOffIcon />
            ) : (
              <VisibilityIcon />
            )}
          </IconButton>
        )}
      </div>
      <div className="flex gap-4 justify-end px-3 max-sm:justify-center">
        <button
          className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          disabled={isLoading}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-50"
          onClick={confirm}
        >
          {isLoading ? <ClipLoader size={25} /> : 'Confirm'}
        </button>
      </div>
    </div>
  )
}

export default ChangePassword
