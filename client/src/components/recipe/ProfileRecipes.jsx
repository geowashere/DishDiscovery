import ProfileRecipe from './ProfileRecipe'
import {
  useGetPendingRecipesQuery,
  useGetRecipesQuery,
} from '../../redux/slices/recipeApiSlice'
import PendingRecipe from './PendingRecipe'
import { Link } from 'react-router-dom'
import { ScaleLoader } from 'react-spinners'

const ProfileRecipes = ({ postsFilter }) => {
  const {
    data: myRecipes,
    isLoading: isGetMyRecipesLoading,
    isSuccess: isGetMyRecipesSuccess,
  } = useGetRecipesQuery('myRecipesList', {
    refetchOnMountOrArgChange: true,
  })
  const { ids, entities } = myRecipes || {}

  const displayMyRecipes =
    isGetMyRecipesSuccess &&
    ids?.length &&
    ids.map(myRecipeId => (
      <ProfileRecipe
        key={myRecipeId}
        myRecipeId={myRecipeId}
        postsFilter={postsFilter}
      />
    ))
  const privateEntities =
    entities &&
    Object.values(entities).filter(entity => entity.status === 'private')
  const publicEntities =
    entities &&
    Object.values(entities).filter(entity => entity.status === 'public')

  const {
    data: pendingRecipes,
    isLoading: isGetPendingRecipesLoading,
    isSuccess: isGetPendingRecipesSuccess,
  } = useGetPendingRecipesQuery('pendingRecipesList', {
    refetchOnMountOrArgChange: true,
  })

  const { ids: pendingIds } = pendingRecipes || {}

  const displayPendingRecipes =
    isGetPendingRecipesSuccess &&
    pendingIds?.length &&
    pendingIds.map(pendingRecipeId => (
      <PendingRecipe key={pendingRecipeId} pendingRecipeId={pendingRecipeId} />
    ))

  const displayNoRecipes = myRecipes && (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-2xl text-primary">
        You currently have no {postsFilter !== 'all' && postsFilter} recipes.
      </p>
      <Link
        to="/create-recipe"
        className="text-primary-50 hover:text-primary transition-[color] delay-100"
      >
        Create Recipe
      </Link>
    </div>
  )

  if (postsFilter === 'pending') {
    return (
      <>
        {isGetPendingRecipesLoading ? (
          <div className="flex justify-center">
            <ScaleLoader size={20} color="#898784" />
          </div>
        ) : pendingIds?.length ? (
          <div className="grid lg:grid-cols-3 mx-auto min-[1660px]:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 gap-10 relative max-sm:overflow-y-auto">
            {displayPendingRecipes}
          </div>
        ) : (
          displayNoRecipes
        )}
      </>
    )
  } else {
    return (
      <>
        {isGetMyRecipesLoading ? (
          <div className="flex justify-center">
            <ScaleLoader size={20} color="#898784" />
          </div>
        ) : ids?.length ? (
          <div className="grid lg:grid-cols-3 mx-auto min-[1660px]:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 gap-10 relative max-sm:overflow-y-auto">
            {displayMyRecipes}
          </div>
        ) : (
          displayNoRecipes
        )}
        {ids?.length > 0 &&
          postsFilter === 'private' &&
          privateEntities?.length === 0 &&
          displayNoRecipes}
        {ids?.length > 0 &&
          postsFilter === 'public' &&
          publicEntities?.length === 0 &&
          displayNoRecipes}
      </>
    )
  }
}

export default ProfileRecipes
