import { Fade, Modal, Button } from '@mui/material'
import React from 'react'
import { ClipLoader } from 'react-spinners'

const SaveAsPendingModal = ({
  openSave,
  setOpenSave,
  onPostPending,
  onUpdatePending,
  location,
  isBtnLoading,
}) => {
  const pendingRecipeId = location.state?.pendingRecipe._id

  return (
    <Modal
      open={openSave}
      onClose={() => setOpenSave(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={openSave}>
        <div className="text-primary rounded-lg flex flex-col items-center justify-center gap-10 bg-background p-8 w-2/5 h-3/5 max-xl:w-3/4 max-xl:h-3/4  max-sm:w-full max-sm:h-full">
          <h1 className="text-4xl">Keep in mind</h1>
          <ul className="list-disc list-inside flex flex-col gap-2">
            <li>The status will be set to private.</li>
            <li>
              If you have set a caption for some reason, it will not be read.
            </li>
          </ul>
          <div className="flex gap-5">
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
              onClick={() => setOpenSave(false)}
            >
              Cancel
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
              disabled={isBtnLoading}
              onClick={() =>
                location.state?.pendingRecipe
                  ? onUpdatePending(pendingRecipeId)
                  : onPostPending()
              }
            >
              {isBtnLoading ? <ClipLoader size={25} /> : 'Save'}
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default SaveAsPendingModal
