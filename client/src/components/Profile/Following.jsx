import { Button } from '@mui/material'
import {
  useGetFollowingsListQuery,
  useUnfollowFollowingUserMutation,
} from '../../redux/slices/userApiSlice'
import { useNavigate } from 'react-router-dom'

const Following = ({ followingId }) => {
  const { following } = useGetFollowingsListQuery('followingsList', {
    selectFromResult: ({ data }) => ({
      following: data?.entities[followingId],
    }),
  })
  const [unfollowFollowingUser] = useUnfollowFollowingUserMutation()
  const navigate = useNavigate()

  const handleUnfollow = async () => {
    await unfollowFollowingUser(followingId).unwrap()
  }
  if (following) {
    return (
      <>
        <div
          className="flex w-full justify-evenly items-center"
          key={following._id}
        >
          <div className=" flex w-1/6 items-center gap-3">
            <img
              src={following.avatar}
              className="w-2/5  object-contain rounded-[50px]"
              onClick={() => navigate(`/user/${followingId}`)}
            />
            <p className="text-primary text-xl">{following.username}</p>
          </div>
          <Button
            sx={{
              textTransform: 'none',
              fontSize: '1.20rem',
              lineHeight: '1.75rem',
              paddingTop: 1,
              backgroundColor: '#333329',
              color: '#fff',
              '&:hover': {
                color: '#333329',
                backgroundColor: '#fff',
                outline: '1px solid #333329',
              },
            }}
            onClick={handleUnfollow}
          >
            unfollow
          </Button>
        </div>
      </>
    )
  }
}
export default Following
