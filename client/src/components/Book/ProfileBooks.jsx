import ProfileBook from './ProfileBook'
import { useGetBooksQuery } from '../../redux/slices/bookApiSlice'
import { Link } from 'react-router-dom'
import { ScaleLoader } from 'react-spinners'

const ProfileBooks = () => {
  const {
    data: books,
    isLoading: isGetBooksLoading,
    isSuccess: isGetBooksSuccess,
  } = useGetBooksQuery('booksList', {
    refetchOnMountOrArgChange: true,
  })

  const { ids } = books || {}

  const displayBooks =
    isGetBooksSuccess &&
    ids?.length &&
    ids.map(bookId => <ProfileBook key={bookId} bookId={bookId} />)

  return (
    <>
      {isGetBooksLoading ? (
        <div className="flex justify-center">
          <ScaleLoader size={20} color="#898784" />
        </div>
      ) : ids?.length !== 0 ? (
        <div className="grid lg:grid-cols-3 mx-auto min-[1660px]:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 gap-10 relative max-sm:overflow-y-auto">
          {displayBooks}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-2xl text-primary">
            You currently have no books.
          </p>
          <Link
            to="/create-book"
            className="text-primary-50 hover:text-primary transition-[color] delay-100"
          >
            Create Book
          </Link>
        </div>
      )}
    </>
  )
}

export default ProfileBooks
