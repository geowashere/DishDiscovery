import { TextField, Button, FormControl } from '@mui/material'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import defaultRecipe from '../../assets/defaultRecipe.jpg'
import chefHat from '../../assets/chefhat.svg'
import descriptionSvg from '../../assets/description.svg'
import { Link } from 'react-router-dom'
import { twarn } from '../../utils/toasts'
import { useGetTitlesQuery } from '../../redux/slices/recipeApiSlice'
import { useState } from 'react'

const RecipeBasics = ({
  handleNext,
  title,
  setTitle,
  description,
  setDescription,
  handleImage,
  setImage,
  showImage,
  setShowImage,
  showImageError,
  location,
}) => {
  const { data: titles, isSuccess } = useGetTitlesQuery('titlesList', {
    refetchOnMountOrArgChange: true,
  })

  const [isToastVisible, setIsToastVisible] = useState(false)

  const handleNextStep = () => {
    if (!title.trim()) {
      twarn('title is required', setIsToastVisible)
      return
    }

    if (title.trim().length > 20) {
      twarn(`'${title}' must be less than 20 characters long`)
      return
    }

    if (location.state?.myRecipe && title === location.state?.myRecipe.title) {
      handleNext()
      return
    }
    if (
      titles.find(t => t.toLowerCase().trim() === title.toLowerCase().trim())
    ) {
      twarn(`'${title}' is already taken, choose another one`)
      return
    }
    if (title.trim().length <= 5) {
      twarn(`'${title}' must be 6 characters at least`)
      return
    }

    handleNext()
  }

  if (isSuccess) {
    return (
      <div className="flex w-full h-full items-center">
        <div className="flex flex-col items-center  h-3/4 gap-5 xl:gap-20 p-5 w-full  relative  max-md:h-full">
          <h2 className="text-3xl text-center max-md:text-2xl pt-14">
            {location.state?.myRecipe ? 'Edit Your' : 'Create a'} Recipe!
          </h2>
          <form className="grid grid-cols-2 w-3/4 max-md:grid-cols-1 max-md:place-items-center max-md:gap-4">
            <div className="flex flex-col justify-evenly">
              <FormControl className="flex flex-col gap-1 max-sm:w-[26ch]">
                <div className="flex items-center gap-2 p-1">
                  <img src={chefHat} className="svg" alt="chefHat svg" />
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
              <FormControl className="flex flex-col gap-1 max-sm:w-[26ch]">
                <div className="flex items-center gap-2 p-1">
                  <img
                    src={descriptionSvg}
                    className="svg text-primary-50"
                    alt="description svg"
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
            </div>

            <div className="flex flex-col items-center gap-5">
              {showImage && (
                <img
                  src={showImage}
                  alt="rcpImg"
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
                  setShowImage(defaultRecipe)
                  setImage(defaultRecipe)
                }}
              >
                Reset Image
              </Button>
              <div className="flex gap-5">
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
                  <Link to="/home">Cancel</Link>
                </Button>
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
                  disabled={isToastVisible ? true : false}
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              </div>
            </div>
          </form>
          <h1 className="text-2xl absolute top-0 left-0 bg-primary text-white py-6 px-12 radius-right max-xl:hidden">
            Recipe Basics
          </h1>
        </div>
        <h1 className="text-2xl absolute top-0 right-0 bg-primary text-white py-6 px-12 radius-left xl:hidden max-xl:text-1xl max-xl:p-6">
          Recipe Basics
        </h1>
      </div>
    )
  }
}

export default RecipeBasics
