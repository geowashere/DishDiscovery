import React from 'react'
import { useGetAllRecipesQuery } from '../../redux/slices/recipeApiSlice'
import { useNavigate } from 'react-router-dom'

const SearchRecipe = ({ recipeId, setOpenSearch }) => {
  const { recipe } = useGetAllRecipesQuery('recipesList', {
    selectFromResult: ({ data }) => ({
      recipe: data?.entities[recipeId],
    }),
  })

  const navigate = useNavigate()
  const navigateToRecipe = () => {
    navigate(`/recipe/${recipeId}`)
    setOpenSearch(false)
  }

  if (recipe) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-2">
          <h1 className="text-2xl text-primary" onClick={navigateToRecipe}>
            {recipe.title}
          </h1>
          <h2 className="text-2xl text-primary-50">by: {recipe.user}</h2>
        </div>
        <img
          src={recipe.image}
          alt="recipe img"
          className="w-full h-[220px] object-cover"
          onClick={navigateToRecipe}
        />
      </div>
    )
  }
}

export default SearchRecipe
