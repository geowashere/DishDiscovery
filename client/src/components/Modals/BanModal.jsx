import {
  Fade,
  Modal,
  Button,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material'
import { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { ClipLoader } from 'react-spinners'
import { tsuccess, terror } from '../../utils/toasts'
import {
  useBanUserMutation,
  useUpdateUserBanMutation,
} from '../../redux/slices/adminApiSlice'

const BanModal = ({ openBanModal, setOpenBanModal, userId, updateBan }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [reason, setReason] = useState('Swearing')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [banUser] = useBanUserMutation()
  const [updateUserBan] = useUpdateUserBanMutation()
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const displaySelect = (
    <FormControl
      sx={{
        m: windowWidth < 649 ? 0 : 1,
        minWidth: 100,
      }}
    >
      <Select
        id="warn-choices"
        value={reason}
        onChange={e => setReason(e.target.value)}
        sx={{ borderRadius: '10px' }}
      >
        <MenuItem value="Swearing">Swearing</MenuItem>
        <MenuItem value="Spamming">Spamming</MenuItem>
        <MenuItem value="Illegal Activities">Illegal Activities</MenuItem>
        <MenuItem value="Misleading Content">Misleading Content</MenuItem>
        <MenuItem value="Harassment and Bullying">
          Harassment and Bullying
        </MenuItem>
        <MenuItem value="Breaking the rules">Breaking the rules</MenuItem>
        <MenuItem value="Multiple violations">Multiple violations</MenuItem>
      </Select>
    </FormControl>
  )

  const handleBan = async () => {
    setIsLoading(true)
    try {
      const res = await (updateBan
        ? updateUserBan({ userId, reason })
        : banUser({ userId, reason }))

      if (res?.error?.data?.message === 'Please enter a different value') {
        setIsLoading(false)
        terror('Please enter a diffrent value')
        return
      }
      tsuccess(`User ${updateBan ? "'s ban updated" : 'banned'} successfully`)
      setIsLoading(false)
      setOpenBanModal(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      terror('Something went wrong')
    }
  }
  return (
    <Modal
      open={openBanModal}
      onClose={() => setOpenBanModal(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={openBanModal}>
        <div className="bg-background w-2/5 h-3/5 rounded-lg relative flex flex-col gap-10 max-lg:w-3/5 max-lg:h-3/5 max-mobile:w-full max-mobile:h-full max-md:pt-4 max-mobile:justify-center overflow-y-auto list-scroll-bar">
          <div className="flex justify-center pt-7">{displaySelect}</div>

          <div className="flex justify-evenly">
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                background: '#333329',
                padding: '9px',
                '&:hover': {
                  background: '#FFFFFF',
                  color: '#333329',
                },
              }}
              onClick={() => setOpenBanModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isLoading}
              sx={{
                textTransform: 'none',
                background: '#FF0000',
                padding: '10px',
                '&:hover': {
                  background: '#FFFFFF',
                  color: '#FF0000',
                },
              }}
              onClick={handleBan}
            >
              {isLoading ? (
                <ClipLoader size={24} color="white" />
              ) : updateBan ? (
                'Update ban'
              ) : (
                'ban'
              )}
            </Button>
          </div>

          <div
            className="absolute top-0 right-0 p-2 hover:text-white hover:bg-primary hover:rounded-tr-lg"
            onClick={() => setOpenBanModal(false)}
          >
            <CloseIcon />
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default BanModal
