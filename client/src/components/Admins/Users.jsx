import { ScaleLoader } from 'react-spinners'
import User from './User'
import { useGetAllUsersQuery } from '../../redux/slices/userApiSlice'

const Users = ({ userValue }) => {
  const {
    data: users,
    isLoading,
    isSuccess,
  } = useGetAllUsersQuery('usersList', {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  const { ids: userIds, entities } = users || {}

  const displayAllUsers =
    isSuccess &&
    userIds?.length &&
    userIds
      .filter(userId => {
        const user = entities[userId]
        return user.username
          .toLowerCase()
          .includes(userValue.trim().toLowerCase())
      })
      .map(userId => <User key={userId} userId={userId} />)

  if (isLoading)
    return (
      <div className="text-center">
        <ScaleLoader size={20} color="#898784" />
      </div>
    )
  if (!isSuccess)
    return <h1 className="text-2xl text-center">Something went wrong</h1>
  return (
    <div>
      {userIds.length !== 0 ? (
        <div className="space-y-5">{displayAllUsers}</div>
      ) : (
        <h1 className="text-center text-2xl text-primary">
          No users at the moment.
        </h1>
      )}
    </div>
  )
}

export default Users
