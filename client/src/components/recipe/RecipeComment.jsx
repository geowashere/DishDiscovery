import { IconButton, Button, TextField } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import { useGetRecipeCommentsQuery } from '../../redux/slices/recipeApiSlice'
import {
  useGetCommentRepliesQuery,
  useReplyToCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useDeleteCommentMutation,
} from '../../redux/slices/commentApiSlice'
import RecipeCommentReply from './RecipeCommentReply'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { BeatLoader } from 'react-spinners'
import ConfirmationModal from '../Modals/ConfirmationModal'

const RecipeComment = ({ commentId, recipeId }) => {
  const { comment } = useGetRecipeCommentsQuery(recipeId, {
    selectFromResult: ({ data }) => ({
      comment: data?.comments?.entities[commentId],
    }),
  })

  const { role } = useSelector(state => state.auth.user)
  const user = useSelector(selectCurrentUser)

  const [showReplies, setShowReplies] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const { data: replies, isLoading: isGetRepliesLoading } =
    useGetCommentRepliesQuery(commentId, {
      //only fetch when a user specifically wants to see a comment's replies
      skip: !showReplies,
    })
  const { ids } = replies || {}

  const displayReplies =
    ids?.length > 0 &&
    ids.map(replyId => (
      <RecipeCommentReply
        key={replyId}
        replyId={replyId}
        commentId={commentId}
      />
    ))

  const [likeComment] = useLikeCommentMutation()
  const [unlikeComment] = useUnlikeCommentMutation()
  const [replyToComment] = useReplyToCommentMutation()
  const [deleteComment] = useDeleteCommentMutation()
  const confirmationMessage = 'Delete comment'

  const handleLikeComment = async () => {
    await likeComment({ recipeId, commentId })
  }

  const handleUnlikeComment = async () => {
    await unlikeComment({ recipeId, commentId })
  }

  const handleReplyToComment = async () => {
    const commentBody = {
      content: replyContent,
      user,
    }
    setReplyContent('')
    const res = await replyToComment({ commentBody, commentId, recipeId })
    console.log(res)
    setShowReplyInput(false)
  }

  const handleDeleteComment = async () => {
    try {
      await deleteComment({ commentId, recipeId })
    } catch (error) {
      console.log(error)
    }
  }

  if (comment) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1 p-3 w-full">
          <img
            src={comment.commentedUserAvatar}
            alt="user img"
            className="rounded-full size-14 self-start"
          />
          <div className="flex flex-col mt-2 w-full">
            <h2 className="text-primary w-8/12">
              <span className="text-primary font-bold mb-3">
                {comment.commentedUserUsername}&nbsp;
              </span>
              {comment.content}
            </h2>
            <div className="flex gap-3 justify-start items-center flex-grow">
              <small className="text-primary-50">{comment.createdAt}</small>
              {comment.nbOfLikes === 1 ? (
                <small className="text-primary-50">
                  {comment.nbOfLikes} like
                </small>
              ) : (
                <small className="text-primary-50">
                  {comment.nbOfLikes} likes
                </small>
              )}
              <IconButton onClick={() => setShowReplyInput(true)}>
                <ReplyIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </div>
            {showReplyInput && (
              <div className="flex relative">
                <TextField
                  placeholder="write a reply"
                  value={replyContent}
                  fullWidth
                  InputProps={{ sx: { borderRadius: 100 } }}
                  onChange={e => setReplyContent(e.target.value)}
                />
                <IconButton
                  className="absolute right-12"
                  onClick={handleReplyToComment}
                >
                  <SendIcon />
                </IconButton>
              </div>
            )}
            {comment.hasReplies > 0 && (
              <Button
                sx={{ color: '#ccc', fontSize: '10px', marginTop: '-3px' }}
                onClick={() => setShowReplies(state => !state)}
              >
                {!showReplies ? (
                  <span>View Replies ({comment.hasReplies})</span>
                ) : (
                  <span>Hide Replies </span>
                )}
              </Button>
            )}
          </div>
          {comment.isCommentLikedByUser ? (
            <div className="flex">
              <IconButton onClick={() => setOpenConfirm(true)}>
                {role === 'admin' ? (
                  <DeleteIcon />
                ) : (
                  comment.canDelete && <DeleteIcon />
                )}
              </IconButton>
              <IconButton className="" onClick={handleUnlikeComment}>
                <FavoriteIcon sx={{ fontSize: 18, marginTop: '3px' }} />
              </IconButton>
            </div>
          ) : (
            <div className="flex">
              <IconButton onClick={() => setOpenConfirm(true)}>
                {role === 'admin' ? (
                  <DeleteIcon />
                ) : (
                  comment.canDelete && <DeleteIcon />
                )}
              </IconButton>
              <IconButton className="self-start" onClick={handleLikeComment}>
                <FavoriteBorderIcon sx={{ fontSize: 18, marginTop: '3px' }} />
              </IconButton>
            </div>
          )}
        </div>

        <div className="ml-10">
          {isGetRepliesLoading ? (
            <BeatLoader
              color="#898784"
              loading={isGetRepliesLoading}
              size={5}
              cssOverride={{
                display: 'flex',
                justifyContent: 'center',
              }}
            />
          ) : (
            showReplies && displayReplies
          )}
        </div>
        {openConfirm && (
          <ConfirmationModal
            openConfirm={openConfirm}
            setOpenConfirm={setOpenConfirm}
            confirmationMessage={confirmationMessage}
            confirm={handleDeleteComment}
          />
        )}
      </div>
    )
  }
}

export default RecipeComment
