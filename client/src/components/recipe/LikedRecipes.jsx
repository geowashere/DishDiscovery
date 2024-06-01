import { useGetLikedRecipesQuery } from '../../redux/slices/recipeApiSlice'
import LikedRecipe from './LikedRecipe'
import { Link } from 'react-router-dom'
import { ScaleLoader } from 'react-spinners'

const LikedRecipes = () => {
  const {
    data: likes,
    isLoading: isGetLikesLoading,
    isSuccess: isGetLikesSuccess,
    isError: isGetLikesError,
    error: getLikeserror,
  } = useGetLikedRecipesQuery('likesList', {
    refetchOnMountOrArgChange: true,
  })

  const { ids } = likes || {}

  const displayLikedRecipes =
    isGetLikesSuccess &&
    ids?.length &&
    ids.map(likedId => <LikedRecipe key={likedId} likedId={likedId} />)

  return (
    <>
      {isGetLikesLoading ? (
        <div className="flex justify-center">
          <ScaleLoader size={20} color="#898784" />
        </div>
      ) : ids?.length !== 0 ? (
        <div className="grid lg:grid-cols-3 mx-auto min-[1660px]:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 gap-10 relative max-sm:overflow-y-auto">
          {displayLikedRecipes}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-2xl text-primary">
            You currently have no liked recipes.
          </p>
          <Link
            to="/home"
            className="text-primary-50 hover:text-primary transition-[color] delay-100"
          >
            Browse
          </Link>
        </div>
      )}
    </>
  )
}

export default LikedRecipes
