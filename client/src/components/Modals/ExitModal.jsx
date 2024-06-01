import { Modal, Fade, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const ExitModal = ({
  modalOpen,
  setModalOpen,
  location,
  prevLocation,
  setIsSelected,
  setOpenSearch,
}) => {
  const navigate = useNavigate()

  return (
    <Modal
      open={modalOpen}
      onClose={() => {
        setModalOpen(false)
        setIsSelected(prevLocation)
      }}
      closeAfterTransition
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      slotProps={{ backdrop: { timeout: 1000 } }}
    >
      <Fade in={modalOpen}>
        <div className="bg-white rounded-lg flex flex-col items-center justify-center gap-10 p-14">
          <p className="text-primary text-2xl">
            Are you sure you want to exit and discard all changes?
          </p>
          <div className="flex gap-7">
            <Button
              sx={{
                background: '#FFFAF5',
                color: '#333329',
                padding: '15px 35px',
                textTransform: 'none',
                '&:hover': {
                  color: '#FFFAF5',
                  background: 'darkgrey',
                  fontWeight: '600',
                },
              }}
              onClick={() => {
                setModalOpen(false)
                setIsSelected(prevLocation)
              }}
            >
              No
            </Button>
            <Button
              sx={{
                background: '#FFFAF5',
                color: '#333329',
                padding: '15px 35px',
                textTransform: 'none',
                '&:hover': {
                  color: '#FF0000',
                  fontWeight: '600',
                  background: 'lightgrey',
                },
              }}
              onClick={() => {
                setModalOpen(false)
                if (location !== '/none') {
                  navigate(location)
                } else {
                  setIsSelected(prevLocation)
                  setOpenSearch(true)
                }
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default ExitModal
