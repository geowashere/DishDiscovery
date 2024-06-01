import { IconButton, Menu, MenuItem } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useDeleteBookMutation,
  useGetBooksQuery,
} from '../../redux/slices/bookApiSlice'
import { useState } from 'react'
import { tsuccess } from '../../utils/toasts'
import ConfirmationModal from '../Modals/ConfirmationModal'

const ProfileBook = ({ bookId }) => {
  const { book } = useGetBooksQuery('booksList', {
    selectFromResult: ({ data }) => ({
      book: data?.entities[bookId],
    }),
  })

  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)

  const [deleteBook] = useDeleteBookMutation()
  const [openConfirm, setOpenConfirm] = useState(false)
  const confirmationMessage = 'Delete your book'

  const handleConfirm = async () => {
    let res
    try {
      res = await deleteBook(bookId).unwrap()
    } catch (error) {
      console.log(error)
    }
    tsuccess(res?.message)
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleOpenModal = () => {
    setAnchorEl(null)
    setOpenConfirm(true)
  }

  if (book) {
    return (
      <>
        <div className="flex flex-col gap-2 w-fit mx-auto">
          <Link to={`/book/${bookId}`}>
            <img
              src={book.image}
              className=" h-[220px] w-full"
              loading="lazy"
            />
          </Link>
          <div className="flex justify-between ">
            <p className="text-primary text-xl">{book.title}</p>
            <IconButton
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreHorizIcon />
            </IconButton>
          </div>
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem
            onClick={() =>
              navigate('/edit-book', {
                state: {
                  history: 'profile-book',
                  book,
                },
              })
            }
          >
            Edit
          </MenuItem>
          <MenuItem sx={{ color: 'red' }} onClick={handleOpenModal}>
            Remove
          </MenuItem>
        </Menu>
        {openConfirm && (
          <ConfirmationModal
            openConfirm={openConfirm}
            setOpenConfirm={setOpenConfirm}
            confirmationMessage={confirmationMessage}
            confirm={handleConfirm}
          />
        )}
      </>
    )
  } else return null
}

const memoizedBook = memo(ProfileBook)

export default memoizedBook
