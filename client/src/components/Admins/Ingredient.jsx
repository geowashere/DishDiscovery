import {
  useGetAllIngredientsQuery,
  useUpdateIngredientMutation,
} from '../../redux/slices/recipeApiSlice'
import { TextField, Tooltip, ClickAwayListener } from '@mui/material'
import { useEffect, useState } from 'react'
import EditIconSvg from '../../assets/editIcon.svg'
import EditIconHoverSvg from '../../assets/editIconHover.svg'
import SaveChangesSvg from '../../assets/saveChanges.svg'
import SaveChangesHoverSvg from '../../assets/saveChangesHover.svg'
import ExitIconSvg from '../../assets/exitIcon.svg'
import { ClipLoader } from 'react-spinners'
import { terror, twarn } from '../../utils/toasts'
import { useDispatch, useSelector } from 'react-redux'
import { setIsIngredientExists } from '../../redux/slices/isIngredientNewSlice'

const Ingredient = ({
  ingredientId,
  ingredientsListIds,
  entities,
  windowWidth,
}) => {
  const [open, setOpen] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }
  const { ingredient } = useGetAllIngredientsQuery('ingredientsList', {
    selectFromResult: ({ data }) => ({
      ingredient: data?.entities[ingredientId],
    }),
  })

  const [value, setValue] = useState(
    windowWidth < 950
      ? ingredient.name.length > 14
        ? ingredient.name.substring(0, 14) + '...'
        : ingredient.name
      : ingredient.name
  )
  const [disabled, setDisabled] = useState(true)
  const [image, setImage] = useState(EditIconSvg)
  const [isLoading, setIsLoading] = useState(false)
  const [updateIngredient] = useUpdateIngredientMutation()
  const dispatch = useDispatch()
  const { exists } = useSelector(state => state.isIngredientExists)

  const handleEdit = () => {
    setDisabled(false)
    setImage(SaveChangesSvg)
  }

  const saveChanges = async () => {
    if (!value.trim()) {
      twarn('Please enter an ingredient')
      return
    }
    if (exists) {
      terror(`'${value}' already exists`)
      return
    }

    setValue(value.toLowerCase().trim())
    setIsLoading(true)
    setDisabled(true)

    try {
      await updateIngredient({
        ingredientId,
        updatedIngredient: value.toLowerCase().trim(),
      })
      setImage(EditIconSvg)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      terror('Something went wrong')
      setImage(EditIconSvg)
      setIsLoading(false)
    }
  }

  const isIngredientExist =
    ingredientsListIds.length &&
    ingredientsListIds
      .map(ingredientId => entities[ingredientId])
      .find(ing => ing.name.trim() === value.toLowerCase().trim())

  useEffect(() => {
    dispatch(setIsIngredientExists(!!isIngredientExist))
  }, [value])

  useEffect(() => {
    setValue(
      windowWidth < 950
        ? ingredient.name.length > 14
          ? ingredient.name.substring(0, 14) + '...'
          : ingredient.name
        : ingredient.name
    )
  }, [windowWidth])

  return (
    <div className="flex items-center relative pr-5">
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          title={`${ingredient.name}`}
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
        >
          <TextField
            fullWidth
            disabled={disabled}
            value={value}
            onChange={e => setValue(e.target.value)}
            InputProps={{
              style: {
                fontSize: '1.5rem',
                color: '#333329',
              },
            }}
            onMouseEnter={handleTooltipOpen}
          />
        </Tooltip>
      </ClickAwayListener>
      {isLoading ? (
        <ClipLoader className="absolute right-10" />
      ) : (
        <>
          <img
            src={image}
            className="lg:w-[1.5rem] lg:h-[1.5rem] lg:right-10 max-lg:h-[1.1rem] max-lg:w-[1.1rem] absolute max-lg:right-8"
            onMouseEnter={() =>
              disabled
                ? setImage(EditIconHoverSvg)
                : setImage(SaveChangesHoverSvg)
            }
            onMouseLeave={() =>
              disabled ? setImage(EditIconSvg) : setImage(SaveChangesSvg)
            }
            onClick={disabled ? handleEdit : saveChanges}
          />
          <img
            src={ExitIconSvg}
            className={`lg:w-[1.5rem] lg:h-[1.5rem] lg:right-20 max-lg:w-[1.1rem] max-lg:h-[1.1rem] absolute max-lg:right-14 ${
              image === EditIconHoverSvg || image === EditIconSvg
                ? 'hidden'
                : 'flex'
            }`}
            onClick={() => {
              setDisabled(true)
              setImage(EditIconSvg)
            }}
          />
        </>
      )}
    </div>
  )
}

export default Ingredient
