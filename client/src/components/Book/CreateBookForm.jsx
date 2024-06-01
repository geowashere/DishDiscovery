import { TextField, Button, FormControl } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import di from '../../assets/di.jpg'
import { ThemeProvider } from '@mui/material/styles'
import chefHat from '../../assets/chefhat.svg'
import descriptionSvg from '../../assets/description.svg'
import { borderTheme } from '../../utils/borderTheme'
import { handleShowImage, handleImageChange } from '../../utils/imageHandling'
import {
  useCreateBookMutation,
  useUpdateBookMutation,
} from '../../redux/slices/bookApiSlice'
import { ClipLoader } from 'react-spinners'
import { twarn } from '../../utils/toasts'
import { useDispatch } from 'react-redux'
import { setToast } from '../../redux/slices/toastSlice'

const CreateBookForm = () => {
  const navigate = useNavigate()

  const location = useLocation()
  const dispatch = useDispatch()

  const book = location.state?.book || {}

  const [title, setTitle] = useState(book?.title ? book?.title : '')
  const [description, setDescription] = useState(
    book?.description ? book?.description : ''
  )
  const [image, setImage] = useState(book?.image ? book?.image : di)
  const [showImage, setShowImage] = useState(book?.image ? book?.image : di)
  const [showImageError, setShowImageError] = useState(null)
  const [isToastVisible, setIsToastVisible] = useState(false)

  const [createBook] = useCreateBookMutation()
  const [updateBook] = useUpdateBookMutation()

  const handleImage = e => {
    handleShowImage(e, setShowImage)
    handleImageChange(e, setImage, setShowImageError, di)
  }

  const [isBtnLoading, setIsBtnLoading] = useState(false)

  const handleCreateBook = async () => {
    if (!title.trim()) {
      twarn('title is required', setIsToastVisible)
      return
    }

    if (title.trim().length <= 5) {
      twarn(`'${title}' must be 6 characters at least`)
      return
    }

    if (title.trim().length > 20) {
      twarn(`'${title}' must be less than 20 characters long`)
      return
    }

    setIsBtnLoading(true)
    try {
      const bookData = new FormData()
      bookData.append('title', title)
      bookData.append('description', description)
      bookData.append('bookImg', image)

      const res = await createBook(bookData).unwrap()
      dispatch(
        setToast({
          displayToast: true,
          message: res?.message,
        })
      )
      navigate('/profile')
    } catch (error) {
      console.log(error)
      setIsBtnLoading(false)
    }
  }

  const handleUpdateBook = async () => {
    if (!title.trim()) {
      twarn('title is required', setIsToastVisible)
      return
    }

    if (title.trim().length <= 5) {
      twarn(`'${title}' must be 6 characters at least`)
      return
    }

    if (title.trim().length > 20) {
      twarn(`'${title}' must be less than 20 characters long`)
      return
    }

    setIsBtnLoading(true)
    try {
      const bookData = new FormData()
      bookData.append('title', title)
      bookData.append('description', description)
      bookData.append('bookImg', image)

      const res = await updateBook({ bookData, id: book?.id }).unwrap()
      dispatch(
        setToast({
          displayToast: true,
          message: res?.message,
        })
      )

      navigate('/profile')
    } catch (error) {
      console.log(error)
      setIsBtnLoading(false)
    }
  }

  // ----- on refresh
  const handleBeforeUnload = e => {
    e.preventDefault()
    e.returnValue = ''
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <>
      <ThemeProvider theme={borderTheme}>
        <div className="flex flex-col items-center w-full gap-14 xl:gap-20 h-full p-5 bg-background relative rounded-lg max-md:gap-2 ">
          <h2 className="text-3xl text-center max-md:text-2xl">
            {location.state?.history ? 'Edit your' : 'Create a'} Recipe Book!
          </h2>
          <div className="flex gap-14 items-center max-md:flex-col max-md:gap-1">
            <form className="flex flex-col gap-8 max-md:gap-2">
              <FormControl className="flex flex-col gap-1 sm:w-[40ch] max-sm:w-[26ch]">
                <div className="flex items-center gap-2 p-1">
                  <img src={chefHat} className="svg" alt="chef hat svg" />
                  <label htmlFor="title" className="text-primary-50">
                    Title
                  </label>
                </div>
                <TextField
                  id="title"
                  required
                  value={title}
                  placeholder="Title"
                  onChange={e => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl className="flex flex-col gap-1 sm:w-[40ch] max-sm:w-[26ch]">
                <div className="flex items-center gap-2">
                  <img
                    src={descriptionSvg}
                    className="svg"
                    alt="notes svg"
                    style={{ color: '#898784' }}
                  />
                  <label htmlFor="description" className="text-primary-50">
                    Description
                  </label>
                </div>
                <TextField
                  id="description"
                  required
                  value={description}
                  multiline
                  rows={5}
                  placeholder="Description"
                  onChange={e => setDescription(e.target.value)}
                />
              </FormControl>
            </form>

            <div className="flex flex-col items-center gap-5">
              {showImage && (
                <img
                  src={showImage}
                  alt="bookImg"
                  className="w-[220px] h-[220px] object-cover max-md:h-[150px]"
                />
              )}
              {showImageError && <p>{showImageError}</p>}

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
                  onChange={handleImage}
                  hidden
                />
              </Button>
              <Button
                sx={{ color: 'red', marginTop: '-10px' }}
                onClick={() => {
                  setImage(di)
                  setShowImage(di)
                }}
              >
                Reset Image
              </Button>
              <div className="flex gap-10 max-sm:gap-3">
                <Link to="/home">
                  <Button
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
                    Cancel
                  </Button>
                </Link>
                <Button
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
                  disabled={isToastVisible || isBtnLoading ? true : false}
                  onClick={
                    location.state?.history
                      ? handleUpdateBook
                      : handleCreateBook
                  }
                >
                  {isBtnLoading ? (
                    <ClipLoader size={25} />
                  ) : location.state?.book ? (
                    'Save Changes'
                  ) : (
                    'CREATE'
                  )}
                </Button>
              </div>
            </div>
            <p className="text-2xl max-xl:hidden absolute top-0 left-0 bg-primary text-white py-6 px-12 radius-right">
              Recipe Book
            </p>
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}

export default CreateBookForm
