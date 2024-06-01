import {
  useGetBookQuery,
  useRemoveRecipeFromBookMutation,
} from '../../redux/slices/bookApiSlice'
import { IconButton, Tooltip } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import { Link } from 'react-router-dom'
import { tsuccess, terror } from '../../utils/toasts'
import { useSelector } from 'react-redux'

const BookRecipe = ({ recipeId, bookId, bookUser }) => {
  const { recipe } = useGetBookQuery(bookId, {
    selectFromResult: ({ data }) => ({
      recipe: data?.bookRecipes?.entities[recipeId],
    }),
  })

  const userId = useSelector(state => state.auth.user._id)

  const [removeRecipeFromBook] = useRemoveRecipeFromBookMutation()

  const handleRemoveRecipeFromBook = async () => {
    try {
      await removeRecipeFromBook({ bookId, recipeId })
    } catch (error) {
      terror(error?.message)
      console.error(error)
    }
    tsuccess('Recipe removed from book!')
  }

  const displayRecipe = recipe && (
    <div className="flex flex-col">
      <Link to={`/recipe/${recipeId}`}>
        <img
          src={recipe?.image}
          alt="recipe img"
          className="w-96 h-80 object-cover max-sm:w-full max-sm:block"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-col gap-2">
        <h3 className="text-primary-50">
          Created by <span>{recipe.username}</span>
        </h3>
        <div className="flex justify-between items-center">
          <h1 className="text-1xl text-primary">{recipe.title}</h1>
          {bookUser === userId && (
            <Tooltip title="Remove from book">
              <IconButton onClick={handleRemoveRecipeFromBook}>
                <RemoveIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
  if (recipe) {
    if (userId === bookUser) return displayRecipe
    else return recipe.status === 'public' && displayRecipe
  }
}

export default BookRecipe
