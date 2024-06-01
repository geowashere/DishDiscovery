import { Button } from '@mui/material'

const Ingredient = ({ ing, onSelectIngredient }) => {
  return (
    <Button
      onClick={() => onSelectIngredient(ing.name)}
      sx={{
        bgcolor: '#333329',
        color: '#fff',
        width: '100%',
        textTransform: 'none',
        justifyContent: 'left',
        padding: '10px',
        zIndex: '3',
        '&:hover': {
          color: '#333329',
          bgcolor: '#fff',
        },
      }}
    >
      {ing.name.toLowerCase()}
    </Button>
  )
}

export default Ingredient
