import { useState } from 'react'
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useNavigate } from 'react-router-dom'
import { memo } from 'react'
import dr from '../../assets/defaultRecipe.jpg'
import PauseIcon from '@mui/icons-material/Pause'
import {
  useDeletePendingRecipeMutation,
  useGetPendingRecipesQuery,
} from '../../redux/slices/recipeApiSlice'
import ConfirmationModal from '../Modals/ConfirmationModal'
import { tsuccess } from '../../utils/toasts'

const PendingRecipe = ({ pendingRecipeId }) => {
  const { pendingRecipe } = useGetPendingRecipesQuery('pendingRecipesList', {
    selectFromResult: ({ data }) => ({
      pendingRecipe: data?.entities[pendingRecipeId],
    }),
  })

  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const [deletePendingRecipe] = useDeletePendingRecipeMutation()
  const [openConfirm, setOpenConfirm] = useState(false)
  const confirmationMessage = 'Delete pending recipe'

  const handleConfirm = async () => {
    try {
      await deletePendingRecipe(pendingRecipeId)
    } catch (error) {
      console.log(error)
    }
    tsuccess('Pending recipe has been deleted!')
  }

  const handleOpenModal = () => {
    setAnchorEl(null)
    setOpenConfirm(true)
  }

  if (pendingRecipe) {
    console.log(pendingRecipe?.image)
    return (
      <>
        <div className="flex flex-col gap-2 w-fit mx-auto">
          <img
            src={pendingRecipe?.image}
            className="h-[220px] w-full"
            loading="lazy"
          />
          <div className="flex justify-between ">
            <p className="text-primary text-xl">{pendingRecipe.title}</p>
            <div className="flex">
              <Tooltip title="This recipe is pending" placement="top-start">
                <IconButton>
                  <PauseIcon />
                </IconButton>
              </Tooltip>

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
              navigate('/edit-recipe', {
                state: {
                  history: 'profile-recipe',
                  pendingRecipe,
                },
              })
            }}
          >
            Edit
          </MenuItem>
          <MenuItem sx={{ color: 'red' }} onClick={handleOpenModal}>
            Remove
          </MenuItem>
        </Menu>
        <ConfirmationModal
          openConfirm={openConfirm}
          setOpenConfirm={setOpenConfirm}
          confirmationMessage={confirmationMessage}
          confirm={handleConfirm}
        />
      </>
    )
  }
}

const memoizedRecipe = memo(PendingRecipe)

export default memoizedRecipe
