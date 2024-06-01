import { ScaleLoader } from 'react-spinners'
import { useGetAllRecipesQuery } from '../../redux/slices/recipeApiSlice'
import SearchRecipe from './SearchRecipe'

const SearchRecipes = ({ searchValue, setOpenSearch }) => {
  const {
    data: recipes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllRecipesQuery('recipesList')

  if (isError) return <p>{error}</p>

  const { ids, entities } = recipes || {}

  const displayAllRecipes =
    isSuccess &&
    ids?.length &&
    ids
      .filter(recipeId => {
        const recipe = entities[recipeId]
        return recipe.title.toLowerCase().includes(searchValue.toLowerCase())
      })
      .map(recipeId => (
        <SearchRecipe
          key={recipeId}
          recipeId={recipeId}
          setOpenSearch={setOpenSearch}
        />
      ))

  return (
    <>
      {searchValue === '' ? (
        'Search any recipe'
      ) : isLoading ? (
        <div className="flex justify-center">
          <ScaleLoader size={25} />
        </div>
      ) : displayAllRecipes.length ? (
        displayAllRecipes
      ) : (
        'No recipes with this title'
      )}
    </>
  )
}

export default SearchRecipes
