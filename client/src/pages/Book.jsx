import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useGetBookQuery } from '../redux/slices/bookApiSlice'
import BookRecipe from '../components/recipe/BookRecipe'
import { Divider } from '@mui/material'

const Book = () => {
  const { bookId } = useParams()

  const { data, isSuccess } = useGetBookQuery(bookId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  })

  if (isSuccess) {
    const { book, bookRecipes } = data
    const { ids } = bookRecipes

    const displayBookRecipes =
      ids?.length &&
      ids.map(recipeId => (
        <BookRecipe
          key={recipeId}
          recipeId={recipeId}
          bookId={book._id}
          bookUser={book.user}
        />
      ))

    return (
      <>
        <div className="flex max-md:flex-col max-md:items-center max-md:w-full">
          <div className="flex flex-col justify-center p-10 gap-8">
            <img
              src={book.image}
              alt="book img"
              className="size-80 max-md:block max-md:w-full max-md:object-cover"
              loading="lazy"
            />
            <h1 className="text-2xl text-primary">{book.title}</h1>
            <p className="text-primary-50">{book.description}</p>
          </div>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ '& .MuiDivider-fullWidth': { height: '' } }}
            className="max-md:hidden"
          />
          <hr className="max-md:w-1/2 max-md:border-black max-md:border-t-2" />
          <div className="grid place-content-center h-screen lg:grid-cols-2 md:grid-cols-1 gap-x-5 gap-y-5 overflow-y-scroll max-md:w-3/4 max-md:overflow-y-visible max-md:h-fit mx-auto p-6">
            {displayBookRecipes.length ? (
              displayBookRecipes
            ) : (
              <Link to="/home">
                <p className="text-primary-50 cursor-pointer">
                  Browse Recipes!
                </p>
              </Link>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default Book
