import UserStats from './UserStats'
import {
  useFollowUserMutation,
  useGetUserQuery,
  useUnfollowUserMutation,
} from '../../redux/slices/userApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { useParams } from 'react-router-dom'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import ReportModal from '../Modals/ReportModal'

const UserInfo = ({ publicUser }) => {
  const { id } = useParams()
  const user = !id && useSelector(selectCurrentUser)
  const { role } = useSelector(selectCurrentUser)
  const [openReportModal, setOpenReportModal] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const userInfo = ['Posts', 'Followers', 'Followings']

  useGetUserQuery('userStats', {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    skip: id ? true : false,
  })

  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()

  const handleFollowUser = async () => {
    try {
      await followUser(id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUnfollowUser = async () => {
    try {
      await unfollowUser(id)
    } catch (error) {
      console.error(error)
    }
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

  if (user || publicUser) {
    return (
      <>
        <div className="flex justify-center w-full gap-14  p-10  max-sm:gap-2 max-sm:items-center">
          <img
            src={user?.avatar || publicUser?.avatar}
            alt="user-img"
            className="size-28 object-cover rounded-full max-mobile:size-24"
          />
          <div className="flex flex-col gap-10 max-sm:gap-5 max-mobile:gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 pr-4">
                <p className="text-3xl text-primary max-sm:text-2xl ">
                  {user.username || publicUser.username}
                </p>
                {id && (
                  <div className="flex gap-1">
                    <Button
                      sx={{
                        background: '#333329',
                        textTransform: 'none',
                        color: '#fff',
                        fontSize: windowWidth < 640 ? '.7rem' : '0.875rem',
                        padding:
                          windowWidth < 440
                            ? '4px 9px'
                            : windowWidth < 640
                            ? '8px 12px'
                            : '15px 25px',
                        '&:hover': {
                          color: '#333329',
                          background: '#fff',
                        },
                        borderRadius: '100px',
                      }}
                      onClick={
                        publicUser.relationshipExists
                          ? handleUnfollowUser
                          : handleFollowUser
                      }
                    >
                      {publicUser.relationshipExists ? 'Unfollow' : 'Follow'}
                    </Button>
                    {role !== 'admin' && (
                      <Button
                        onClick={() => setOpenReportModal(true)}
                        sx={{
                          background: 'red',
                          textTransform: 'none',
                          color: '#fff',
                          fontSize: windowWidth < 640 ? '.7rem' : '0.875rem',
                          padding:
                            windowWidth < 440
                              ? '4px 9px'
                              : windowWidth < 640
                              ? '8px 12px'
                              : '15px 25px',
                          '&:hover': {
                            color: 'red',
                            background: '#fff',
                          },
                          borderRadius: '100px',
                        }}
                      >
                        Report
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-primary-50">{user?.bio || publicUser?.bio}</p>
            </div>
            <div className="flex gap-10 max-sm:gap-7 max-mobile:gap-3">
              {userInfo.map(info => (
                <UserStats
                  key={info}
                  info={info}
                  totalFollowers={
                    user?.totalFollowers || publicUser?.totalFollowers
                  }
                  totalFollowing={
                    user?.totalFollowing || publicUser?.totalFollowing
                  }
                  totalRecipes={user?.totalRecipes || publicUser?.totalRecipes}
                />
              ))}
            </div>
          </div>
        </div>
        <hr className="w-1/2 mx-auto max-sm:hidden" />
        {openReportModal && (
          <ReportModal
            openReportModal={openReportModal}
            setOpenReportModal={setOpenReportModal}
            windowWidth={windowWidth}
            reportedUser={publicUser.username}
            reportedUserId={id}
          />
        )}
      </>
    )
  }
}

export default UserInfo
