import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  useGetCheckedBooksQuery,
  useAddRecipeToBookMutation,
  useRemoveRecipeFromBookMutation,
} from '../../redux/slices/bookApiSlice'
import { Link } from 'react-router-dom'

const AddOrRemoveBook = ({ bookId, recipeId }) => {
  const { checkedBook } = useGetCheckedBooksQuery(recipeId, {
    selectFromResult: ({ data }) => ({
      checkedBook: data?.entities[bookId],
    }),
  })

  const [addRecipeToBook] = useAddRecipeToBookMutation()
  const [removeRecipeFromBook] = useRemoveRecipeFromBookMutation()

  const handleAddRecipeToBook = async () => {
    await addRecipeToBook({ bookId, recipeId }).unwrap()
  }

  const handleRemoveRecipeFromBook = async () => {
    await removeRecipeFromBook({ bookId, recipeId }).unwrap()
  }

  if (checkedBook) {
    return (
      <>
        <div className="flex justify-between">
          <Link to={`/book/${checkedBook.id}`}>
            <h2 className="text-2xl text-primary">{checkedBook.title}</h2>
          </Link>
          {!checkedBook.isInBook ? (
            <IconButton onClick={handleAddRecipeToBook}>
              <AddIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleRemoveRecipeFromBook}>
              <RemoveIcon />
            </IconButton>
          )}
        </div>
      </>
    )
  }
}

export default AddOrRemoveBook
