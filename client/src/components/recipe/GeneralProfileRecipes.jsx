import { useParams } from 'react-router-dom'
import { useGetRecipesByUserIdQuery } from '../../redux/slices/recipeApiSlice'
import GeneralProfileRecipe from './GeneralProfileRecipe'

const GeneralProfileRecipes = () => {
  const { id } = useParams()

  const { data: recipes, isLoading, isSuccess } = useGetRecipesByUserIdQuery(id)

  const { ids } = recipes || {}

  const displayRecipes =
    isSuccess &&
    ids?.length &&
    ids.map(recipeId => (
      <GeneralProfileRecipe
        key={recipeId}
        recipeId={recipeId}
      ></GeneralProfileRecipe>
    ))

  const displayNoRecipes = recipes && (
    <p className="text-center text-2xl text-primary ">
      User currently has no recipes.
    </p>
  )

  return ids?.length ? (
    <div className="grid lg:grid-cols-3  mx-auto min-[1660px]:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 gap-10 relative max-sm:overflow-y-auto">
      {displayRecipes}
    </div>
  ) : (
    displayNoRecipes
  )
}

export default GeneralProfileRecipes
