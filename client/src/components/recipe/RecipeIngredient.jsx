import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IngWhiteIcon from '../../assets/IngWhiteIcon.svg'

const RecipeIngredient = ({ ingredient, index, deleteIngredient }) => {
  const ingElement = `${ingredient.quantity}, ${ingredient.measurementUnit}, ${ingredient.name}`

  return (
    <div className="flex justify-between items-center bg-primary-300 rounded-sm border-primary-50 p-2 border border-1 mt-3 ">
      <div className="flex items-center gap-3 p-2">
        <img src={IngWhiteIcon} className="size-9 rounded-full bg-primary" />
        <p className="text-primary-50">{ingElement.toLowerCase()}</p>
      </div>
      <IconButton onClick={() => deleteIngredient(index)}>
        <CloseIcon />
      </IconButton>
    </div>
  )
}

export default RecipeIngredient
