import { Link, useParams } from 'react-router-dom'
import { useGetBooksByUserIdQuery } from '../../redux/slices/bookApiSlice'

const PublicBook = ({ bookId }) => {
  const { id } = useParams()
  const { book } = useGetBooksByUserIdQuery(id, {
    selectFromResult: ({ data }) => ({
      book: data?.entities[bookId],
    }),
  })
  if (book) {
    return (
      <div className="flex flex-col gap-2 w-fit mx-auto">
        <Link to={`/book/${bookId}`}>
          <img src={book.image} className=" h-[220px] w-full" loading="lazy" />
        </Link>
        <p className="text-primary text-xl">{book.title}</p>
      </div>
    )
  }
}

export default PublicBook
