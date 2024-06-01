import { useGetAllIngredientsQuery } from '../../redux/slices/recipeApiSlice'
import { ScaleLoader } from 'react-spinners'

const SearchIngredients = ({ searchValue }) => {
  const {
    data: ingredients,
    isLoading,
    isSuccess,
  } = useGetAllIngredientsQuery('ingredientsList')

  const { ids, entities } = ingredients || {}

  const displayIngredients =
    isSuccess &&
    ids.length &&
    ids
      .map(ingredientId => entities[ingredientId])
      .filter(ingredient => ingredient.name.includes(searchValue))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(ingredient => {
        return (
          <p key={ingredient._id} className="p-2 border-b text-primary-200">
            {ingredient.name}
          </p>
        )
      })

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <ScaleLoader size={20} />
        </div>
      ) : displayIngredients ? (
        displayIngredients
      ) : (
        'Ingredient not found'
      )}
    </>
  )
}

export default SearchIngredients
