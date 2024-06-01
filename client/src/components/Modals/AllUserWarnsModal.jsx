import { Fade, Modal } from '@mui/material'
import { useGetAllWarnsByUserIdQuery } from '../../redux/slices/adminApiSlice'
import { ScaleLoader } from 'react-spinners'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import Warn from '../Warns/Warn'
import { memo } from 'react'

const AllUserWarnsModal = ({ openAllWarns, setOpenAllWarns, userId }) => {
  const [index, setIndex] = useState(1)

  const {
    data: warns,
    isLoading,
    isSuccess,
  } = useGetAllWarnsByUserIdQuery(
    { userId },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  )

  const { ids: warnsIds, entities } = warns || {}

  const getWarnId = () => {
    for (const entity in entities) {
      if (entities[entity].index === index) {
        return entity
      }
    }
  }

  return (
    <Modal
      open={openAllWarns}
      onClose={() => setOpenAllWarns(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{ backdrop: { timeout: 1000 } }}
      closeAfterTransition
    >
      <Fade in={openAllWarns}>
        <div className="bg-background w-3/5 h-1/2 rounded-lg relative p-2 modal-scroll-bar overflow-auto max-xl:w-3/4 max-xl:h-3/4  max-md:w-full max-md:h-full">
          {isLoading && (
            <div className="text-center">
              <ScaleLoader size={20} color="#898784" />
            </div>
          )}
          {!isLoading && !isSuccess && (
            <h1 className="text-3xl text-primary text-center">
              Something went wrong
            </h1>
          )}
          {!isLoading && (
            <>
              {warnsIds.length !== 0 ? (
                <Warn
                  warnId={getWarnId()}
                  userId={userId}
                  warnsIds={warnsIds}
                  index={index}
                  setIndex={setIndex}
                />
              ) : (
                <h1 className="text-3xl text-center text-primary pt-5">
                  No Warns right now
                </h1>
              )}
            </>
          )}
          <div
            className="absolute top-0 right-0 p-2 hover:text-white hover:bg-primary hover:rounded-tr-lg"
            onClick={() => setOpenAllWarns(false)}
          >
            <CloseIcon />
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

const memoizedWarnsModal = memo(AllUserWarnsModal)

export default memoizedWarnsModal
