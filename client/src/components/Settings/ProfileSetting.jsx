import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormControl, TextField, Button } from '@mui/material'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import dp from '../../assets/dp.jpg'
import { handleImageChange, handleShowImage } from '../../utils/imageHandling'
import {
  useGetAllUsernamesQuery,
  useGetUserQuery,
  useUpdateUserMutation,
} from '../../redux/slices/userApiSlice'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import { tsuccess, terror, twarn } from '../../utils/toasts'

const ProfileSetting = ({ windowWidth }) => {
  const navigate = useNavigate()
  const { username, bio, avatar } = useSelector(selectCurrentUser)
  const [image, setImage] = useState(null)
  const [showImage, setShowImage] = useState(avatar)
  const [showImageError, setShowImageError] = useState(null)
  const [oldUsername, setOldUsername] = useState(username)
  const [oldBio, setOldBio] = useState(bio)
  const [isLoading, setIsLoading] = useState(false)

  const { refetch: refetchUser } = useGetUserQuery('User')
  const [updateUser] = useUpdateUserMutation()

  const handleImage = e => {
    handleShowImage(e, setShowImage)
    handleImageChange(e, setImage, setShowImageError, dp)
  }

  const { data: usernames, isSuccess } = useGetAllUsernamesQuery()

  const handleUpdate = async () => {
    if (!oldUsername.trim() || oldUsername.trim().length <= 3) {
      twarn('Your username must be 4 characters long')
      return
    }

    if (oldUsername === 'Deleted User') {
      twarn("Can't use that username!")
      return
    }

    const regex = /^[A-Za-z ]+$/
    if (!regex.test(oldUsername)) {
      twarn('Can only use characters and spaces!')
      return
    }

    if (
      isSuccess &&
      usernames.find(
        u =>
          u.toLowerCase().trim() === oldUsername.toLowerCase().trim() &&
          oldUsername.toLowerCase().trim() !== username.toLowerCase().trim()
      )
    ) {
      twarn(`username ${oldUsername} is already taken`)
      return
    }

    if (oldUsername.trim().length > 20) {
      twarn('Your username must be less than 20 characters long')
      return
    }

    setIsLoading(true)
    const newUserData = new FormData()
    newUserData.append('avatar', image)
    newUserData.append('username', oldUsername)
    newUserData.append('bio', oldBio)

    try {
      await updateUser(newUserData)
      refetchUser()

      tsuccess('user updated successfully')
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } catch (error) {
      terror('Something went wrong')
      setIsLoading(false)
      console.error('Error updating user:', error)
    }
  }

  return (
    <>
      <div className="flex flex-col max-lg:pt-2  max-lg:w-10/12">
        <h2 className="text-2xl text-primary max-lg:text-center">
          Edit your profile
        </h2>
        <form className="flex flex-col max-lg:items-center">
          <FormControl
            sx={{ width: windowWidth < 1024 ? '90%' : '40ch' }}
            margin="normal"
          >
            <label htmlFor="username" className="text-primary-50">
              Username
            </label>
            <TextField
              fullWidth
              id="username"
              required
              defaultValue={oldUsername}
              onChange={e => setOldUsername(e.target.value)}
            />
          </FormControl>

          <FormControl
            sx={{ width: windowWidth < 1024 ? '90%' : '40ch' }}
            margin="normal"
          >
            <label htmlFor="bio" className="text-primary-50">
              Bio
            </label>
            <TextField
              id="bio"
              multiline
              rows={5}
              required
              defaultValue={oldBio}
              onChange={e => setOldBio(e.target.value)}
            >
              Bio
            </TextField>
          </FormControl>
        </form>
      </div>
      <div className="flex flex-col gap-5 max-lg:gap-7 items-center justify-start w-1/3 max-lg:w-[80%]  max-md:w-full">
        {showImage && (
          <img
            src={showImage}
            alt="user img"
            style={{
              height: windowWidth < 1024 ? '150px' : '200px',
              width: windowWidth < 1024 ? '250px' : '300px',
              objectFit: 'cover',
            }}
          />
        )}
        {showImageError && <p>{showImageError}</p>}
        <div className="flex lg:flex-col gap-5 max-sm:flex-col">
          <Button
            startIcon={<AddAPhotoIcon />}
            component="label"
            sx={{
              background: '#333329',
              textTransform: 'none',
              color: '#fff',
              padding: '15px 35px',
              '&:hover': {
                color: '#333329',
                background: '#fff',
              },
            }}
          >
            Change Image
            <input
              accept="image/*"
              style={{}}
              id="contained-button-file"
              multiple
              type="file"
              hidden
              onChange={handleImage}
            />
          </Button>
          <Button
            sx={{ color: 'red' }}
            onClick={() => {
              setImage(dp)
              setShowImage(dp)
            }}
          >
            Reset Image
          </Button>
          <Button
            disabled={isLoading}
            sx={{
              background: '#333329',
              textTransform: 'none',
              color: '#fff',
              padding: '15px 35px',
              '&:hover': {
                color: '#333329',
                background: '#fff',
              },
            }}
            onClick={handleUpdate}
          >
            {isLoading ? (
              <ClipLoader size={25} color="#fff" />
            ) : (
              ' Save Changes'
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

export default ProfileSetting
