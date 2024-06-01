import { Modal, Fade } from '@mui/material'
import { useGetCheckedBooksQuery } from '../../redux/slices/bookApiSlice'
import AddOrRemoveBook from '../Book/AddOrRemoveBook'
import CloseIcon from '@mui/icons-material/Close'
import { Link } from 'react-router-dom'
import { ScaleLoader } from 'react-spinners'

const AddRecipeToBookModal = ({
  openAddRecipeToBook,
  setOpenAddRecipeToBook,
  recipeId,
}) => {
  const {
    data: books,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCheckedBooksQuery(recipeId, {
    refetchOnMountOrArgChange: true,
  })

  if (isError) return <p>{error}</p>

  const { ids } = books || {}
  const displayBooks =
    isSuccess && ids?.length ? (
      ids.map(bookId => (
        <AddOrRemoveBook key={bookId} bookId={bookId} recipeId={recipeId} />
      ))
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
    )
  return (
    <>
      <Modal
        open={openAddRecipeToBook}
        onClose={() => setOpenAddRecipeToBook(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        slotProps={{ backdrop: { timeout: 1000 } }}
        closeAfterTransition
      >
        <Fade in={openAddRecipeToBook}>
          <div className="w-2/5 h-3/5 relative bg-background rounded-lg pt-3 flex flex-col items-center gap-5 overflow-y-auto modal-scroll-bar max-xl:w-3/4 max-xl:h-3/4  max-sm:w-full max-sm:h-full">
            <h1 className="mx-auto mb-5 text-3xl text-primary">
              Add Recipe To Book
            </h1>
            {isLoading ? (
              <div className="flex justify-center">
                <ScaleLoader size={20} color="#898784" />
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-3/4 font-bold">
                {displayBooks}
              </div>
            )}
            <div
              className="absolute top-0 right-0 p-1"
              onClick={() => setOpenAddRecipeToBook(false)}
            >
              <CloseIcon />
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default AddRecipeToBookModal
