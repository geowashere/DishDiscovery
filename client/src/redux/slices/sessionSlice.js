import { createSlice } from '@reduxjs/toolkit'

const session = createSlice({
  name: 'session',
  initialState: { isExpired: false },
  reducers: {
    removeSession: (state, action) => {
      state.isExpired = true
    },
    resetSession: (state, action) => {
      console.log('resetting sess')
      state.isExpired = false
    },
  },
})

export const { removeSession, resetSession } = session.actions

export const sessionReducer = session.reducer
