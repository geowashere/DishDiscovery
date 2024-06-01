import { Button, Fade, Modal, TextField } from '@mui/material'
import { useState } from 'react'
import { useToggleStatusMutation } from '../../redux/slices/recipeApiSlice'
import { ClipLoader } from 'react-spinners'
import { tsuccess } from '../../utils/toasts'
import { borderTheme } from '../../utils/borderTheme'
import { ThemeProvider } from '@mui/material/styles'

const StatusCaptionModal = ({
  openCaption,
  setOpenCaption,
  myRecipeId,
  myRecipe,
}) => {
  const [caption, setCaption] = useState('')
  const [toggleStatus] = useToggleStatusMutation()
  const [isBtnLoading, setIsBtnLoading] = useState(false)

  const handleToggleStatus = async () => {
    setIsBtnLoading(true)
    setOpenCaption(false)
    try {
      await toggleStatus({ recipeId: myRecipeId, caption })
      tsuccess('Recipe status has changed')
    } catch (error) {
      setIsBtnLoading(false)
    }
  }

  return (
    <ThemeProvider theme={borderTheme}>
      <Modal
        open={openCaption}
        onClose={() => setOpenCaption(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        slotProps={{ backdrop: { timeout: 1000 } }}
        closeAfterTransition
      >
        <Fade in={openCaption}>
          <div className="bg-white w-2/3 h-2/3 rounded-lg flex flex-col items-center justify-evenly p-10  max-xl:w-3/4 max-xl:h-3/4  max-sm:w-full max-sm:h-full">
            {myRecipe.status === 'private' ? (
              <p className="text-primary text-xl">
                Almost finished!
                <span> Add a caption to complete your post!</span>
              </p>
            ) : (
              <p>
                Switching a recipe to private will make it unavailable for
                others to see it.
                <br />
                Do you still want to make it private?
              </p>
            )}

            {myRecipe.status === 'private' && (
              <TextField
                id="caption"
                value={caption}
                multiline
                rows={10}
                placeholder="Cool Recipe"
                onChange={e => setCaption(e.target.value)}
                fullWidth
              />
            )}

            <div className="flex justify-evenly items-center w-full max-mobile:flex-col max-mobile:gap-3">
              <div className="flex flex-col items-end">
                <div className="flex gap-10">
                  <Button
                    sx={{
                      background: '#333329',
                      textTransform: 'none',
                      color: '#fff',
                      padding: '15px 35px',
                      '&:hover': {
                        color: '#333329',
                        background: '#fff',
                      },
                    }}
                    onClick={() => setOpenCaption(false)}
                  >
                    Go Back
                  </Button>
                  <Button
                    sx={{
                      background: '#333329',
                      textTransform: 'none',
                      color: '#fff',
                      padding: '15px 35px',
                      '&:hover': {
                        color: '#333329',
                        background: '#fff',
                      },
                    }}
                    onClick={handleToggleStatus}
                    disabled={isBtnLoading}
                  >
                    {isBtnLoading ? (
                      <ClipLoader size={25} />
                    ) : myRecipe.status === 'private' ? (
                      'Publish'
                    ) : (
                      'Ok, Make it private'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </ThemeProvider>
  )
}

export default StatusCaptionModal
