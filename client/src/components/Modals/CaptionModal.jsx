import { Modal, Fade, Button, TextField } from '@mui/material'
import { ClipLoader } from 'react-spinners'

const CaptionModal = ({
  handleBack,
  openCaption,
  setOpenCaption,
  caption,
  setCaption,
  status,
  onPostRecipe,
  onUpdateRecipe,
  location,
  isBtnLoading,
}) => {
  const handleBackStep = () => {
    handleBack()
    setOpenCaption(false)
  }

  const handlePostRecipe = () => {
    onPostRecipe(caption)
  }

  const handleUpdateRecipe = () => {
    const recipeToUpdateId = location.state?.myRecipe?.id
    onUpdateRecipe(recipeToUpdateId, caption)
  }
  return (
    <Modal
      open={openCaption}
      onClose={handleBackStep}
      slotProps={{
        backdrop: {
          timeout: 1000,
        },
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Fade in={openCaption}>
        <div className="bg-white w-2/3 h-2/3 rounded-lg flex flex-col items-center justify-evenly p-10  max-xl:w-3/4 max-xl:h-3/4  max-sm:w-full max-sm:h-full">
          <p className="text-primary text-xl">
            Almost finished!
            {!status && <span>Add a caption to complete your post!</span>}
          </p>
          {!status && (
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
            <p className="text-primary text-sm">
              This will only post if the recipe is public.
              <br /> Otherwise, it will only appear in your profile.
            </p>
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
                  onClick={handleBackStep}
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
                  onClick={
                    location.state?.myRecipe
                      ? handleUpdateRecipe
                      : handlePostRecipe
                  }
                  disabled={isBtnLoading}
                >
                  {isBtnLoading ? (
                    <ClipLoader size={25} />
                  ) : location.state?.myRecipe ? (
                    'Save Changes'
                  ) : (
                    'POST'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default CaptionModal
