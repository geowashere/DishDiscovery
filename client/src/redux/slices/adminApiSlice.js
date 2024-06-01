import { apiSlice } from '../api/apiSlice'
import { createEntityAdapter, nanoid } from '@reduxjs/toolkit'
import { userApiSlice } from './userApiSlice'

const ADMIN_URL = '/admins'
const userWarnsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return -1
  },
})
const userReportsAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})
const suggestionsAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})

function getToken() {
  return localStorage.getItem('accessToken')
}

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllWarnsByUserId: builder.query({
      query: ({ userId }) => ({
        url: `${ADMIN_URL}/warns/${userId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        return userWarnsAdapter.setAll(
          userWarnsAdapter.getInitialState(),
          responseData
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Warn', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Warn', id })),
          ]
        } else return [{ type: 'Warn', id: 'LIST' }]
      },
    }),
    unwarnUser: builder.mutation({
      query: ({ userId, warnId }) => ({
        url: `${ADMIN_URL}/${warnId}/unwarn/${userId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'Warn',
          id: 'List',
        },
      ],
      onQueryStarted: async (
        { userId, warnId, index },
        { dispatch, queryFulfilled }
      ) => {
        const deleteResult = dispatch(
          adminApiSlice.util.updateQueryData(
            'getAllWarnsByUserId',
            { userId },
            draft => {
              const warn = draft.entities[warnId]
              if (warn) {
                delete draft.entities[warnId]
                draft.ids = draft.ids.filter(id => id !== warnId)
              }

              for (const entity in draft.entities) {
                if (draft.entities[entity].index > index) {
                  draft.entities[entity].index--
                }
              }
            }
          )
        )
        const decrementNbOfWarns = dispatch(
          userApiSlice.util.updateQueryData(
            'getAllUsers',
            'usersList',
            draft => {
              draft.entities[userId].nbOfWarns--
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.log(error)
          deleteResult.undo()
          decrementNbOfWarns.undo()
        }
      },
    }),
    warnUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `${ADMIN_URL}/warn/${userId}`,
        method: 'POST',
        body: { reason },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'User',
          id: 'List',
        },
        {
          type: 'Warn',
          id: 'List',
        },
      ],
      onQueryStarted: async ({ userId }, { dispatch, queryFulfilled }) => {
        const tempId = nanoid()
        const warnResult = dispatch(
          userApiSlice.util.updateQueryData(
            'getAllUsers',
            'usersList',
            draft => {
              draft.entities[userId].nbOfWarns++
            }
          )
        )
        const addWarn = dispatch(
          adminApiSlice.util.updateQueryData(
            'getAllWarnsByUserId',
            { userId },
            draft => {
              draft.entities[tempId] = {
                id: tempId,
              }
              draft.ids.push(tempId)
            }
          )
        )
        try {
          const {
            data: { newWarn },
          } = await queryFulfilled

          dispatch(
            adminApiSlice.util.updateQueryData(
              'getAllWarnsByUserId',
              { userId },
              draft => {
                delete draft.entities[tempId]
                draft.ids = draft.ids.filter(id => id !== tempId)
                draft.entities[newWarn._id] = newWarn
                draft.ids.push(newWarn._id)
              }
            )
          )
        } catch (error) {
          warnResult.undo()
          addWarn.undo()
        }
      },
    }),
    updateWarn: builder.mutation({
      query: ({ warnId, updatedReason }) => ({
        url: `${ADMIN_URL}/warn/${warnId}/update`,
        method: 'PATCH',
        body: { updatedReason },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'Warn',
          id: 'List',
        },
      ],
      onQueryStarted: async (
        { updatedReason, warnId, userId },
        { dispatch, queryFulfilled }
      ) => {
        const updateResult = dispatch(
          adminApiSlice.util.updateQueryData(
            'getAllWarnsByUserId',
            { userId },
            draft => {
              draft.entities[warnId].reason = updatedReason
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.log(error)
          updateResult.undo()
        }
      },
    }),
    getAllReports: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/reports`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        return userReportsAdapter.setAll(
          userReportsAdapter.getInitialState(),
          responseData
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Report', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Report', id })),
          ]
        } else return [{ type: 'Report', id: 'LIST' }]
      },
    }),
    closeReport: builder.mutation({
      query: ({ reportId }) => ({
        url: `${ADMIN_URL}/report/${reportId}/close`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'Report',
          id: 'List',
        },
      ],
      onQueryStarted: async (
        { reportId, adminName },
        { dispatch, queryFulfilled }
      ) => {
        const closeResult = dispatch(
          adminApiSlice.util.updateQueryData(
            'getAllReports',
            'reportsList',
            draft => {
              draft.entities[reportId].isClosed = true
              draft.entities[reportId].closedBy = adminName
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.log(error)
          closeResult.undo()
        }
      },
    }),
    deleteReport: builder.mutation({
      query: ({ reportId }) => ({
        url: `${ADMIN_URL}/report/${reportId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'Report',
          id: 'List',
        },
      ],
      onQueryStarted: async ({ reportId }, { dispatch, queryFulfilled }) => {
        const deleteResult = dispatch(
          adminApiSlice.util.updateQueryData(
            'getAllReports',
            'reportsList',
            draft => {
              delete draft.entities[reportId]
              draft.ids = draft.ids.filter(id => id !== reportId)
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.log(error)
          deleteResult.undo()
        }
      },
    }),
    getAllSuggestions: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/suggestions`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        return suggestionsAdapter.setAll(
          suggestionsAdapter.getInitialState(),
          responseData
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Suggestion', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Suggestion', id })),
          ]
        } else return [{ type: 'Suggestion', id: 'LIST' }]
      },
    }),
    checkSuggestion: builder.mutation({
      query: ({ suggestionId }) => ({
        url: `${ADMIN_URL}/suggestion/${suggestionId}/check`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'Suggestion',
          id: 'List',
        },
      ],
      onQueryStarted: async (
        { suggestionId },
        { dispatch, queryFulfilled }
      ) => {
        const checkResult = dispatch(
          adminApiSlice.util.updateQueryData(
            'getAllSuggestions',
            'suggestionsList',
            draft => {
              draft.entities[suggestionId].isAccepted = true
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.error(error)
          checkResult.undo()
        }
      },
    }),
    unCheckSuggestion: builder.mutation({
      query: ({ suggestionId }) => ({
        url: `${ADMIN_URL}/suggestion/${suggestionId}/uncheck`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'Suggestion',
          id: 'List',
        },
      ],
      onQueryStarted: async (
        { suggestionId },
        { dispatch, queryFulfilled }
      ) => {
        const checkResult = dispatch(
          adminApiSlice.util.updateQueryData(
            'getAllSuggestions',
            'suggestionsList',
            draft => {
              draft.entities[suggestionId].isAccepted = false
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.error(error)
          checkResult.undo()
        }
      },
    }),
    deleteSuggestion: builder.mutation({
      query: ({ suggestionId }) => ({
        url: `${ADMIN_URL}/suggestion/${suggestionId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'Suggestion',
          id: 'List',
        },
      ],
      onQueryStarted: async (
        { suggestionId },
        { dispatch, queryFulfilled }
      ) => {
        const deleteResult = dispatch(
          adminApiSlice.util.updateQueryData(
            'getAllSuggestions',
            'suggestionsList',
            draft => {
              delete draft.entities[suggestionId]
              draft.ids = draft.ids.filter(id => id !== suggestionId)
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.error(error)
          deleteResult.undo()
        }
      },
    }),
    banUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `${ADMIN_URL}/ban/${userId}`,
        method: 'POST',
        body: { reason },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'User',
          id: 'List',
        },
      ],
      onQueryStarted: async ({ userId }, { dispatch, queryFulfilled }) => {
        const banResult = dispatch(
          userApiSlice.util.updateQueryData(
            'getAllUsers',
            'usersList',
            draft => {
              draft.entities[userId].isBanned = true
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          banResult.undo()
        }
      },
    }),
    getBanByUserId: builder.query({
      query: ({ userId }) => ({
        url: `${ADMIN_URL}/ban/${userId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
    unBanUser: builder.mutation({
      query: ({ userId }) => ({
        url: `${ADMIN_URL}/unban/${userId}`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      onQueryStarted: async ({ userId }, { dispatch, queryFulfilled }) => {
        const unBanResult = dispatch(
          userApiSlice.util.updateQueryData(
            'getAllUsers',
            'usersList',
            draft => {
              draft.entities[userId].isBanned = false
              draft.entities[userId].nbOfWarns = 0
            }
          )
        )

        const deleteAllWarns = dispatch(
          adminApiSlice.util.updateQueryData(
            'getAllWarnsByUserId',
            { userId },
            draft => {
              draft.entities = []
              draft.ids = []
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          unBanResult.undo()
          deleteAllWarns.undo()
        }
      },
    }),
    updateUserBan: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `${ADMIN_URL}/ban/${userId}/update`,
        method: 'PATCH',
        body: { reason },
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
  useGetAllWarnsByUserIdQuery,
  useUnwarnUserMutation,
  useWarnUserMutation,
  useUpdateWarnMutation,
  useGetAllReportsQuery,
  useCloseReportMutation,
  useDeleteReportMutation,
  useGetAllSuggestionsQuery,
  useCheckSuggestionMutation,
  useUnCheckSuggestionMutation,
  useDeleteSuggestionMutation,
  useBanUserMutation,
  useGetBanByUserIdQuery,
  useUnBanUserMutation,
  useUpdateUserBanMutation,
} = adminApiSlice
