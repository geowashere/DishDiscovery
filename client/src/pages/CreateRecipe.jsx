import { useState, useEffect } from 'react'
import { MobileStepper } from '@mui/material'
import { handleShowImage, handleImageChange } from '../utils/imageHandling'
import defaultRecipe from '../assets/defaultRecipe.jpg'
import { borderTheme } from '../utils/borderTheme'
import { ThemeProvider } from '@mui/material'

//components
import RecipeBasics from '../components/recipe/RecipeBasics'
import RecipeDetails from '../components/recipe/RecipeDetails'
import RecipeIngredients from '../components/recipe/RecipeIngredients'
import RecipeDirections from '../components/recipe/RecipeDirections'
import CaptionModal from '../components/Modals/CaptionModal'

//slice
import {
  useCreatePendingRecipeMutation,
  useCreateRecipeMutation,
  useUpdatePendingRecipeMutation,
  useUpdateRecipeMutation,
} from '../redux/slices/recipeApiSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { setToast } from '../redux/slices/toastSlice'
import { useDispatch } from 'react-redux'

const CreateRecipe = () => {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ----- Location
  const location = useLocation()
  const recipe = location.state?.myRecipe || {}
  const pendingRecipe = location.state?.pendingRecipe || {}

  // ----- Basics
  const [title, setTitle] = useState(
    recipe?.title
      ? recipe?.title
      : pendingRecipe?.title
      ? pendingRecipe?.title
      : ''
  )
  const [description, setDescription] = useState(
    recipe?.description
      ? recipe?.description
      : pendingRecipe?.description
      ? pendingRecipe?.description
      : ''
  )
  const [image, setImage] = useState(
    recipe?.image
      ? recipe?.image
      : pendingRecipe?.image
      ? pendingRecipe?.image
      : defaultRecipe
  )
  const [showImage, setShowImage] = useState(
    recipe?.image
      ? recipe?.image
      : pendingRecipe?.image
      ? pendingRecipe?.image
      : defaultRecipe
  )
  const [showImageError, setShowImageError] = useState(null)

  const handleImage = e => {
    handleShowImage(e, setShowImage)
    handleImageChange(e, setImage, setShowImageError, defaultRecipe)
  }

  // ----- Details
  const [type, setType] = useState(
    recipe?.type ? recipe?.type : pendingRecipe?.type ? pendingRecipe?.type : ''
  )
  const [cookingTime, setCookingTime] = useState(
    recipe?.cookingTime
      ? recipe?.cookingTime
      : pendingRecipe?.cookingTime
      ? pendingRecipe?.cookingTime
      : ''
  )
  const [culture, setCulture] = useState(
    recipe?.culture
      ? recipe?.culture
      : pendingRecipe?.culture
      ? pendingRecipe?.culture
      : ''
  )
  const [difficulty, setDifficulty] = useState(
    recipe?.difficulty
      ? recipe?.difficulty
      : pendingRecipe?.difficulty
      ? pendingRecipe?.difficulty
      : ''
  )
  const [servings, setServings] = useState(
    recipe?.servings
      ? recipe?.servings
      : pendingRecipe?.servings
      ? pendingRecipe?.servings
      : ''
  )
  const [status, setStatus] = useState(
    recipe?.status === 'private' ? true : pendingRecipe?.status ? true : false //if pendingRecipe had a status it would be private
  )

  // ----- Ingredients
  const [ingredientsData, setIngredientsData] = useState(
    recipe?.ingredients
      ? recipe?.ingredients
      : pendingRecipe?.ingredients
      ? pendingRecipe?.ingredients.map(ing => JSON.parse(ing))
      : []
  )

  // ----- Directions
  const [directionsData, setDirectionsData] = useState(
    recipe?.directions
      ? recipe?.directions
      : pendingRecipe?.directions
      ? pendingRecipe?.directions
      : []
  )
  const [openCaption, setOpenCaption] = useState(false)

  // ----- Caption
  const [caption, setCaption] = useState(recipe?.caption ? recipe?.caption : '')

  // ----- Posting
  const [isBtnLoading, setIsBtnLoading] = useState(false)
  const [createRecipe] = useCreateRecipeMutation()

  const handlePostRecipe = async caption => {
    setIsBtnLoading(true)
    try {
      const rcpData = new FormData()
      rcpData.append('title', title)
      rcpData.append('description', description)
      rcpData.append('rcpImg', image)
      rcpData.append('type', type)
      rcpData.append('cookingTime', cookingTime)
      rcpData.append('culture', culture)
      rcpData.append('difficulty', difficulty)
      rcpData.append('servings', servings)
      rcpData.append('status', status ? 'private' : 'public')
      rcpData.append(
        'pendingRecipeId',
        pendingRecipe ? pendingRecipe._id : undefined
      )

      ingredientsData.forEach((object, index) => {
        rcpData.append(`ingredients`, JSON.stringify(object))
      })

      for (let i = 0; i < directionsData.length; i++) {
        rcpData.append('directions', directionsData[i])
      }
      rcpData.append('caption', caption)

      const res = await createRecipe(rcpData).unwrap()

      navigate('/profile')
      dispatch(
        setToast({
          displayToast: true,
          message: res?.message,
        })
      )
    } catch (error) {
      console.log(error)
      setIsBtnLoading(false)
    }
  }

  // ----- Updating
  const [updateRecipe] = useUpdateRecipeMutation()

  const handleUpdateRecipe = async (toUpdateRecipeId, caption) => {
    setIsBtnLoading(true)

    try {
      const rcpData = new FormData()
      rcpData.append('title', title)
      rcpData.append('description', description)
      rcpData.append('rcpImg', image)
      rcpData.append('type', type)
      rcpData.append('cookingTime', cookingTime)
      rcpData.append('culture', culture)
      rcpData.append('difficulty', difficulty)
      rcpData.append('servings', servings)
      rcpData.append('status', status ? 'private' : 'public')

      ingredientsData.forEach((object, index) => {
        rcpData.append(`ingredients`, JSON.stringify(object))
      })

      for (let i = 0; i < directionsData.length; i++) {
        rcpData.append('directions', directionsData[i])
      }
      rcpData.append('caption', caption)

      const res = await updateRecipe({
        recipeId: toUpdateRecipeId,
        recipeData: rcpData,
      }).unwrap()

      navigate('/profile')
      dispatch(
        setToast({
          displayToast: true,
          message: res?.message,
        })
      )
    } catch (error) {
      console.log(error)
      setIsBtnLoading(false)
    }
  }

  // ----- Pending post

  // ----- Posting
  const [createPendingRecipe] = useCreatePendingRecipeMutation()

  const handlePostPending = async () => {
    setIsBtnLoading(true)

    try {
      const rcpData = new FormData()
      rcpData.append('title', title)
      rcpData.append('description', description)
      rcpData.append('rcpImg', image)
      rcpData.append('type', type)
      rcpData.append('cookingTime', cookingTime)
      rcpData.append('culture', culture)
      rcpData.append('difficulty', difficulty)
      rcpData.append('servings', servings)
      rcpData.append('status', 'private')
      ingredientsData.forEach((object, index) => {
        rcpData.append(`ingredients`, JSON.stringify(object))
      })
      for (let i = 0; i < directionsData.length; i++) {
        rcpData.append('directions', directionsData[i])
      }

      const res = await createPendingRecipe(rcpData).unwrap()

      navigate('/profile')
      dispatch(
        setToast({
          displayToast: true,
          message: res?.message,
        })
      )
    } catch (error) {
      console.log(error)
      setIsBtnLoading(false)
    }
  }

  // ----- Updating
  const [updatePendingRecipe] = useUpdatePendingRecipeMutation()

  const handleUpdatePending = async toUpdatePendingId => {
    setIsBtnLoading(true)

    try {
      const rcpData = new FormData()
      rcpData.append('title', title)
      rcpData.append('description', description)
      rcpData.append('rcpImg', image)
      rcpData.append('type', type)
      rcpData.append('cookingTime', cookingTime)
      rcpData.append('culture', culture)
      rcpData.append('difficulty', difficulty)
      rcpData.append('servings', servings)
      rcpData.append('status', status ? 'private' : 'public')

      ingredientsData.forEach((object, index) => {
        rcpData.append(`ingredients`, JSON.stringify(object))
      })

      for (let i = 0; i < directionsData.length; i++) {
        rcpData.append('directions', directionsData[i])
      }

      const res = await updatePendingRecipe({
        recipeId: toUpdatePendingId,
        recipeData: rcpData,
      }).unwrap()
      navigate('/profile')
      dispatch(
        setToast({
          displayToast: true,
          message: res?.message,
        })
      )
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

  const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1)
  const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1)

  return (
    <ThemeProvider theme={borderTheme}>
      <div className="flex flex-col grow justify-center md:max-h-screen md:overflow-y-auto bg-background">
        <MobileStepper
          variant="progress"
          steps={5}
          position="static"
          activeStep={activeStep}
          sx={{
            justifyContent: 'center',
            bgcolor: '#FFFAF5',
            padding: '10px',
            '& .MuiMobileStepper-progress': {
              background: '#898784', //non-active color
              width: '90%',
            },
            '& .MuiLinearProgress-bar': {
              background: '#333329', // active color
            },
            '@media (max-width: 1279px)': {
              display: 'none',
            },
          }}
        />
        <div className="flex justify-start items-start max-md:h-full">
          {activeStep === 0 && (
            <RecipeBasics
              handleNext={handleNext}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              handleImage={handleImage}
              setImage={setImage}
              showImage={showImage}
              setShowImage={setShowImage}
              showImageError={showImageError}
              location={location}
            />
          )}
          {activeStep === 1 && (
            <RecipeDetails
              handleBack={handleBack}
              handleNext={handleNext}
              type={type}
              setType={setType}
              cookingTime={cookingTime}
              setCookingTime={setCookingTime}
              culture={culture}
              setCulture={setCulture}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              servings={servings}
              setServings={setServings}
              status={status}
              setStatus={setStatus}
              onPostPending={handlePostPending}
              onUpdatePending={handleUpdatePending}
              isBtnLoading={isBtnLoading}
              location={location}
            />
          )}
          {activeStep === 2 && (
            <RecipeIngredients
              handleBack={handleBack}
              handleNext={handleNext}
              ingredientsData={ingredientsData}
              setIngredientsData={setIngredientsData}
              onPostPending={handlePostPending}
              onUpdatePending={handleUpdatePending}
              isBtnLoading={isBtnLoading}
              location={location}
            />
          )}
          {(activeStep === 3 || activeStep === 4) && (
            <>
              <RecipeDirections
                handleBack={handleBack}
                handleNext={handleNext}
                directionsData={directionsData}
                setDirectionsData={setDirectionsData}
                setOpenCaption={setOpenCaption}
                onPostPending={handlePostPending}
                onUpdatePending={handleUpdatePending}
                isBtnLoading={isBtnLoading}
                location={location}
              />
              <CaptionModal
                handleBack={handleBack}
                openCaption={openCaption}
                setOpenCaption={setOpenCaption}
                caption={caption}
                setCaption={setCaption}
                status={status}
                onPostRecipe={handlePostRecipe}
                onUpdateRecipe={handleUpdateRecipe}
                location={location}
                isBtnLoading={isBtnLoading}
              />
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default CreateRecipe
