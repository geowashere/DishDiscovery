import { apiSlice } from '../api/apiSlice'
import { logOut, setCredentials } from './authSlice'

const USERS_URL = '/users'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(logOut())
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState())
          }, 1000)
        } catch (error) {
          console.log('onQueryStarted logout: ' + error)
        }
      },
    }),
    refresh: builder.mutation({
      query: refreshToken => ({
        url: `${USERS_URL}/refresh-token`,
        method: 'POST',
        body: { refreshToken },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          console.log(data)
          const { accessToken, refreshToken } = data
          dispatch(setCredentials({ accessToken, refreshToken }))
        } catch (error) {
          console.log('onQueryStarted refresh: ' + error)
        }
      },
    }),
    verifiedEmail: builder.query({
      query: ({ code, email }) => ({
        url: `${USERS_URL}/email-verify?code=${code}&email=${email}`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useVerifiedEmailQuery,
} = authApiSlice

function getToken() {
  return localStorage.getItem('accessToken')
}
