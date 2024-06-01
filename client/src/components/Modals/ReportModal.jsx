import {
  Modal,
  Fade,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { ClipLoader } from 'react-spinners'
import { tsuccess, terror } from '../../utils/toasts'
import { ThemeProvider } from '@mui/material/styles'
import { borderTheme } from '../../utils/borderTheme'
import { useReportUserMutation } from '../../redux/slices/userApiSlice'

const ReportModal = ({
  openReportModal,
  setOpenReportModal,
  windowWidth,
  reportedUser,
  reportedUserId,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [reason, setReason] = useState('Swearing')
  const [reportUser] = useReportUserMutation()
  const [description, setDescription] = useState('')

  const handleReport = async () => {
    setIsLoading(true)
    try {
      await reportUser({
        type: reason,
        description: description.trim(),
        reportedUserId,
      })
      setIsLoading(false)
      setDescription('')
      tsuccess(`${reportedUser} reported Successfully`)
    } catch (error) {
      console.error(error)
      terror('Something went wrong')
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
    <ThemeProvider theme={borderTheme}>
      <Modal
        open={openReportModal}
        onClose={() => setOpenReportModal(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        slotProps={{ backdrop: { timeout: 1000 } }}
        closeAfterTransition
      >
        <Fade in={openReportModal}>
          <div className="bg-background w-2/5 h-3/5 rounded-lg relative flex flex-col gap-9 max-lg:gap-5 max-lg:w-3/5 max-lg:h-3/5 max-md:w-[70%] max-md:h-[70%] max-sm:w-4/5 max-sm:h-4/5 max-mobile:w-full max-mobile:h-full max-md:pt-4 max-mobile:justify-center overflow-y-auto list-scroll-bar">
            <div className="flex justify-center pt-7">{displaySelect}</div>
            <TextField
              sx={{
                width: '80%',
                alignSelf: 'center',
              }}
              value={description}
              multiline
              rows={5}
              placeholder="Write your description here..."
              onChange={e => setDescription(e.target.value)}
            />

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
                onClick={() => setOpenReportModal(false)}
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
                onClick={handleReport}
              >
                {isLoading ? <ClipLoader size={24} color="white" /> : 'Report'}
              </Button>
            </div>
            <div
              className="absolute top-0 right-0 p-2 hover:text-white hover:bg-primary hover:rounded-tr-lg"
              onClick={() => setOpenReportModal(false)}
            >
              <CloseIcon />
            </div>
          </div>
        </Fade>
      </Modal>
    </ThemeProvider>
  )
}

export default ReportModal
