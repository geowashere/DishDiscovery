import { memo } from 'react'
import { Link } from 'react-router-dom'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp'
import { IconButton } from '@mui/material'
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
} from '../../redux/slices/notificationsApiSlice'

const Notification = ({ notificationId }) => {
  const { notification } = useGetNotificationsQuery('notificationsList', {
    selectFromResult: ({ data }) => ({
      notification: data?.entities[notificationId],
    }),
  })

  const [deleteNotification] = useDeleteNotificationMutation()
  const handleDeleteNotification = async () => {
    try {
      await deleteNotification(notificationId).unwrap()
    } catch (error) {
      console.log(error)
    }
  }

  if (notification) {
    return (
      <>
        <div className="flex justify-between text-primary border-b border-black max-mobile:m-0 ">
          <Link
            to={`/user/${notification.actor}`}
            className="flex items-center gap-2"
          >
            <img
              src={notification.avatar}
              alt="user img"
              className="w-20 h-20 rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-2xl max-mobile:text-[16px]">
                {notification.message}
              </p>
              <small className="text-primary-50">
                {notification.createdAt}
              </small>
            </div>
          </Link>
          {notification.image ? (
            <div className="flex items-center gap-4">
              <Link to={`/recipe/${notification.recipe}`}>
                <img
                  src={notification.image}
                  alt="recipeimg"
                  className="w-20 h-14"
                />
              </Link>
              <IconButton onClick={handleDeleteNotification}>
                <DeleteSharpIcon
                  sx={{
                    fontSize: 25,
                    color: 'black',
                    ':hover': {
                      color: 'red',
                      cursor: 'pointer',
                      transition: 'color .5s',
                    },
                  }}
                />
              </IconButton>
            </div>
          ) : (
            <IconButton onClick={handleDeleteNotification}>
              <DeleteSharpIcon
                sx={{
                  fontSize: 25,
                  color: 'black',
                  ':hover': {
                    color: 'red',
                    cursor: 'pointer',
                    transition: 'color .5s',
                  },
                }}
              />
            </IconButton>
          )}
        </div>
      </>
    )
  } else return null
}

const memoizedNotification = memo(Notification)

export default memoizedNotification
