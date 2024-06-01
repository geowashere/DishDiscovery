import { Modal, Fade } from '@mui/material'
import Follower from '../Profile/Follower'
import CloseIcon from '@mui/icons-material/Close'
import { useGetFollowersListQuery } from '../../redux/slices/userApiSlice'
import { ClipLoader } from 'react-spinners'

const FollowersModal = ({ openFollowers, setOpenFollowers }) => {
  const {
    data: followers,
    isLoading,
    isSuccess,
  } = useGetFollowersListQuery('followersList', {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  const { ids: followersListIds } = followers || {}

  const displayFollowers =
    isSuccess &&
    followersListIds?.length &&
    followersListIds.map(followerId => (
      <Follower key={followerId} followerId={followerId} />
    ))

  return (
    <Modal
      open={openFollowers}
      onClose={() => setOpenFollowers(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={openFollowers}>
        <div className="w-2/5 h-3/5 relative bg-background rounded-lg pt-3 flex flex-col items-center gap-5 overflow-y-auto modal-scroll-bar max-xl:w-3/4 max-xl:h-3/4  max-sm:w-full max-sm:h-full">
          <h1 className="mx-auto text-3xl text-primary">Followers</h1>
          {isLoading ? (
            <ClipLoader size={25} />
          ) : followersListIds.length !== 0 ? (
            displayFollowers
          ) : (
            <h2 className="text-primary text-xl">
              You don't have any followers at the moment.
            </h2>
          )}
          <div
            className="absolute top-0 right-0 p-1"
            onClick={() => setOpenFollowers(false)}
          >
            <CloseIcon />
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default FollowersModal
