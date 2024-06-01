import HomeRecipe from '../components/recipe/HomeRecipe'
import { ScaleLoader } from 'react-spinners'
import { useGetAllRecipesQuery } from '../redux/slices/recipeApiSlice'

const Home = () => {
  const {
    data: recipes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllRecipesQuery('recipesList', {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  })

  if (isLoading)
    return (
      <div className="m-auto">
        <ScaleLoader size={20} color="#898784" />
      </div>
    )

  if (isSuccess) {
    const { ids } = recipes

    const displayAllRecipes =
      ids?.length &&
      ids.map(recipeId => <HomeRecipe key={recipeId} recipeId={recipeId} />)
    return (
      <div className="bg-background grow grid tv:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 max-md:grid-cols-1 px-9 py-5 gap-5 justify-evenly overflow-auto">
        {displayAllRecipes.length > 0
          ? displayAllRecipes
          : 'This feed is empty ):'}
      </div>
    )
  }
}

export default Home
