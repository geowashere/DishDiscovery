import { Modal, Fade } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Following from '../Profile/Following'
import { ClipLoader } from 'react-spinners'
import { useGetFollowingsListQuery } from '../../redux/slices/userApiSlice'

const FollowingsModal = ({ openFollowings, setOpenFollowings }) => {
  const {
    data: followingsList,
    isLoading,
    isSuccess,
  } = useGetFollowingsListQuery('followingsList', {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  })

  const { ids: followingsListIds } = followingsList || {}

  const displayFollowings =
    isSuccess &&
    followingsListIds?.length &&
    followingsListIds.map(followingId => (
      <Following key={followingId} followingId={followingId} />
    ))

  return (
    <Modal
      open={openFollowings}
      onClose={() => setOpenFollowings(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={openFollowings}>
        <div className="w-2/5 h-3/5 relative bg-background rounded-lg pt-3 flex flex-col items-center gap-5 overflow-y-auto modal-scroll-bar max-xl:w-3/4 max-xl:h-3/4  max-sm:w-full max-sm:h-full">
          <h1 className="mx-auto text-3xl text-primary">Followings</h1>

          {isLoading ? (
            <ClipLoader size={25} />
          ) : followingsListIds?.length !== 0 ? (
            displayFollowings
          ) : (
            <h2 className="text-primary text-xl">
              You aren't following anyone at the moment.
            </h2>
          )}
          <div
            className="absolute top-0 right-0 p-1"
            onClick={() => setOpenFollowings(false)}
          >
            <CloseIcon />
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default FollowingsModal
