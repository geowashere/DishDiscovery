import { IconButton, Modal, Fade, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import {
  useAddCommentMutation,
  useGetRecipeCommentsQuery,
} from '../../redux/slices/recipeApiSlice'
import RecipeComment from '../recipe/RecipeComment'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { borderTheme } from '../../utils/borderTheme'
import { ThemeProvider } from '@mui/material'
import { ClipLoader } from 'react-spinners'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const CommentModal = ({ openComment, setOpenComment, recipeId }) => {
  const { data, isLoading, isSuccess } = useGetRecipeCommentsQuery(recipeId)
  const [addComment] = useAddCommentMutation()
  const [content, setContent] = useState('')
  const user = useSelector(selectCurrentUser)

  const handleAddComment = async () => {
    let commentBody = {
      content,
      user,
    }
    setContent('')
    try {
      await addComment({ recipeId, commentBody })
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return (
      <Modal
        open={isLoading}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={isLoading}>
          {/* Fade can't render a non-html element */}
          <div>
            <ClipLoader color="#36D7B7" loading={isLoading} size={50} />
          </div>
        </Fade>
      </Modal>
    )
  }

  if (isSuccess) {
    const { recipe, comments } = data
    const { ids } = comments
    const displayComments =
      ids?.length &&
      ids.map(commentId => (
        <RecipeComment
          key={commentId}
          commentId={commentId}
          recipeId={recipe._id}
        />
      ))

    return (
      <>
        <ThemeProvider theme={borderTheme}>
          <Modal
            open={openComment}
            onClose={() => setOpenComment(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            slotProps={{ backdrop: { timeout: 1000 } }}
            closeAfterTransition
          >
            <Fade in={openComment}>
              <div
                style={{ maxHeight: '100%' }}
                className="flex max-xl:w-3/4 max-xl:h-3/4 bg-background overflow-y-auto rounded-md gap-7 relative w-9/12 max-xl:flex-col  max-xl:overflow-y-scroll  max-md:w-full max-md:h-full"
              >
                <div className="flex flex-col gap-3 p-5 w-3/4 max-xl:flex-row-reverse max-xl:w-full">
                  <img
                    src={recipe.image}
                    alt="recipe img"
                    className="block w-full max-sm:hidden max-xl:w-1/2"
                  />
                  <div className="flex flex-col items-start justify-center gap-5 w-full">
                    <div className="flex items-center gap-3 ">
                      <img
                        src={recipe.user.avatar}
                        alt="user img"
                        className="rounded-full size-20 max-xl:"
                      />
                      <div className="flex flex-col flex-between max-xl:flex-grow">
                        <h3 className="text-2xl text-primary">
                          {recipe.user.username}
                        </h3>
                        <p className="text-1xl text-primary-50">
                          {recipe.createdAt}
                        </p>
                      </div>
                    </div>
                    <img
                      src={recipe.image}
                      alt="recipe img"
                      className="block sm:hidden max-sm:w-full max-sm:object-cover max-sm:h-[200px]"
                    />
                    <div className="flex flex-col gap-4 justify-center">
                      <h2 className="text-2xl  text-primary ">
                        {recipe.title}
                      </h2>
                      <p className="text-primary-50">{recipe.caption}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between w-full pt-5 max-xl:overflow-hidden">
                  <div className="flex flex-col w-full modal-scroll-bar overflow-auto ">
                    {displayComments.length ? (
                      displayComments
                    ) : (
                      <div className="flex justify-center items-center text-primary-50 my-auto">
                        <p>There are no comments yet!</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center relative max-xl:sticky max-xl:bottom-0">
                    <TextField
                      sx={{ padding: '10px' }}
                      placeholder="write a comment..."
                      fullWidth
                      value={content}
                      onChange={e => setContent(e.target.value)}
                    />
                    <IconButton
                      className="absolute right-12"
                      onClick={handleAddComment}
                    >
                      <SendIcon />
                    </IconButton>
                  </div>
                </div>
                <div
                  className="md:hidden absolute top-0 left-0 p-1"
                  onClick={() => setOpenComment(false)}
                >
                  <ArrowBackIcon />
                </div>
              </div>
            </Fade>
          </Modal>
        </ThemeProvider>
      </>
    )
  }
}

export default CommentModal
