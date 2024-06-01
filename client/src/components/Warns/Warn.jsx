import {
  useGetAllWarnsByUserIdQuery,
  useUnwarnUserMutation,
} from '../../redux/slices/adminApiSlice'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Pagination, IconButton } from '@mui/material'
import { useState, useEffect } from 'react'
import WarnChoicesModal from '../Modals/WarnChoicesModal'
import { useSelector } from 'react-redux'
import { twarn } from '../../utils/toasts'

const Warn = ({ warnId, userId, warnsIds, index, setIndex }) => {
  const { warn } = useGetAllWarnsByUserIdQuery(
    { userId },
    {
      selectFromResult: ({ data }) => ({
        warn: data?.entities[warnId],
      }),
    }
  )

  const [unwarnUser] = useUnwarnUserMutation()
  const [openChoices, setOpenChoices] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const { _id } = useSelector(state => state.auth.user)

  const handleChange = (event, value) => {
    setIndex(value)
  }

  const deleteWarn = async () => {
    if (!warn?.adminId) {
      twarn("You can't delete a warning given by the owner. Please contact him")
      return
    }
    if (warn.adminId !== _id) {
      twarn(
        "You can't delete a warning given by another admin. Please contact the owner"
      )
      return
    }
    try {
      if (index === warnsIds.length) setIndex(prev => prev - 1)
      if (index === 1 && warnsIds.length > 2) setIndex(prev => prev + 1)
      await unwarnUser({ userId, warnId, index })
    } catch (error) {
      console.log(error)
    }
  }
  const titles = ['User', 'Admin', 'Reason', 'Date']

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (warn)
    return (
      <>
        <div className="flex flex-col  gap-24 pt-5">
          <div className="flex gap-10 max-md:flex-col justify-center w-3/4 max-md:w-full mx-auto">
            {titles.map(title => {
              return (
                <div
                  className={`flex flex-col max-md:flex-row gap-8 justify-center items-center    
                  ${
                    title === 'Admin'
                      ? warn.admin
                        ? 'flex-1'
                        : 'hidden'
                      : 'flex-1'
                  } `}
                  key={title}
                >
                  <p
                    className={`text-2xl text-primary break-words  md:text-center max-md:px-3 font-bold flex-1`}
                  >
                    {title}
                  </p>
                  {title === 'User' && (
                    <p className="text-xl text-primary break-words md:text-center flex-1">
                      {warn.user}
                    </p>
                  )}
                  {title === 'Admin' && (
                    <p className="text-xl text-primary break-words md:text-center flex-1">
                      {warn?.admin}
                    </p>
                  )}
                  {title === 'Reason' && (
                    <p className="text-xl text-primary break-words md:text-center flex-1">
                      {warn.reason}
                    </p>
                  )}
                  {title === 'Date' && (
                    <>
                      <p className="text-xl text-primary break-words md:text-center flex-1">
                        {warn.date}
                      </p>
                    </>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex max-md:flex-col items-center justify-center gap-5">
            <Pagination
              size={windowWidth <= 639 ? 'small' : 'meduim'}
              page={index}
              className={`${warnsIds.length === 1 ? 'hidden' : 'flex'}`}
              onChange={handleChange}
              count={warnsIds.length <= 10 ? warnsIds.length : 10}
            />
            <div className="flex gap-2">
              <IconButton onClick={deleteWarn}>
                <DeleteIcon
                  sx={{
                    fontSize: 25,
                    color: '#898784',
                    ':hover': {
                      color: 'red',
                      cursor: 'pointer',
                      transition: 'color .5s',
                    },
                  }}
                />
              </IconButton>
              <IconButton
                onClick={() => {
                  if (!warn?.adminId) {
                    twarn(
                      "You can't edit a warning given by the owner. Please contact him"
                    )
                    return
                  }
                  if (warn?.adminId !== _id) {
                    twarn(
                      "You can't edit a warning given by another admin. Please contact the owner"
                    )
                    return
                  }

                  setOpenChoices(true)
                }}
              >
                <EditIcon
                  sx={{
                    fontSize: 25,
                    color: '#898784',
                    ':hover': {
                      color: '#333329',
                      cursor: 'pointer',
                      transition: 'color .5s',
                    },
                  }}
                />
              </IconButton>
            </div>
          </div>
        </div>
        {openChoices && (
          <WarnChoicesModal
            openChoices={openChoices}
            setOpenChoices={setOpenChoices}
            warnId={warnId}
            name={warn.user}
            userId={userId}
          />
        )}
      </>
    )
}

export default Warn
