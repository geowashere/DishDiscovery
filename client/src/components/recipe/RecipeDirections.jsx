import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import StepIcon from '../../assets/StepIcon.svg'
import addIcon from '../../assets/addIcon.svg'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RecipeDirection from './RecipeDirection'
import SaveAsPendingModal from '../Modals/SaveAsPendingModal'
import { twarn } from '../../utils/toasts'

const RecipeDirections = ({
  handleBack,
  handleNext,
  directionsData,
  setDirectionsData,
  setOpenCaption,
  onPostPending,
  onUpdatePending,
  isBtnLoading,
  location,
}) => {
  const [direction, setDirection] = useState('')
  const [isToastVisible, setIsToastVisible] = useState(false)
  const [openSave, setOpenSave] = useState(false)

  const addDirection = () => {
    if (direction) {
      setDirectionsData(prevData => [...prevData, direction])
      setDirection('')
    }
  }

  const deleteDirection = deletedIndex => {
    const updatedDirections = directionsData.filter(
      (_, index) => index !== deletedIndex
    )

    setDirectionsData(updatedDirections)
  }

  const handleNextStep = () => {
    if (directionsData.length < 3) {
      twarn('Need at least 3 directions!', setIsToastVisible)
      return
    }

    handleNext()
    setOpenCaption(true)
  }

  return (
    <div className="flex items-center w-full h-full">
      <form className="flex flex-col items-center w-full h-[93%] gap-5 p-5 relative rounded-lg">
        <h2 className="text-3xl text-center p-6">
          {location.state?.history ? 'Edit Your' : 'Create a'} Recipe!
        </h2>
        <FormControl className="flex flex-col w-3/4 gap-1 ]">
          <div className="flex items-center gap-2">
            <img src={StepIcon} className="size-7" alt="" />
            <label htmlFor="direction" className="text-primary-50">
              Step
            </label>
          </div>
          <div className="flex items-center gap-2 relative">
            <TextField
              id="direction"
              required
              fullWidth
              value={direction}
              placeholder="List your steps"
              onChange={e => setDirection(e.target.value)}
            />
            <img
              src={addIcon}
              alt="add icon"
              className="size-9"
              onClick={addDirection}
            />
            <IconButton
              className="relative right-20"
              onClick={() => setDirection('')}
            >
              <CloseIcon
                sx={{
                  color: 'gray',
                  fontSize: 12,
                }}
              />
            </IconButton>
          </div>
        </FormControl>
        <div
          className={`${
            directionsData.length >= 3 ? 'overflow-y-auto modal-scroll-bar' : ''
          } w-3/4 h-[280px]`}
        >
          {directionsData.map((direction, index) => (
            <RecipeDirection
              key={index}
              direction={direction}
              index={index}
              deleteDirection={deleteDirection}
            />
          ))}
        </div>
        <div className="flex gap-5 w-full p-10 justify-end max-sm:flex-col">
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
            onClick={handleBack}
          >
            Go Back
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
              '@media (min-width: 1280px)': {
                display: 'none',
              },
            }}
            onClick={() => setOpenSave(true)}
          >
            Save As Pending
          </Button>
        </div>
        <h1 className="text-2xl absolute top-0 left-0 bg-primary text-white py-6 px-12 radius-right max-xl:hidden">
          Directions
        </h1>
        {!location.state?.myRecipe && (
          <Button
            sx={{
              background: '#333329',
              position: 'absolute',
              top: 5,
              right: 5,
              textTransform: 'none',
              color: '#fff',
              padding: '15px 35px',
              '&:hover': {
                color: '#333329',
                background: '#fff',
              },
              '@media (max-width: 1279px)': {
                display: 'none',
              },
            }}
            onClick={() => setOpenSave(true)}
          >
            Save As Pending
          </Button>
        )}
      </form>
      {openSave && (
        <SaveAsPendingModal
          openSave={openSave}
          setOpenSave={setOpenSave}
          onPostPending={onPostPending}
          onUpdatePending={onUpdatePending}
          location={location}
          isBtnLoading={isBtnLoading}
        />
      )}
      <p className="text-2xl absolute top-0 right-0 bg-primary text-white py-6 px-12 radius-left xl:hidden max-xl:text-1xl max-xl:p-6">
        Directions
      </p>
    </div>
  )
}

export default RecipeDirections
