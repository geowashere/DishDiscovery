import { Modal, Fade, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from '../../redux/slices/authApiSlice'
import { resetSidebar } from '../../redux/slices/sideBarSlice'
import { useDispatch } from 'react-redux'

const LogoutModal = ({ open, setOpen, windowWidth }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sendLogout] = useSendLogoutMutation()
  const logoutHandler = async e => {
    e.preventDefault()

    try {
      await sendLogout()
      dispatch(resetSidebar())
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      slotProps={{ backdrop: { timeout: 1000 } }}
    >
      <Fade in={open}>
        <div className="bg-white w-1/2 h-1/2 rounded-lg flex flex-col items-center justify-evenly  max-lg:w-4/5 max-lg:h-3/5 max-mobile:w-full max-mobile:h-full max-md:pt-4 max-mobile:justify-center max-mobile:gap-5">
          <p className="text-primary text-xl max-md:text-lg max-lg:text-center">
            Are you sure you want to logout?
          </p>
          <div className="flex justify-evenly w-full">
            <Button
              sx={{
                fontSize: windowWidth < 768 ? '0.7' : '0.875',
                background: '#fff',
                color: '#333329',
                width: '40%',
                '&:hover': {
                  color: '#fff',
                  background: 'darkgrey',
                  fontWeight: '600',
                },
              }}
              onClick={() => setOpen(false)}
            >
              No
            </Button>
            <Button
              sx={{
                fontSize: windowWidth < 768 ? '0.7' : '0.875',
                background: '#333329',
                color: '#fff',
                width: '40%',
                '&:hover': {
                  color: '#FF0000',
                  fontWeight: '600',
                  background: 'lightgrey',
                },
              }}
              onClick={logoutHandler}
            >
              Yes
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default LogoutModal
