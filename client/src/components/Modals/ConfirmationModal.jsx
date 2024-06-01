import { Fade, Modal, Button } from '@mui/material'

const ConfirmationModal = ({
  openConfirm,
  setOpenConfirm,
  confirmationMessage,
  confirm,
  windowWidth,
}) => {
  const handleConfirm = () => {
    confirm()
    setOpenConfirm(false)
  }

  return (
    <Modal
      open={openConfirm}
      onClose={() => setOpenConfirm(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={openConfirm}>
        <div className="rounded-lg text-primary flex flex-col items-center justify-center gap-10 bg-background p-14 max-lg:w-3/5 max-lg:h-3/5 max-mobile:w-full max-mobile:h-full max-md:pt-4 max-mobile:justify-center">
          <h1 className="text-primary text-3xl max-md:text-xl max-md:text-center">
            {confirmationMessage}
          </h1>

          <div className="flex gap-7">
            <Button
              sx={{
                fontSize: windowWidth < 768 ? '0.7' : '0.875',
                background: '#333329',
                textTransform: 'none',
                color: '#fff',
                padding: '15px 35px',
                '&:hover': {
                  color: '#333329',
                  background: '#fff',
                },
              }}
              onClick={() => setOpenConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{
                fontSize: windowWidth < 768 ? '0.7' : '0.875',
                background: '#333329',
                textTransform: 'none',
                color: '#fff',
                padding: '15px 35px',
                '&:hover': {
                  color: '#333329',
                  background: '#fff',
                },
              }}
              onClick={handleConfirm}
            >
              Yes
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default ConfirmationModal
