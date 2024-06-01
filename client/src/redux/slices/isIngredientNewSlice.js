import { createSlice } from '@reduxjs/toolkit'

const isIngredientExists = createSlice({
  name: 'isIngredientExists',
  initialState: {
    exists: false,
  },
  reducers: {
    setIsIngredientExists: (state, action) => {
      state.exists = action.payload
    },
  },
})

export const { setIsIngredientExists } = isIngredientExists.actions

export const isIngredientExistsReducer = isIngredientExists.reducer
