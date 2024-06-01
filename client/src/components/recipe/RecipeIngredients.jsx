import { useState } from 'react'
//prettier-ignore
import { TextField, Button, MenuItem, FormControl, Select, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IngredientIcon from '../../assets/IngredientIcon.svg'
import addIcon from '../../assets/addIcon.svg'
import {
  useGetAllIngredientsQuery,
  useGetEnumsQuery,
} from '../../redux/slices/recipeApiSlice'
import RecipeIngredient from './RecipeIngredient'
import Ingredient from './Ingredient'
import SaveAsPendingModal from '../Modals/SaveAsPendingModal'
import { twarn } from '../../utils/toasts'

const RecipeIngredients = ({
  handleBack,
  handleNext,
  ingredientsData,
  setIngredientsData,
  onPostPending,
  onUpdatePending,
  isBtnLoading,
  location,
}) => {
  const [ingredient, setIngredient] = useState({
    quantity: '',
    measurementUnit: '',
    name: '',
  })
  const [ingredientFocus, setIngredientFocus] = useState(false)
  const [isNextToastVisible, setIsNextToastVisible] = useState(false)
  const [isAddToastVisible, setIsAddToastVisible] = useState(false)
  const [openSave, setOpenSave] = useState(false)

  const canAddIngredient = [
    ingredient.quantity,
    ingredient.measurementUnit,
    ingredient.name,
  ].every(Boolean)

  const { data: enums, isSuccess: isUnitsSuccess } =
    useGetEnumsQuery('recipeEnums')
  const { measurementUnit: measurementUnitEnums } = enums || {}

  const { data: ingredients, isSuccess: isGetIngsSuccess } =
    useGetAllIngredientsQuery('ingredientsList')

  const { ids, entities } = ingredients || {}

  const filteredIngredients =
    isGetIngsSuccess && ingredient.name
      ? ids
          .map(ingredientId => entities[ingredientId])
          .filter(
            ing =>
              ing &&
              ing.name.toLowerCase().includes(ingredient.name.toLowerCase())
          )
          .slice(0, 5)
      : []

  const foundIngredient =
    isGetIngsSuccess &&
    ids.length &&
    ids
      .map(ingredientId => entities[ingredientId])
      .find(ing => ing.name === ingredient.name)

  const handleQuantityChange = e => {
    const quantity = +e.target.value //convert string to number
    if (quantity < 1 && !ingredient.quantity) {
      setIngredient({
        ...ingredient,
        quantity: '',
      })
      twarn('Do not use negative quantity numbers!')
      return
    }
    setIngredient({
      ...ingredient,
      quantity: e.target.value,
    })
  }

  const addIngredient = () => {
    if (!canAddIngredient) {
      twarn('Please fill out all the fields!', setIsAddToastVisible)
      return
    }

    if (ingredient.quantity <= 0) {
      twarn('Do not use negative quantity numbers!', setIsAddToastVisible)
      return
    }

    const qregex = /^[0-9]+(\.[0-9]+)?(\/[0-9]+(\.[0-9]+)?)?$/
    if (!qregex.test(ingredient.quantity.trim())) {
      twarn('Please only use numbers!', setIsAddToastVisible)
      return
    }
    if (
      !(
        isGetIngsSuccess &&
        ids.length &&
        ids
          .map(ingredientId => entities[ingredientId])
          .find(ing => ing.name.toLowerCase() === ingredient.name.toLowerCase())
      )
    ) {
      twarn(
        `Ingredient '${ingredient.name}' was not found!`,
        setIsAddToastVisible
      )
      return
    }

    if (ingredient.quantity && ingredient.measurementUnit && ingredient.name) {
      setIngredientsData(prevData => [...prevData, ingredient])

      setIngredient({
        quantity: '',
        measurementUnit: '',
        name: '',
      })
    }
  }

  function deleteIngredient(deletedIndex) {
    const updatedIngredients = ingredientsData.filter(
      (_, index) => index !== deletedIndex
    )

    setIngredientsData(updatedIngredients)
  }

  const onNextStep = () => {
    if (ingredientsData.length < 2) {
      twarn('Need at least 2 ingredients!', setIsNextToastVisible)
      return
    }
    handleNext()
  }

  return (
    <div className="flex items-center h-full w-full">
      <div className="flex flex-col items-center gap-8 p-5 h-[93%] w-full relative rounded-lg max-sm:gap-2">
        <h2 className="text-3xl text-center p-6">
          {location.state?.history ? 'Edit Your' : 'Create a'} Recipe!
        </h2>
        <form className="grid grid-cols-3 place-content-center max-xl:grid-cols-1 max-xl:gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="quantity" className="text-primary-50">
              Quantity
            </label>
            <input
              type="text"
              pattern="^[0-9]+(\.[0-9]+)?(\/[0-9]+(\.[0-9]+)?)?$"
              id="quantity"
              value={ingredient.quantity}
              onChange={handleQuantityChange}
              placeholder="Quantity"
              required
              className="h-[55px] rounded-md p-[10px] border-[1px] border-gray-400 bg-background w-[20ch] outline-black max-xl:w-full"
            />
          </div>
          <FormControl className="flex flex-col gap-1">
            <label htmlFor="ing-unit" className="text-primary-50">
              Measurement Unit
            </label>
            <Select
              id="ing-unit"
              value={ingredient.measurementUnit}
              required
              onChange={e =>
                setIngredient({
                  ...ingredient,
                  measurementUnit: e.target.value,
                })
              }
              sx={{
                borderRadius: '10px',
                width: '250px',
                '@media (max-width: 1279px)': {
                  width: '100%',
                },
              }}
            >
              {isUnitsSuccess &&
                measurementUnitEnums.map(enumValue => (
                  <MenuItem key={enumValue} value={enumValue}>
                    {enumValue}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <div className="relative">
            <FormControl className="flexrelative flex-col items-start justify-center gap-1 max-md:w-[26ch]">
              <div className="flex items-center gap-1">
                <img src={IngredientIcon} className="svg" alt="" />
                <label htmlFor="ingredient" className="text-primary-50">
                  Ingredient
                </label>
              </div>
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="flex gap-2 items-center relative">
                  <TextField
                    id="ingredient"
                    required
                    fullWidth
                    value={ingredient.name}
                    placeholder="Ingredient Name"
                    onChange={e =>
                      setIngredient({
                        ...ingredient,
                        name: e.target.value,
                      })
                    }
                    onFocus={() => setIngredientFocus(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setIngredientFocus(false)
                      }, 500)
                    }}
                  />
                  <img
                    src={addIcon}
                    alt="add icon"
                    className={`size-8 ${
                      isAddToastVisible ? 'pointer-events-none' : ''
                    } max-md:hidden`}
                    onClick={addIngredient}
                  />
                  <IconButton
                    className="relative max-md:right-12 md:right-20"
                    onClick={() => setIngredient({ ...ingredient, name: '' })}
                  >
                    <CloseIcon
                      sx={{
                        color: 'gray',
                        fontSize: 12,
                      }}
                    />
                  </IconButton>
                </div>
                <Button
                  sx={{
                    background: '#333329',
                    textTransform: 'none',
                    color: '#fff',
                    padding: '15px 35px',
                    borderRadius: '100px',
                    '&:hover': {
                      color: '#333329',
                      background: '#fff',
                    },
                    '@media (min-width: 768px)': {
                      display: 'none',
                    },
                  }}
                  onClick={addIngredient}
                >
                  Add
                </Button>
              </div>
            </FormControl>
            {filteredIngredients.length > 0 &&
              ingredientFocus &&
              !foundIngredient && (
                <div className="absolute w-11/12">
                  {filteredIngredients.map(ing => (
                    <Ingredient
                      key={ing.id}
                      ing={ing}
                      onSelectIngredient={selectedIngredient =>
                        setIngredient({
                          ...ingredient,
                          name: selectedIngredient,
                        })
                      }
                    />
                  ))}
                </div>
              )}
          </div>
        </form>
        <div
          className={`${
            ingredientsData.length >= 3
              ? 'overflow-y-auto modal-scroll-bar h-[220px]'
              : ''
          } w-3/4`}
        >
          {ingredientsData
            .slice()
            .reverse()
            .map((ingredient, index) => (
              <RecipeIngredient
                key={index}
                ingredient={ingredient}
                index={ingredientsData.length - 1 - index}
                deleteIngredient={deleteIngredient}
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
            disabled={isNextToastVisible ? true : false}
            onClick={onNextStep}
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
          Ingredients
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
        Ingredients
      </p>
    </div>
  )
}

export default RecipeIngredients
