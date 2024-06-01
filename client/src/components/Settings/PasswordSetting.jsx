import { FormControl, TextField, Button, IconButton } from '@mui/material'
import { useChangePasswordMutation } from '../../redux/slices/userApiSlice'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tsuccess, terror } from '../../utils/toasts'
import { ClipLoader } from 'react-spinners'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const PasswordSetting = ({ windowWidth }) => {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [changePassword] = useChangePasswordMutation()

  const handleChangePassword = async () => {
    setIsLoading(true)
    try {
      const res = await changePassword({
        oldPassword,
        newPassword,
        confirmNewPassword,
      })
      if (res?.error?.status === 400 || res?.error?.status === 500) {
        terror(`${res?.error?.data?.message}`)
        setIsLoading(false)
      }

      if (res?.data?.message === 'Password changed successfully') {
        tsuccess('Password changed successfully')
        setTimeout(() => {
          navigate('/profile')
        }, 1500)
      }
    } catch (error) {
      terror('Something went wrong')
      console.error(error)
      setIsLoading(false)
    }
  }
  return (
    <>
      <form className="flex flex-col h-[100%] overflow-y-auto list-scroll-bar w-full max-lg:items-center max-lg:pt-2">
        <FormControl
          sx={{ width: windowWidth < 1024 ? '90%' : '40ch' }}
          margin="normal"
        >
          <label htmlFor="old-password" className="text-primary-50">
            Old password
          </label>
          <div className="flex items-center relative">
            <TextField
              id="old-password"
              required
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              fullWidth
              placeholder="Old Password"
              onChange={e => setOldPassword(e.target.value)}
            />
            {oldPassword.length > 0 && (
              <IconButton
                sx={{ position: 'absolute', right: '0' }}
                onClick={() => setShowOldPassword(state => !state)}
              >
                {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            )}
          </div>
        </FormControl>

        <FormControl
          sx={{ width: windowWidth < 1024 ? '90%' : '40ch' }}
          margin="normal"
        >
          <label htmlFor="new-password" className="text-primary-50">
            New Password
          </label>
          <div className="flex items-center relative">
            <TextField
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              required
              value={newPassword}
              placeholder="New Password"
              fullWidth
              onChange={e => setNewPassword(e.target.value)}
            />
            {newPassword.length > 0 && (
              <IconButton
                sx={{ position: 'absolute', right: '0' }}
                onClick={() => setShowNewPassword(state => !state)}
              >
                {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            )}
          </div>
        </FormControl>

        <FormControl
          sx={{ width: windowWidth < 1024 ? '90%' : '40ch' }}
          margin="normal"
        >
          <label htmlFor="confirm-new-password" className="text-primary-50">
            Confirm New Password
          </label>
          <div className="flex items-center relative">
            <TextField
              id="confirm-new-password"
              required
              fullWidth
              value={confirmNewPassword}
              type={showConfirmNewPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              onChange={e => setConfirmNewPassword(e.target.value)}
            >
              Confirm-new-password
            </TextField>
            {confirmNewPassword.length > 0 && (
              <IconButton
                sx={{ position: 'absolute', right: '0' }}
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
        </FormControl>

        <Button
          disabled={isLoading}
          sx={{
            marginTop: windowWidth < 1024 ? '.8rem' : '1.5rem',
            marginInline: 'auto',
            textTransform: 'none',
            alignSelf: 'flex-end',
            background: '#333329',
            color: '#fff',
            padding: '13px 25px',
            '&:hover': {
              color: '#333329',
              background: '#fff',
            },
          }}
          onClick={handleChangePassword}
        >
          {isLoading ? <ClipLoader size={25} color="#fff" /> : 'Save Changes'}
        </Button>
      </form>
    </>
  )
}

export default PasswordSetting
