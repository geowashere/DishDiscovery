import { useGetAllUsersQuery } from '../../redux/slices/userApiSlice'
import { Button } from '@mui/material'
import AllUserWarnsModal from '../Modals/AllUserWarnsModal'
import WarnChoicesModal from '../Modals/WarnChoicesModal'
import {
  useGetBanByUserIdQuery,
  useUnBanUserMutation,
} from '../../redux/slices/adminApiSlice'
import { useState, useEffect } from 'react'
import { terror, tsuccess, twarn } from '../../utils/toasts'
import { useSelector } from 'react-redux'
import BanModal from '../Modals/BanModal'
import { Tooltip, ClickAwayListener } from '@mui/material'
import { ClipLoader } from 'react-spinners'

const User = ({ userId }) => {
  const [openAllWarns, setOpenAllWarns] = useState(false)
  const [openChoices, setOpenChoices] = useState(false)
  const [openBanModal, setOpenBanModal] = useState(false)
  const [updateBan, setUpdateBan] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { _id } = useSelector(state => state.auth.user)
  const [unBanUser] = useUnBanUserMutation()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const { user } = useGetAllUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  })

  const [open, setOpen] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const { data } = useGetBanByUserIdQuery(
    { userId },
    {
      skip: !user.isBanned,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  )

  const handleUnban = async () => {
    if (user.role === 'admin') {
      twarn('Invalid Permissions. Please contact the owner.')
      return
    }
    if (data?.admin === null) {
      twarn('You cannot unban a user who has been banned by the owner.')
      return
    }

    if (data?.admin !== _id && data?.admin) {
      twarn('You cannot unban a user who has been banned another admin.')
      return
    }
    setIsLoading(true)
    try {
      await unBanUser({ userId })
      tsuccess('User unbanned successfully')
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      terror('Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`flex  max-lg:flex-col  max-lg:gap-2 items-center mobile:px-2 justify-between ${
        user.isEmailVerified ? 'visible' : 'hidden'
      }`}
    >
      <div className="flex items-center gap-2">
        <img src={user.avatar} className="w-10 h-10" />
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <Tooltip
            title={`${user.username}`}
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            open={open}
          >
            <p
              className="mobile:text-2xl max-mobile:text-xl  text-primary"
              onMouseEnter={handleTooltipOpen}
            >
              {user.username.length > 7
                ? user.username.substring(0, 7) + '...'
                : user.username}
            </p>
          </Tooltip>
        </ClickAwayListener>
      </div>
      <div className="flex lg:gap-2 items-center max-lg:justify-center max-lg:gap-4 max-mobile:gap-2  max-lg:w-full">
        <Button
          disabled={isLoading}
          onClick={
            user.isBanned
              ? handleUnban
              : () => {
                  if (user.role === 'admin') {
                    twarn('Invalid Permissions. Please contact the owner')
                    return
                  }

                  setUpdateBan(false)
                  setOpenBanModal(true)
                }
          }
          variant="contained"
          sx={{
            textTransform: 'none',
            background: '#FF0000',
            padding: windowWidth < 375 ? '6px' : '8px',
            fontSize: windowWidth < 375 ? '.6rem' : '.875rem',
            '&:hover': {
              background: '#FFFFFF',
              color: '#FF0000',
            },
          }}
        >
          {isLoading ? (
            <ClipLoader size={25} color="#fff" />
          ) : user.isBanned ? (
            'unban'
          ) : (
            'Ban'
          )}
        </Button>
        <Button
          onClick={() => {
            if (user.role === 'admin') {
              twarn('Invalid Permissions. Please contact the owner')
              return
            }

            setUpdateBan(true)
            setOpenBanModal(true)
          }}
          variant="contained"
          disabled={!user.isBanned}
          sx={{
            textTransform: 'none',
            background: '#FF0000',
            padding: windowWidth < 375 ? '6px' : '8px',
            fontSize: windowWidth < 375 ? '.6rem' : '.875rem',
            '&:hover': {
              background: '#FFFFFF',
              color: '#FF0000',
            },
          }}
        >
          Update Ban
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            background: '#FF0000',
            padding: windowWidth < 375 ? '6px' : '8px',
            fontSize: windowWidth < 375 ? '.6rem' : '.875rem',
            '&:hover': {
              background: '#FFFFFF',
              color: '#FF0000',
            },
          }}
          onClick={() => {
            if (user.role === 'admin') {
              twarn('Invalid Permissions. Please contact the owner')
              return
            }
            if (user.isBanned) {
              terror('User already banned')
              return
            }
            setOpenChoices(true)
          }}
        >
          Warn
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            background: '#333329',
            padding: windowWidth < 375 ? '6px' : '8px',
            fontSize: windowWidth < 375 ? '.6rem' : '.875rem',
            '&:hover': {
              background: '#FFFFFF',
              color: '#333329',
            },
          }}
          onClick={() => {
            setOpenAllWarns(true)
          }}
        >
          All Warns
        </Button>
      </div>
      {openAllWarns && (
        <AllUserWarnsModal
          openAllWarns={openAllWarns}
          setOpenAllWarns={setOpenAllWarns}
          userId={userId}
        />
      )}
      {openChoices && (
        <WarnChoicesModal
          openChoices={openChoices}
          setOpenChoices={setOpenChoices}
          userId={userId}
          name={user.username}
        />
      )}
      {openBanModal && (
        <BanModal
          userId={userId}
          openBanModal={openBanModal}
          setOpenBanModal={setOpenBanModal}
          updateBan={updateBan}
        />
      )}
    </div>
  )
}

export default User
