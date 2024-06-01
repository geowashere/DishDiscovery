import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import authSlice from './slices/authSlice'
import { unreadNotificationsReducer } from './slices/notificationsSlice'
import { sideBarReducer } from './slices/sideBarSlice'
import { toastReducer } from './slices/toastSlice'
import { isIngredientExistsReducer } from './slices/isIngredientNewSlice'
import { sessionReducer } from './slices/sessionSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    unreadNotifications: unreadNotificationsReducer,
    sideBar: sideBarReducer,
    toast: toastReducer,
    isIngredientExists: isIngredientExistsReducer,
    session: sessionReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
})

setupListeners(store.dispatch)
