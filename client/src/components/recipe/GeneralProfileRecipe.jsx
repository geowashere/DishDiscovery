import { Link, useParams } from 'react-router-dom'
import { useGetRecipesByUserIdQuery } from '../../redux/slices/recipeApiSlice'
import AddIcon from '@mui/icons-material/Add'
import { IconButton } from '@mui/material'
import { useState } from 'react'
import AddRecipeToBookModal from '../Modals/AddRecipeToBookModal'

const GeneralProfileRecipe = ({ recipeId }) => {
  const { id } = useParams()

  const { recipe } = useGetRecipesByUserIdQuery(id, {
    selectFromResult: ({ data }) => ({
      recipe: data?.entities[recipeId],
    }),
  })

  const [openAddRecipeToBook, setOpenAddRecipeToBook] = useState(false)

  const displayRecipe = recipe && (
    <div className="flex flex-col gap-2 w-fit mx-auto">
      <Link to={`/recipe/${recipeId}`}>
        <img src={recipe.image} className="h-[220px] w-full" loading="lazy" />
      </Link>
      <div className="flex justify-between">
        <p className="text-primary text-xl">{recipe.title}</p>
        <IconButton onClick={() => setOpenAddRecipeToBook(true)}>
          <AddIcon />
        </IconButton>
      </div>
    </div>
  )

  return (
    <>
      {displayRecipe}
      {openAddRecipeToBook && (
        <AddRecipeToBookModal
          openAddRecipeToBook={openAddRecipeToBook}
          setOpenAddRecipeToBook={setOpenAddRecipeToBook}
          recipeId={recipeId}
        />
      )}
    </>
  )
}

export default GeneralProfileRecipe
