import { useState } from 'react'
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Link, useNavigate } from 'react-router-dom'
import { memo } from 'react'
import {
  useDeleteRecipeMutation,
  useGetRecipesQuery,
  useToggleStatusMutation,
} from '../../redux/slices/recipeApiSlice'
import AddRecipeToBookModal from '../Modals/AddRecipeToBookModal'
import LockIcon from '@mui/icons-material/Lock'
import ConfirmationModal from '../Modals/ConfirmationModal'
import { tsuccess } from '../../utils/toasts'
import CaptionModal from '../Modals/CaptionModal'
import StatusCaptionModal from '../Modals/StatusCaptionModal'

const ProfileRecipe = ({ myRecipeId, postsFilter }) => {
  const navigate = useNavigate()

  const { myRecipe } = useGetRecipesQuery('myRecipesList', {
    selectFromResult: ({ data }) => ({
      myRecipe: data?.entities[myRecipeId],
    }),
  })

  const [anchorEl, setAnchorEl] = useState(null)

  const [openAddRecipeToBook, setOpenAddRecipeToBook] = useState(false)

  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const [openConfirm, setOpenConfirm] = useState(false)
  const [openConfirmStatus, setOpenConfirmStatus] = useState(false)
  const [openCaption, setOpenCaption] = useState(false)

  const confirmationMessage = 'Delete your recipe'
  const confirmToggleStatusMessage = `Change recipe status to ${
    myRecipe?.status === 'private' ? 'public' : 'private'
  }`

  const [deleteRecipe] = useDeleteRecipeMutation()

  const handleConfirm = async () => {
    let res
    try {
      res = await deleteRecipe(myRecipeId).unwrap()
    } catch (error) {
      console.log(error)
    }
    tsuccess(res?.message)
  }

  const handleOpenModal = () => {
    setAnchorEl(null)
    setOpenConfirm(true)
  }

  const handleOpenStatusModal = () => {
    setAnchorEl(null)
    setOpenConfirmStatus(true)
  }

  const displayMyRecipe = myRecipe && (
    <div className="flex flex-col gap-2 w-fit mx-auto">
      <Link to={`/recipe/${myRecipeId}`}>
        <img src={myRecipe.image} className="h-[220px] w-full" loading="lazy" />
      </Link>
      <div className="flex justify-between ">
        <p className="text-primary text-xl break-all">{myRecipe.title}</p>
        <div className="flex">
          {myRecipe.status === 'private' && (
            <Tooltip title="This recipe is private" placement="top-start">
              <IconButton>
                <LockIcon />
              </IconButton>
            </Tooltip>
          )}
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
    </div>
  )

  if (myRecipe) {
    return (
      <>
        {postsFilter === 'all' && displayMyRecipe}
        {postsFilter === 'private' &&
          myRecipe.status === 'private' &&
          displayMyRecipe}
        {postsFilter === 'public' &&
          myRecipe.status === 'public' &&
          displayMyRecipe}
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
            onClick={() => {
              console.log('navigate')
              navigate('/edit-recipe', {
                state: {
                  history: 'profile-recipe',
                  myRecipe,
                },
              })
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              setOpenAddRecipeToBook(true)
            }}
          >
            Add To Book
          </MenuItem>
          <MenuItem onClick={handleOpenStatusModal}>
            {myRecipe.status === 'private'
              ? 'Publish your recipe'
              : 'Make it private'}
          </MenuItem>
          <MenuItem sx={{ color: 'red' }} onClick={handleOpenModal}>
            Remove
          </MenuItem>
        </Menu>
        {openAddRecipeToBook && (
          <AddRecipeToBookModal
            openAddRecipeToBook={openAddRecipeToBook}
            setOpenAddRecipeToBook={setOpenAddRecipeToBook}
            recipeId={myRecipeId}
          />
        )}
        {openConfirm && (
          <ConfirmationModal
            openConfirm={openConfirm}
            setOpenConfirm={setOpenConfirm}
            confirmationMessage={confirmationMessage}
            confirm={handleConfirm}
          />
        )}
        {openConfirmStatus && (
          <ConfirmationModal
            openConfirm={openConfirmStatus}
            setOpenConfirm={setOpenConfirmStatus}
            confirmationMessage={confirmToggleStatusMessage}
            confirm={() => setOpenCaption(true)}
          />
        )}
        {openCaption && myRecipe && (
          <StatusCaptionModal
            openCaption={openCaption}
            setOpenCaption={setOpenCaption}
            myRecipe={myRecipe}
            myRecipeId={myRecipeId}
          />
        )}
      </>
    )
  }
}

const memoizedRecipe = memo(ProfileRecipe)

export default memoizedRecipe
