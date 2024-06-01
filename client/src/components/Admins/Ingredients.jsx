import Ingredient from './Ingredient'
import { useGetAllIngredientsQuery } from '../../redux/slices/recipeApiSlice'
import { ScaleLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setIsIngredientExists } from '../../redux/slices/isIngredientNewSlice'
import { useEffect } from 'react'

const Ingredients = ({ ingredient, windowWidth }) => {
  const {
    data: ingredients,
    isLoading,
    isSuccess,
  } = useGetAllIngredientsQuery('ingredientsList', {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  const dispatch = useDispatch()

  const { ids: ingredientsListIds, entities } = ingredients || {}

  const displayIngredients =
    isSuccess &&
    ingredientsListIds?.length &&
    ingredientsListIds.map(ingredientId => (
      <Ingredient
        key={ingredientId}
        ingredientId={ingredientId}
        ingredientsListIds={ingredientsListIds}
        entities={entities}
        windowWidth={windowWidth}
      />
    ))

  const isIngredientExist =
    isSuccess &&
    ingredientsListIds.length &&
    ingredientsListIds
      .map(ingredientId => entities[ingredientId])
      .find(ing => ing.name.trim() === ingredient.trim())

  useEffect(() => {
    ingredient && dispatch(setIsIngredientExists(!!isIngredientExist))
  }, [ingredient])

  if (isLoading)
    return (
      <div className="text-center">
        <ScaleLoader size={20} color="#898784" />
      </div>
    )
  if (!isSuccess)
    return <h1 className="text-2xl text-center">Something went wrong</h1>

  return (
    <div>
      {ingredientsListIds.length !== 0 ? (
        <div className="space-y-5">{displayIngredients}</div>
      ) : (
        <h1 className="text-center text-2xl text-primary">
          You don't have any ingredient at the moment.
        </h1>
      )}
    </div>
  )
}

export default Ingredients
