import { IconButton } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useDeleteReplyMutation,
  useGetCommentRepliesQuery,
  useLikeReplyMutation,
  useUnlikeReplyMutation,
} from '../../redux/slices/commentApiSlice'
import ConfirmationModal from '../Modals/ConfirmationModal'

const RecipeCommentReply = ({ replyId, commentId }) => {
  const { reply } = useGetCommentRepliesQuery(commentId, {
    selectFromResult: ({ data }) => ({
      reply: data?.entities[replyId],
    }),
  })
  const { role } = useSelector(state => state.auth.user)
  const [likeReply] = useLikeReplyMutation()
  const [unlikeReply] = useUnlikeReplyMutation()
  const [deleteReply] = useDeleteReplyMutation()

  const [openConfirm, setOpenConfirm] = useState(false)
  const confirmationMessage = 'Delete reply'

  const handleLikeReply = async () => {
    try {
      await likeReply({ commentId, replyId })
    } catch (error) {
      console.error(error)
    }
  }

  const handleUnlikeReply = async () => {
    try {
      await unlikeReply({ commentId, replyId })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteReply = async () => {
    try {
      const recipeId = reply.recipe
      await deleteReply({ replyId, commentId, recipeId })
    } catch (error) {
      console.error(error)
    }
  }

  if (reply) {
    return (
      <div className="flex items-center gap-1 p-3">
        <img
          src={reply.commentedUserAvatar}
          alt="user img"
          className="rounded-full size-14 self-start"
        />
        <div className="flex flex-col w-7/12 mt-2">
          <h2 className="text-primary">
            <span className="text-primary font-bold mb-3">
              {reply.commentedUserUsername} &nbsp;
            </span>
            {reply.content}
          </h2>
          <div className="flex gap-3 justify-start items-center ">
            <small className="text-primary-50">{reply.createdAt}</small>

            {reply.nbOfLikes === 1 ? (
              <small className="text-primary-50">{reply.nbOfLikes} like</small>
            ) : (
              <small className="text-primary-50">{reply.nbOfLikes} likes</small>
            )}
          </div>
        </div>
        {reply.isLikedByUser ? (
          <div className="flex">
            <IconButton onClick={() => setOpenConfirm(true)}>
              {role === 'admin' ? (
                <DeleteIcon />
              ) : (
                reply.canDelete && <DeleteIcon />
              )}
            </IconButton>
            <IconButton className="self-start" onClick={handleUnlikeReply}>
              <FavoriteIcon sx={{ fontSize: 18, marginTop: '3px' }} />
            </IconButton>
          </div>
        ) : (
          <div className="flex">
            <IconButton onClick={() => setOpenConfirm(true)}>
              {role === 'admin' ? (
                <DeleteIcon />
              ) : (
                reply.canDelete && <DeleteIcon />
              )}
            </IconButton>
            <IconButton className="self-start" onClick={handleLikeReply}>
              <FavoriteBorderIcon sx={{ fontSize: 18, marginTop: '3px' }} />
            </IconButton>
          </div>
        )}
        {openConfirm && (
          <ConfirmationModal
            openConfirm={openConfirm}
            setOpenConfirm={setOpenConfirm}
            confirmationMessage={confirmationMessage}
            confirm={handleDeleteReply}
          />
        )}
      </div>
    )
  }
}

export default RecipeCommentReply
