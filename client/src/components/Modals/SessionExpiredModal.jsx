import { Modal, Fade, Button } from '@mui/material'
import { logOut } from '../../redux/slices/authSlice'
import { useDispatch } from 'react-redux'
import { resetSession } from '../../redux/slices/sessionSlice'

const SessionExpiredModal = ({ openSessionExpired }) => {
  const dispatch = useDispatch()

  return (
    <Modal
      open={openSessionExpired}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={openSessionExpired}>
        <div className="text-primary flex flex-col items-center justify-center gap-10 bg-background p-14">
          <h1 className="text-3xl">Your session has expired!</h1>

          <div className="flex gap-7">
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
              onClick={() => {
                dispatch(resetSession())
                dispatch(logOut())
              }}
            >
              Ok
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default SessionExpiredModal
