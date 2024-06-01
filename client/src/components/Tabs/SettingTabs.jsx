import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab, Box } from '@mui/material'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HttpsIcon from '@mui/icons-material/Https'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import ProfileSetting from '../Settings/ProfileSetting'
import NotificationsSetting from '../Settings/NotificationsSetting'
import PasswordSetting from '../Settings/PasswordSetting'
import { ThemeProvider } from '@mui/material/styles'
import { borderTheme } from '../../utils/borderTheme'
import LogoutModal from '../Modals/LogoutModal'
import { useDeleteAccountMutation } from '../../redux/slices/userApiSlice'
import ConfirmationModal from '../Modals/ConfirmationModal'
import DeleteAccountModal from '../Modals/DeleteAccountModal'
import { useSendLogoutMutation } from '../../redux/slices/authApiSlice'
import AddSuggestion from '../Settings/AddSuggestion'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { useSelector } from 'react-redux'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

export default function SettingTabs() {
  const [value, setValue] = useState(0)
  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const confirmationMessage = 'Delete Your Account'
  const [isBtnLoading, setIsBtnLoading] = useState(false)
  const { role } = useSelector(state => state.auth.user)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const [deleteAccount] = useDeleteAccountMutation()
  const [sendLogout] = useSendLogoutMutation()

  const handleDeleteAccount = async () => {
    setIsBtnLoading(true)
    try {
      await deleteAccount()
      await sendLogout()
    } catch (error) {
      console.error(error)
      setIsBtnLoading(false)
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const notificationsSettings = [
    {
      notification: 'Followers',
      description: 'Receive a notification every time a user follows you.',
      type: 'follow',
      isChecked: true,
    },
    {
      notification: 'Likes',
      description:
        'Receive a notification every time a user likes one of your posts',
      type: 'like',
      isChecked: true,
    },
    {
      notification: 'Comments',
      description:
        'Receive a notification every time a user comments on one of your posts.',
      type: 'comment',
      isChecked: true,
    },
    {
      notification: 'Posts',
      description: 'Receive a notification every time a user you follow posts.',
      type: 'post',
      isChecked: true,
    },
  ]

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <ThemeProvider theme={borderTheme}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: windowWidth < 1024 ? 'column-reverse' : 'row',
          gap: windowWidth < 1024 ? '1rem' : '9rem',
          width: '100%',
          height: '100%',
        }}
      >
        <div className="flex flex-col h-full max-lg:z-[2] lg:overflow-x-auto tab-scroll-bar lg:w-1/4">
          <h3 className="text-2xl max-lg:hidden">
            {value === 0 && 'Account'}
            {value === 1 && 'Notifications'}
            {value === 2 && 'Password'}
            {value === 3 && 'Suggestion'}
          </h3>
          <Box
            sx={
              windowWidth < 1024
                ? {
                    position: 'sticky',
                    bottom: '0',
                    background: '#FFFAF5',
                    marginTop: 'auto',
                  }
                : {}
            }
          >
            <hr className="w-full mx-auto lg:hidden border-black border-t-1" />

            <Tabs
              orientation={windowWidth < 1024 ? 'horizontal' : 'vertical'}
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              indicatorColor={windowWidth < 1024 ? '' : 'transparent'}
              variant={
                windowWidth < 1024
                  ? windowWidth < (role === 'admin' ? 440 : 530)
                    ? 'scrollable'
                    : 'fullWidth'
                  : 'standard'
              }
              sx={
                windowWidth < 1024
                  ? {
                      '& .MuiTabs-indicator': {
                        background: '#333329',
                      },
                    }
                  : {}
              }
            >
              <Tab
                icon={
                  <PermIdentityIcon
                    fontSize={windowWidth < 640 ? 'small' : 'medium'}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 0 ? '#333329 !important' : '',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                }}
                label={windowWidth < 1024 ? '' : 'Profile Base'}
                {...a11yProps(0)}
              />
              <Tab
                icon={
                  <NotificationsNoneIcon
                    fontSize={windowWidth < 640 ? 'small' : 'medium'}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 1 ? '#333329 !important' : '',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                }}
                label={windowWidth < 1024 ? '' : 'Notifications'}
                {...a11yProps(1)}
              />
              <Tab
                icon={
                  <HttpsIcon
                    fontSize={windowWidth < 640 ? 'small' : 'medium'}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 2 ? '#333329 !important' : '',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                }}
                label={windowWidth < 1024 ? '' : 'Password'}
                {...a11yProps(2)}
              />
              <Tab
                icon={
                  <LightbulbIcon
                    fontSize={windowWidth < 640 ? 'small' : 'medium'}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 3 ? '#333329 !important' : '',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                  display: role === 'admin' ? 'none' : 'flex',
                }}
                label={windowWidth < 1024 ? '' : 'Suggestion'}
                {...a11yProps(3)}
              />
              <Tab
                icon={
                  <DeleteOutlineIcon
                    fontSize={windowWidth < 640 ? 'small' : 'medium'}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 4 ? 'red !important' : 'red',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                }}
                label={windowWidth < 1024 ? '' : 'Delete Account'}
                onClick={() => setOpenConfirm(true)}
              />
              <Tab
                icon={
                  <LogoutIcon
                    fontSize={windowWidth < 640 ? 'small' : 'medium'}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 5 ? 'red !important' : 'red',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                  marginLeft: '5px',
                }}
                label={windowWidth < 1024 ? '' : 'Logout'}
                onClick={() => setOpen(true)}
              />
            </Tabs>
          </Box>
        </div>
        <TabPanel value={value} index={0} className="grow w-full h-full">
          <div className="flex flex-col max-lg:w-full max-lg:p-4 h-full">
            <div className="size-[2rem]  w-full lg:hidden  max-lg:sticky max-lg:top-0 max-lg:pt-5 max-lg:z-[1]"></div>
            <div className="flex  gap-20 max-lg:gap-10 max-lg:pt-5 max-lg:flex-col max-lg:items-center max-lg:z-[0] max-lg:w-full max-lg:h-[100%] overflow-y-auto list-scroll-bar">
              <ProfileSetting windowWidth={windowWidth} />
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={1} className="grow w-full h-full">
          <div className="flex flex-col gap-5  max-lg:gap-10 w-10/12 max-lg:w-full max-lg:p-4 h-full">
            <h2 className="text-3xl  text-primary max-lg:sticky max-lg:top-0 max-lg:pt-3 max-lg:z-[1] max-lg:text-2xl max-lg:text-center">
              Choose your preferences
            </h2>
            <div className="flex flex-col  max-lg:p-2 h-3/5 max-lg:gap-10 max-lg:pt-5 max-lg:flex-col max-lg:items-center max-lg:z-[0] w-full max-lg:h-[100%] overflow-y-auto list-scroll-bar">
              {notificationsSettings.map(setting => (
                <NotificationsSetting
                  key={setting.notification}
                  setting={setting}
                />
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={2} className="grow w-full h-full">
          <div className="flex flex-col gap-10 max-lg:gap-5 w-10/12 max-lg:w-full max-lg:p-4 h-full">
            <h2 className="text-3xl text-primary max-lg:sticky max-lg:top-0 max-lg:pt-3 max-lg:z-[1] max-lg:text-2xl max-lg:text-center">
              Change your password
            </h2>
            <div className="flex flex-col h-[85%] max-lg:p-2  max-lg:gap-5 max-lg:pt-5 max-lg:flex-col max-lg:items-center max-lg:z-[0] w-full max-lg:h-[100%] ">
              <PasswordSetting windowWidth={windowWidth} />
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={3} className="grow w-full h-full">
          <div className="flex flex-col gap-5 h-full max-lg:gap-5 w-10/12 max-lg:w-full max-lg:p-4">
            <h2 className="text-3xl text-primary  max-lg:sticky max-lg:top-0 max-lg:pt-3 max-lg:z-[1] max-lg:text-2xl max-lg:text-center">
              Create Suggestion
            </h2>
            <div className="flex  flex-col h-[85%] max-lg:p-2  max-lg:gap-5 max-lg:pt-5 max-lg:flex-col max-lg:items-center max-lg:z-[0] w-full max-lg:h-[100%]  ">
              <AddSuggestion windowWidth={windowWidth} />
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={4}></TabPanel>

        <TabPanel value={value} index={5}>
          <LogoutModal
            open={open}
            setOpen={setOpen}
            windowWidth={windowWidth}
          />
        </TabPanel>

        {openConfirm && (
          <ConfirmationModal
            windowWidth={windowWidth}
            openConfirm={openConfirm}
            setOpenConfirm={setOpenConfirm}
            confirmationMessage={confirmationMessage}
            confirm={() => {
              setOpenConfirm(false)
              setOpenDelete(true)
            }}
          />
        )}
        {openDelete && (
          <DeleteAccountModal
            windowWidth={windowWidth}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            confirmationMessage={confirmationMessage}
            confirm={handleDeleteAccount}
            isBtnLoading={isBtnLoading}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
