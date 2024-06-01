import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {},
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.user = user

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userInfo', JSON.stringify(user))
    },
    updateCredentials: (state, action) => {
      const { updatedUser } = action.payload
      state.user = updatedUser
      localStorage.setItem('userInfo', JSON.stringify(updatedUser))
    },
    changeFollowingsNb: (state, action) => {
      state.user.totalFollowing += action.payload
    },
    logOut: (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.user = {}

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
    },
  },
})

export const { setCredentials, updateCredentials, logOut, changeFollowingsNb } =
  authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = state => state.auth.accessToken
export const selectCurrentUser = state => state.auth.user

export const selectNotificationPreference = type => state =>
  state.auth.user.notificationPreferences[type]
