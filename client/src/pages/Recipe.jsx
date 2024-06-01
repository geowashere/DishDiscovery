import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { useGetRecipeQuery } from '../redux/slices/recipeApiSlice'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import { Divider } from '@mui/material'
import { ScaleLoader } from 'react-spinners'

const Recipe = () => {
  const { recipeId } = useParams()
  const { isLoading, data, isSuccess } = useGetRecipeQuery(recipeId, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })
  const [details, setDetails] = useState([])
  const ingredients = !isLoading ? data?.ingredients : null
  const recipe = !isLoading ? data?.recipe : null

  useEffect(() => {
    if (!isLoading && data) {
      setDetails([
        { label: 'Type', info: recipe.type },
        { label: 'Difficulty', info: recipe.difficulty },
        { label: 'Cooking Time', info: recipe.cookingTime },
        { label: 'Culture', info: recipe.culture },
        { label: 'Servings', info: recipe.servings },
      ])
    }
  }, [data, isLoading])

  const displayDetails = (
    <>
      {details.map((detail, index) => {
        return (
          <div className="flex flex-col gap-2" key={index}>
            <p className="text-xl text-primary">{detail.label}</p>
            <p className="text-primary-50">{detail.info}</p>
          </div>
        )
      })}
    </>
  )

  return (
    <div className="bg-background max-h-screen  w-full overflow-hidden flex flex-col pl-2 pt-3 gap-10">
      {isLoading && (
        <div className="flex h-full justify-center items-center">
          <ScaleLoader size={20} color="#898784" />
        </div>
      )}
      {isSuccess && (
        <>
          <div className="w-full h-1/2 flex">
            <img src={recipe?.image} className="w-1/3 object-cover" />
            <div className="flex flex-col w-full gap-7 items-center">
              <h1 className="mx-auto text-primary text-3xl">{recipe?.title}</h1>
              <div className="flex justify-evenly w-full max-md:hidden">
                {displayDetails}
              </div>
              <p className="text-primary text-center">{recipe?.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-evenly md:hidden">
            {displayDetails}
          </div>
          <hr className="w-3/4 mx-auto border-black -mt-5 md:hidden" />
          <div className="flex  max-lg:flex-col-reverse p-2 w-full  gap-10 grow h-1/2  overflow-y-auto scroll-bar justify-around sm:px-10">
            <div className="flex flex-col gap-6  w-full">
              <h1 className="text-primary text-3xl mx-auto">Steps</h1>
              <div className="flex flex-col gap-5">
                {recipe?.directions.map((element, index) => (
                  <div key={index} className="flex justify-end gap-2">
                    <p className="text-primary-50" style={{ direction: 'ltr' }}>
                      {element}
                    </p>
                    <AssignmentOutlinedIcon />
                  </div>
                ))}
              </div>
            </div>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              className="max-md:hidden"
            />
            <div className="flex flex-col gap-7 w-full">
              <h1 className="text-primary text-3xl mx-auto">Ingredients</h1>
              {ingredients?.map((ingredient, index) => {
                return (
                  <div
                    key={index}
                    className="flex sm:justify-between max-sm:flex-col-reverse max-sm:gap-4"
                  >
                    <div className="flex gap-3 items-center justify-end max-sm:justify-end max-sm:w-full w-1/3">
                      <p className="text-primary-50 text-left text-xl break-all max-sm:text-base">
                        {ingredient.measurementUnit}
                      </p>
                      <p className="text-primary-50 text-left text-xl max-sm:text-base">
                        {ingredient.quantity}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center justify-end">
                      <p className="text-primary-50 text-left text-xl break-all  max-sm:text-sm">
                        {ingredient.name}
                      </p>
                      <ShoppingBagOutlinedIcon />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Recipe
