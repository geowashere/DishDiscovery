import { apiSlice } from '../api/apiSlice'
import { createEntityAdapter } from '@reduxjs/toolkit'
import { updateCredentials, changeFollowingsNb } from './authSlice'

const followingsListAdapter = createEntityAdapter({})
const followersListAdapter = createEntityAdapter({})
const usersListAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 1,
})
const USERS_URL = '/users'

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUser: builder.query({
      query: () => ({
        url: `${USERS_URL}/user`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      providesTags: ['User'],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data: updatedUser } = await queryFulfilled
        dispatch(updateCredentials({ updatedUser }))
      },
    }),
    updateUser: builder.mutation({
      query: newUserData => ({
        url: `${USERS_URL}/user`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: newUserData,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
    getPublicUser: builder.query({
      query: id => ({
        url: `${USERS_URL}/public-users/${id}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      providesTags: [{ type: 'PublicUser' }],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}/public-users`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        return usersListAdapter.setAll(
          usersListAdapter.getInitialState(),
          responseData
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'User', id })),
          ]
        } else return [{ type: 'User', id: 'LIST' }]
      },
    }),
    getFollowingsList: builder.query({
      query: () => ({
        url: `${USERS_URL}/following`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        const loadedFollowings = responseData.map(following => {
          following.id = following._id
          return following
        })

        return followingsListAdapter.setAll(
          followingsListAdapter.getInitialState(),
          loadedFollowings
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Following', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Following', id })),
          ]
        } else return [{ type: 'Following', id: 'LIST' }]
      },
    }),
    getFollowersList: builder.query({
      query: () => ({
        url: `${USERS_URL}/followers`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        const loadedFollowers = responseData.map(follower => {
          follower.id = follower._id
          return follower
        })
        return followersListAdapter.setAll(
          followersListAdapter.getInitialState(),
          loadedFollowers
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Follower', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Follower', id })),
          ]
        } else return [{ type: 'Follower', id: 'LIST' }]
      },
    }),
    getAllUsernames: builder.query({
      query: () => ({
        url: `${USERS_URL}/usernames`,
        method: 'GET',
      }),
    }),
    unfollowFollowingUser: builder.mutation({
      query: toUnfollowId => ({
        url: `${USERS_URL}/user/${toUnfollowId}/unfollow`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        { type: 'Following', id: 'LIST' },
        { type: 'Follower', id: 'LIST' },
        { type: 'User' },
      ],
      onQueryStarted: async (toUnfollowId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          userApiSlice.util.updateQueryData(
            'getFollowingsList',
            'followingsList',
            draft => {
              const following = draft?.entities[toUnfollowId]
              if (following) {
                delete draft.entities[toUnfollowId]
                dispatch(changeFollowingsNb(-1))
              }
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
        }
      },
    }),
    unfollowFollowerUser: builder.mutation({
      query: toUnfollowId => ({
        url: `${USERS_URL}/user/${toUnfollowId}/unfollow`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        { type: 'Following', id: 'LIST' },
        { type: 'Follower', id: 'LIST' },
        { type: 'User' },
      ],
      onQueryStarted: async (toUnfollowId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          userApiSlice.util.updateQueryData(
            'getFollowersList',
            'followersList',
            draft => {
              const userToUnfollow = draft.entities[toUnfollowId]
              if (userToUnfollow) {
                userToUnfollow.isFollowingBack = false
              }
            }
          )
        )
        try {
          await queryFulfilled
          dispatch(changeFollowingsNb(-1))
        } catch (error) {
          patchResult.undo()
        }
      },
    }),
    followUser: builder.mutation({
      query: toFollowId => ({
        url: `${USERS_URL}/user/${toFollowId}/follow`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'PublicUser' }],
      onQueryStarted: async (toFollowId, { dispatch, queryFulfilled }) => {
        dispatch(changeFollowingsNb(1))
        const patchResult1 = dispatch(
          userApiSlice.util.updateQueryData(
            'getAllUsers',
            'usersList',
            draft => {
              const user = draft.entities[toFollowId]
              if (user) user.isFollowing = true
            }
          )
        )
        const patchResult2 = dispatch(
          userApiSlice.util.updateQueryData(
            'getPublicUser',
            toFollowId,
            draft => {
              draft.relationshipExists = true
            }
          )
        )

        try {
          await queryFulfilled
        } catch (error) {
          console.error(error)
          patchResult1.undo()
          patchResult2.undo()
        }
      },
    }),
    unfollowUser: builder.mutation({
      query: toUnfollowId => ({
        url: `${USERS_URL}/user/${toUnfollowId}/unfollow`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
      onQueryStarted: async (toUnfollowId, { dispatch, queryFulfilled }) => {
        dispatch(changeFollowingsNb(-1))
        const patchResult1 = dispatch(
          userApiSlice.util.updateQueryData(
            'getAllUsers',
            'usersList',
            draft => {
              const user = draft.entities[toUnfollowId]
              if (user) user.isFollowing = false
            }
          )
        )
        const patchResult2 = dispatch(
          userApiSlice.util.updateQueryData(
            'getPublicUser',
            toUnfollowId,
            draft => {
              draft.relationshipExists = false
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.error(error)
          patchResult1.undo()
          patchResult2.undo()
        }
      },
    }),
    followBackUser: builder.mutation({
      query: toFollowId => ({
        url: `${USERS_URL}/user/${toFollowId}/follow`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        { type: 'Following', id: 'LIST' },
        { type: 'Follower', id: 'LIST' },
        { type: 'User' },
      ],
      onQueryStarted: async (toFollowId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          userApiSlice.util.updateQueryData(
            'getFollowersList',
            'followersList',
            draft => {
              const userToFollow = draft.entities[toFollowId]
              if (userToFollow) {
                userToFollow.isFollowingBack = true
              }
            }
          )
        )
        try {
          await queryFulfilled
          dispatch(changeFollowingsNb(+1))
        } catch (error) {
          patchResult.undo()
        }
      },
    }),
    registerUser: builder.mutation({
      query: data => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
    changeNotificationPreference: builder.mutation({
      query: preferenceData => ({
        url: `${USERS_URL}/user/notification-preferences`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: preferenceData,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
        invalidatesTags: [{ type: 'Notification', id: 'LIST' }, 'User'],
      }),
    }),
    changePassword: builder.mutation({
      query: passwordData => ({
        url: `${USERS_URL}/user/change-password`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: passwordData,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
    sendResetPasswordEmail: builder.mutation({
      query: resetPasswordEmail => ({
        url: `${USERS_URL}/forgot-password`,
        method: 'POST',
        body: resetPasswordEmail,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: resetPasswordData => ({
        url: `${USERS_URL}/reset-password`,
        method: 'PATCH',
        body: resetPasswordData,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/user`,
        method: 'DELETE',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
    addSuggestion: builder.mutation({
      query: ({ content }) => ({
        url: `${USERS_URL}/suggestion`,
        method: 'POST',
        body: { content },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
    reportUser: builder.mutation({
      query: ({ type, description, reportedUserId }) => ({
        url: `${USERS_URL}/create-report/${reportedUserId}`,
        method: 'POST',
        body: { description, type },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
  }),
})

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useGetPublicUserQuery,
  useGetAllUsersQuery,
  useGetFollowingsListQuery,
  useGetAllUsernamesQuery,
  useUnfollowFollowingUserMutation,
  useChangeNotificationPreferenceMutation,
  useChangePasswordMutation,
  useRegisterUserMutation,
  useGetFollowersListQuery,
  useUnfollowFollowerUserMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useFollowBackUserMutation,
  useSendResetPasswordEmailMutation,
  useResetPasswordMutation,
  useDeleteAccountMutation,
  useAddSuggestionMutation,
  useReportUserMutation,
} = userApiSlice

function getToken() {
  return localStorage.getItem('accessToken')
}
