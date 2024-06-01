import { useGetAllUsersQuery } from '../../redux/slices/userApiSlice'
import SearchUser from './SearchUser'
import { ScaleLoader } from 'react-spinners'

const SearchUsers = ({ searchValue, setOpenSearch }) => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllUsersQuery('usersList')

  if (isError) return <p>{error}</p>

  const { ids: userIds, entities } = users || {}

  const displayAllUsers =
    isSuccess &&
    userIds?.length &&
    userIds
      .filter(userId => {
        const user = entities[userId]
        return user.username
          .toLowerCase()
          .includes(searchValue.toLowerCase().trim())
      })
      .map(userId => (
        <SearchUser
          key={userId}
          userId={userId}
          setOpenSearch={setOpenSearch}
        />
      ))

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <ScaleLoader size={25} />
        </div>
      ) : displayAllUsers.length ? (
        displayAllUsers
      ) : (
        'No users found with this username'
      )}
    </>
  )
}

export default SearchUsers
