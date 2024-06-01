import { IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { memo, useState } from 'react'
import {
  useGetLikedRecipesQuery,
  useRemoveLikedRecipeMutation,
} from '../../redux/slices/recipeApiSlice'
import { tsuccess } from '../../utils/toasts'
import ConfirmationModal from '../Modals/ConfirmationModal'

const LikedRecipe = ({ likedId }) => {
  const { likedRecipe } = useGetLikedRecipesQuery('likesList', {
    selectFromResult: ({ data }) => ({
      likedRecipe: data?.entities[likedId],
    }),
  })

  const [removeLikedRecipe] = useRemoveLikedRecipeMutation()
  const [openConfirm, setOpenConfirm] = useState(false)
  const confirmationMessage = 'Unlike recipe'

  const handleUnlike = async () => {
    let res
    try {
      res = await removeLikedRecipe(likedId).unwrap()
      console.log(res)
    } catch (error) {
      console.error(error)
    }
    tsuccess('Removed from liked!')
  }

  if (likedRecipe) {
    return (
      <>
        <div className="flex flex-col gap-2 w-fit mx-auto">
          <img
            src={likedRecipe.image}
            className="h-[220px] w-full"
            loading="lazy"
          />
          <div className="flex justify-between ">
            <p className="text-primary text-xl">{likedRecipe.title}</p>
            <IconButton onClick={() => setOpenConfirm(true)}>
              <FavoriteIcon />
            </IconButton>
          </div>
        </div>
        {openConfirm && (
          <ConfirmationModal
            openConfirm={openConfirm}
            setOpenConfirm={setOpenConfirm}
            confirmationMessage={confirmationMessage}
            confirm={handleUnlike}
          />
        )}
      </>
    )
  } else return null
}

const memoizedBook = memo(LikedRecipe)

export default memoizedBook
