import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../slices/authSlice'
import { removeSession, resetSession } from '../slices/sessionSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/',
  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.originalStatus === 401) {
    console.log('sending refresh token')
    // send refresh token to get a new access token
    const refreshResult = await baseQuery(
      {
        url: '/users/refresh-token',
        method: 'POST',
        body: { refreshToken: api.getState().auth.refreshToken },
      },
      api,
      extraOptions
    )
    if (refreshResult?.data) {
      const user = api.getState().auth.user

      const { accessToken, refreshToken } = refreshResult.data
      api.dispatch(setCredentials({ accessToken, refreshToken, user }))

      result = await baseQuery(args, api, extraOptions)
    } else {
      console.log('An error occured, please log in again')
      api.dispatch(removeSession())
      // api.dispatch(logOut())
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: builder => ({}),
})
