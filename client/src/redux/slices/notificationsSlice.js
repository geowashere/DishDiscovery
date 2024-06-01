import { createSlice } from '@reduxjs/toolkit'

const unreadNotifications = createSlice({
  name: 'unreadNotifications',
  initialState: { nbOfUnreadNotifs: null },
  reducers: {
    setUnreadNotifications: (state, action) => {
      const { nbOfUnreadNotifs } = action.payload
      state.nbOfUnreadNotifs = nbOfUnreadNotifs
    },
    setMarkAsRead: (state, action) => {
      state.nbOfUnreadNotifs = 0
    },
    revertMarkAsRead: (state, action) => {
      state.nbOfUnreadNotifs = action.payload
    },
  },
})

export const { setUnreadNotifications, setMarkAsRead, revertMarkAsRead } =
  unreadNotifications.actions

export const unreadNotificationsReducer = unreadNotifications.reducer
