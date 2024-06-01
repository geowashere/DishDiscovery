import {
  Modal,
  Fade,
  Button,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useEffect } from 'react'
import {
  useWarnUserMutation,
  useUpdateWarnMutation,
} from '../../redux/slices/adminApiSlice'
import { ClipLoader } from 'react-spinners'
import { tsuccess, terror } from '../../utils/toasts'

const WarnChoicesModal = ({
  openChoices,
  setOpenChoices,
  userId,
  name,
  warnId = null,
}) => {
  const [reason, setReason] = useState('Swearing')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isLoading, setIsLoading] = useState(false)
  const [warnUser] = useWarnUserMutation()
  const [updateWarn] = useUpdateWarnMutation()

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleWarn = async () => {
    setIsLoading(true)
    try {
      const res = await (!warnId
        ? warnUser({ reason, userId })
        : updateWarn({
            updatedReason: reason,
            warnId,
            userId,
          }))

      if (res?.error?.status === 400) terror('Please enter a different value')
      if (res?.data)
        tsuccess(
          `${!warnId ? name : 'Warn'} has been ${
            !warnId ? 'warned' : 'updated'
          }`
        )
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

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
      </Select>
    </FormControl>
  )

  return (
    <Modal
      open={openChoices}
      onClose={() => setOpenChoices(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={openChoices}>
        <div className="w-2/5 h-3/5 bg-background rounded-lg relative flex flex-col gap-10 max-lg:w-3/5 max-lg:h-3/5 max-mobile:w-full max-mobile:h-full max-md:pt-4 max-mobile:justify-center">
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
              onClick={() => setOpenChoices(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isLoading}
              sx={{
                textTransform: 'none',
                background: '#FF0000',
                padding: '9px',
                '&:hover': {
                  background: '#FFFFFF',
                  color: '#FF0000',
                },
              }}
              onClick={handleWarn}
            >
              {isLoading ? (
                <ClipLoader size={24} color="white" />
              ) : !warnId ? (
                'Warn'
              ) : (
                'Update'
              )}
            </Button>
          </div>
          <div
            className="absolute top-0 right-0 p-2 hover:text-white hover:bg-primary hover:rounded-tr-lg"
            onClick={() => setOpenChoices(false)}
          >
            <CloseIcon />
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default WarnChoicesModal
