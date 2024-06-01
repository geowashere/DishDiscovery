import { Button } from '@mui/material'
import {
  useUnfollowFollowerUserMutation,
  useFollowBackUserMutation,
} from '../../redux/slices/userApiSlice'
import { useGetFollowersListQuery } from '../../redux/slices/userApiSlice'
import { useNavigate } from 'react-router-dom'

const Follower = ({ followerId }) => {
  const { follower } = useGetFollowersListQuery('followersList', {
    selectFromResult: ({ data }) => ({
      follower: data?.entities[followerId],
    }),
  })
  const navigate = useNavigate()

  const [unfollowFollowerUser] = useUnfollowFollowerUserMutation()
  const [followBackUser] = useFollowBackUserMutation()

  const handleClick = async () => {
    if (follower.isFollowingBack) {
      await unfollowFollowerUser(followerId).unwrap()
    } else {
      await followBackUser(followerId).unwrap()
    }
  }
  if (follower) {
    return (
      <>
        <div
          className="flex w-full justify-evenly items-center"
          key={follower._id}
        >
          <div className=" flex w-1/6 items-center gap-3">
            <img
              src={follower.avatar}
              className="w-2/5  object-contain rounded-[50px]"
              onClick={() => navigate(`/user/${followerId}`)}
            />
            <p className="text-primary text-xl">{follower.username}</p>
          </div>
          <Button
            sx={{
              textTransform: 'none',
              fontSize: '1.20rem',
              lineHeight: '1.75rem',
              paddingTop: 1,
              width: 90,
              backgroundColor: '#333329',
              color: '#fff',
              '&:hover': {
                color: '#333329',
                backgroundColor: '#fff',
                outline: '1px solid #333329',
              },
            }}
            onClick={handleClick}
          >
            {follower.isFollowingBack ? 'unfollow' : 'follow'}
          </Button>
        </div>
      </>
    )
  }
}
export default Follower
