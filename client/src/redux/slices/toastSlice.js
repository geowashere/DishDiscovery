import { createSlice } from '@reduxjs/toolkit'

const toast = createSlice({
  name: 'toast',
  initialState: { displayToast: false, message: '' },
  reducers: {
    setToast: (state, action) => {
      const { displayToast, message } = action.payload
      state.displayToast = displayToast
      state.message = message
    },
    resetToast: (state, action) => {
      state.displayToast = false
      state.message = ''
    },
  },
})

export const { setToast, resetToast } = toast.actions

export const toastReducer = toast.reducer
