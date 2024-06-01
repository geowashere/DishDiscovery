//prettier-ignore
import { FormGroup, FormControl, FormControlLabel, Checkbox, Button, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import CookingTimeIcon from '../../assets/CookingTimeIcon.svg'
import CultureIcon from '../../assets/CultureIcon.svg'
import DifficultyIcon from '../../assets/DifficultyIcon.svg'
import ServingsIcon from '../../assets/ServingsIcon.svg'
import StatusIcon from '../../assets/StatusIcon.svg'
import TypeIcon from '../../assets/TypeIcon.svg'
import { useGetEnumsQuery } from '../../redux/slices/recipeApiSlice'
import { twarn } from '../../utils/toasts'
import SaveAsPendingModal from '../Modals/SaveAsPendingModal'

const RecipeDetails = ({
  handleBack,
  handleNext,
  type,
  setType,
  cookingTime,
  setCookingTime,
  culture,
  setCulture,
  difficulty,
  setDifficulty,
  servings,
  setServings,
  status,
  setStatus,
  onPostPending,
  onUpdatePending,
  isBtnLoading,
  location,
}) => {
  const { data: enums, isSuccess } = useGetEnumsQuery('recipeEnums')
  const {
    type: typeEnums,
    cookingTime: cookingTimeEnums,
    difficulty: difficultyEnums,
    culture: cultureEnums,
    servings: servingsEnums,
  } = enums || {}

  const [isToastVisible, setIsToastVisible] = useState(false)
  const [openSave, setOpenSave] = useState(false)

  const handleNextStep = () => {
    if (!type || !cookingTime || !difficulty || !culture || !servings) {
      twarn(
        'Type, cookingTime, difficulty, culture and servings fields are required!',
        setIsToastVisible
      )
      return
    }
    handleNext()
  }

  if (isSuccess) {
    return (
      <div className="flex items-center w-full h-full">
        <div className="flex flex-col items-center gap-10 p-5 h-3/4 w-full relative rounded-lg max-sm:gap-2 ">
          <h2 className="text-3xl text-center ">
            {location.state?.history ? 'Edit Your' : 'Create a'} Recipe!
          </h2>
          <div className="grid grid-cols-3 gap-10 max-md:grid-cols-2 max-md:gap-2 max-mobile:grid-cols-1">
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <div className="flex items-center gap-2 pb-1">
                <img src={TypeIcon} className="svg" alt="type svg" />
                <label htmlFor="type" className="text-primary-50">
                  Type
                </label>
              </div>
              <Select
                id="recipe-type"
                value={type}
                label=""
                onChange={e => setType(e.target.value)}
                required
                sx={{ borderRadius: '10px' }}
              >
                {typeEnums.map(enumValue => (
                  <MenuItem key={enumValue} value={enumValue}>
                    {enumValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <div className="flex items-center gap-2 pb-1">
                <img src={DifficultyIcon} className="svg" alt="" />
                <label htmlFor="difficulty" className="text-primary-50">
                  Difficulty
                </label>
              </div>
              <Select
                id="recipe-diff"
                value={difficulty}
                label=""
                required
                onChange={e => setDifficulty(e.target.value)}
                sx={{ borderRadius: '10px' }}
              >
                {difficultyEnums.map(enumValue => (
                  <MenuItem key={enumValue} value={enumValue}>
                    {enumValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <div className="flex items-center gap-2 pb-1">
                <img src={CookingTimeIcon} className="svg" alt="" />
                <label htmlFor="recipe-time" className="text-primary-50">
                  Cooking Time
                </label>
              </div>
              <Select
                id="recipe-time"
                value={cookingTime}
                label=""
                onChange={e => setCookingTime(e.target.value)}
                sx={{ borderRadius: '10px' }}
              >
                {cookingTimeEnums.map(enumValue => (
                  <MenuItem key={enumValue} value={enumValue}>
                    {enumValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div>
              <FormControl sx={{ m: 1, minWidth: 150 }}>
                <div className="flex items-center gap-2 pb-1">
                  <img src={CultureIcon} className="svg" alt="" />
                  <label htmlFor="culture" className="text-primary-50">
                    Culture
                  </label>
                </div>
                <Select
                  id="recipe-culture"
                  value={culture}
                  label=""
                  required
                  onChange={e => setCulture(e.target.value)}
                  sx={{ borderRadius: '10px' }}
                >
                  {cultureEnums.map(enumValue => (
                    <MenuItem key={enumValue} value={enumValue}>
                      {enumValue}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl sx={{ m: 1, minWidth: 150 }}>
                <div className="flex items-center gap-2 pb-1">
                  <img src={ServingsIcon} className="svg" alt="" />
                  <label htmlFor="servings" className="text-primary-50">
                    Servings
                  </label>
                </div>
                <Select
                  id="recipe-servings"
                  value={servings}
                  label=""
                  onChange={e => setServings(e.target.value)}
                  sx={{ borderRadius: '10px' }}
                >
                  {servingsEnums.map(enumValue => (
                    <MenuItem key={enumValue} value={enumValue}>
                      {enumValue}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col p-2">
              <div className="flex items-center gap-2 pb-1">
                <img src={StatusIcon} className="svg" alt="" />
                <label htmlFor="status" className="text-primary-50">
                  Status
                </label>
              </div>
              <FormGroup sx={{ padding: '6px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="status"
                      checked={status}
                      onChange={e => setStatus(e.target.checked)}
                      sx={{
                        '&.Mui-checked': {
                          color: '#333329',
                        },
                      }}
                    />
                  }
                  label="Private"
                />
              </FormGroup>
            </div>
          </div>
          <div className="flex gap-5 w-full justify-end p-10 max-sm:flex-col">
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
          <p className="text-2xl absolute top-0 left-0 bg-primary text-white py-6 px-12 radius-right max-xl:hidden">
            Recipe Details
          </p>
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
        </div>
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
          Recipe Details
        </p>
      </div>
    )
  }
}

export default RecipeDetails
