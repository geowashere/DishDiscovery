import { useNavigate } from 'react-router-dom'
import {
  useFollowUserMutation,
  useGetAllUsersQuery,
  useUnfollowUserMutation,
} from '../../redux/slices/userApiSlice'
import { Button } from '@mui/material'
import { useState } from 'react'

const SearchUser = ({ userId, setOpenSearch }) => {
  const { user } = useGetAllUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  })

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()

  const handleFollowUser = async () => {
    try {
      setIsLoading(true)
      await followUser(userId)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  const handleUnfollowUser = async () => {
    try {
      setIsLoading(true)
      await unfollowUser(userId)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  if (user && user?.isEmailVerified)
    return (
      <div className="flex items-center justify-between text-primary gap-2">
        <div
          className="flex items-center"
          onClick={() => {
            navigate(`/user/${userId}`)
            setOpenSearch(false)
          }}
        >
          <img
            src={user.avatar}
            alt="user img"
            className="size-12 rounded-full"
          />
          <h2 className="">{user.username}</h2>
          <span>|</span>
          <h3>{user.nbOfFollowers} followers</h3>
        </div>
        <Button
          sx={{
            textTransform: 'none',
            fontSize: '1.20rem',
            lineHeight: '1.75rem',
            p: 1,
            m: 0.5,
            width: 90,
            backgroundColor: '#333329',
            color: '#fff',
            '&:hover': {
              color: '#333329',
              backgroundColor: '#fff',
              outline: '1px solid #333329',
            },
          }}
          disabled={isLoading}
          onClick={user.isFollowing ? handleUnfollowUser : handleFollowUser}
        >
          {user.isFollowing ? 'unfollow' : 'follow'}
        </Button>
      </div>
    )
}

export default SearchUser
