import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetBooksByUserIdQuery } from '../../redux/slices/bookApiSlice'
import PublicBook from './PublicBook'
import { ScaleLoader } from 'react-spinners'

const PublicBooks = () => {
  const { id } = useParams()
  const {
    data: publicBooks,
    isLoading,
    isSuccess,
  } = useGetBooksByUserIdQuery(id)

  const { ids } = publicBooks || {}
  const displayPublicBooks =
    isSuccess &&
    ids?.length &&
    ids.map(bookId => <PublicBook key={bookId} bookId={bookId} />)

  const displayNoBooks = (
    <p className="text-center text-2xl text-primary">
      User currently has no books.
    </p>
  )

  return isLoading ? (
    <div className="flex justify-center">
      <ScaleLoader size={20} color="#898784" />
    </div>
  ) : ids?.length ? (
    <div className="grid lg:grid-cols-3 mx-auto min-[1660px]:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 gap-10 relative max-sm:overflow-y-auto">
      {displayPublicBooks}
    </div>
  ) : (
    displayNoBooks
  )
}

export default PublicBooks
