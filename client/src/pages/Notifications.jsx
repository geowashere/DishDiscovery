import Notification from '../components/Notification/Notification'
import { useGetNotificationsQuery } from '../redux/slices/notificationsApiSlice'
import { ScaleLoader } from 'react-spinners'

const Notifications = () => {
  const {
    data: notifications,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotificationsQuery('notificationsList', {
    refetchOnMountOrArgChange: true,
  })

  if (isError) return <p>{error}</p>
  const { ids } = notifications || {}

  const displayNotifications =
    isSuccess &&
    ids?.length &&
    ids.map(notificationId => (
      <Notification key={notificationId} notificationId={notificationId} />
    ))
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-3xl text-primary p-10 max-xl:p-8 max-xl:ml-5 font-bold">
        Notifications
      </h1>
      <div className="grow flex flex-col items-start gap-6 max-xl:items-start sm:p-14">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ScaleLoader size={20} />
          </div>
        ) : displayNotifications.length ? (
          displayNotifications
        ) : (
          <p className="text-center text-2xl text-primary max-xl:p-6">
            You don't have any notifications.
          </p>
        )}
      </div>
    </div>
  )
}

export default Notifications
