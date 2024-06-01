import { createSlice } from '@reduxjs/toolkit'

// Initialize state from localStorage
const initialState = {
  isCollapsed: JSON.parse(localStorage.getItem('collapseStatus')) || false,
  isToggled: JSON.parse(localStorage.getItem('toggleStatus')) || false,
}

const sideBarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSideBarStatus: (state, action) => {
      state.isCollapsed = action.payload
      localStorage.setItem('collapseStatus', JSON.stringify(action.payload))
    },
    toggleSidebar: (state, action) => {
      state.isToggled = action.payload
      localStorage.setItem('toggleStatus', JSON.stringify(action.payload))
    },
    resetSidebar: (state, action) => {
      state.isCollapsed = false
      state.isToggled = false
      localStorage.removeItem('collapseStatus')
      localStorage.removeItem('toggleStatus')
    },
  },
})

export const { setSideBarStatus, toggleSidebar, resetSidebar } =
  sideBarSlice.actions
export const sideBarReducer = sideBarSlice.reducer
