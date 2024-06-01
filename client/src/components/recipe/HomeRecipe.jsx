import { useState, memo } from 'react'
import { IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import AddRecipeToBookModal from '../Modals/AddRecipeToBookModal'
import CommentModal from '../Modals/CommentModal'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AddIcon from '@mui/icons-material/Add'
import {
  useGetAllRecipesQuery,
  useLikeRecipeMutation,
  useUnlikeRecipeMutation,
  useDeleteRecipeMutation,
} from '../../redux/slices/recipeApiSlice'
import { useSelector } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete'
import { terror, tsuccess } from '../../utils/toasts'
import ConfirmationModal from '../Modals/ConfirmationModal'

const HomeRecipe = ({ recipeId }) => {
  const { recipe } = useGetAllRecipesQuery('recipesList', {
    selectFromResult: ({ data }) => ({
      recipe: data?.entities[recipeId],
    }),
  })
  const { role } = useSelector(state => state.auth.user)
  const [openComment, setOpenComment] = useState(false)

  const [likeRecipe] = useLikeRecipeMutation()
  const [unlikeRecipe] = useUnlikeRecipeMutation()
  const [deleteRecipe] = useDeleteRecipeMutation()
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openAddRecipeToBook, setOpenAddRecipeToBook] = useState(false)
  const confirmationMessage = 'Delete your recipe'

  const handleLikeRecipe = async () => {
    try {
      await likeRecipe(recipeId)
    } catch (error) {
      console.error(error)
    }
  }
  const handleUnlikeRecipe = async () => {
    try {
      await unlikeRecipe(recipeId)
    } catch (error) {
      console.error(error)
    }
  }

  const handleConfirm = async () => {
    let res
    try {
      res = await deleteRecipe(recipeId).unwrap()
    } catch (error) {
      console.log(error)
      terror('Something went wrong')
    }
    tsuccess(res?.message)
  }

  const handleOpenModal = () => {
    setOpenConfirm(true)
  }

  if (recipe) {
    return (
      <>
        <div className="flex flex-col gap-2 max-md:mx-auto max-sm:w-full">
          <Link to={`/recipe/${recipeId}`}>
            <div className="flex justify-between gap-3">
              <p className="text-primary text-xl break-all">{recipe?.title}</p>
              <p className="text-primary-50 text-xl text-center">
                by: {recipe?.user}
              </p>
            </div>
            {/* // not all recipes have images rn */}
            <img
              src={recipe?.image}
              className=" h-[220px] w-full object-cover max-sm:mx-auto"
              loading="lazy"
            />
            <p className="text-primary-50 text-xl w-full text-center truncate">
              {recipe?.caption}
            </p>
          </Link>
          <div className="flex justify-between">
            <IconButton onClick={() => setOpenComment(true)}>
              <ChatBubbleOutlineIcon /> {recipe?.nbOfComments}
            </IconButton>

            <div>
              {recipe.isLikedByUser ? (
                <IconButton onClick={handleUnlikeRecipe}>
                  <FavoriteIcon /> {recipe?.nbOfLikes}
                </IconButton>
              ) : (
                <IconButton onClick={handleLikeRecipe}>
                  <FavoriteBorderIcon /> {recipe?.nbOfLikes}
                </IconButton>
              )}
              {role === 'admin' && (
                <IconButton onClick={handleOpenModal}>
                  <DeleteIcon
                    sx={{
                      fontSize: 25,
                      color: '#898784',
                      ':hover': {
                        color: 'red',
                        cursor: 'pointer',
                        transition: 'color .5s',
                      },
                    }}
                  />
                </IconButton>
              )}
            </div>
            <IconButton onClick={() => setOpenAddRecipeToBook(true)}>
              <AddIcon />
            </IconButton>
          </div>
        </div>
        {openAddRecipeToBook && (
          <AddRecipeToBookModal
            openAddRecipeToBook={openAddRecipeToBook}
            setOpenAddRecipeToBook={setOpenAddRecipeToBook}
            recipeId={recipeId}
          />
        )}
        {openComment && (
          <CommentModal
            openComment={openComment}
            setOpenComment={setOpenComment}
            recipeId={recipeId}
          />
        )}
        {openConfirm && (
          <ConfirmationModal
            openConfirm={openConfirm}
            setOpenConfirm={setOpenConfirm}
            confirmationMessage={confirmationMessage}
            confirm={handleConfirm}
          />
        )}
      </>
    )
  }
}

const memoizedHomeRecipe = memo(HomeRecipe)

export default memoizedHomeRecipe
