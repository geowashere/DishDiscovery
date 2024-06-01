import StepWhiteIcon from '../../assets/StepWhiteIcon.svg'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'

const RecipeDirection = ({ direction, index, deleteDirection }) => {
  return (
    <div className="flex justify-between bg-primary-300 rounded-sm border-primary-50 p-2 border border-1 mt-3 items-center">
      <div className="flex items-center gap-2">
        <img
          src={StepWhiteIcon}
          className="svg rounded-full bg-primary"
          alt="Step Icon"
        />
        <p className="text-primary-50 p-[10px] text-[17px]">{direction}</p>
      </div>
      <IconButton onClick={() => deleteDirection(index)}>
        <CloseIcon />
      </IconButton>
    </div>
  )
}

export default RecipeDirection
