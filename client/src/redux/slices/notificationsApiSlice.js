import { apiSlice } from '../api/apiSlice'
import {
  setMarkAsRead,
  revertMarkAsRead,
  setUnreadNotifications,
} from './notificationsSlice'
import { createEntityAdapter } from '@reduxjs/toolkit'

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return -1
  },
})
const NOTIFICATIONS_URL = '/notifications'

import { createSelector } from '@reduxjs/toolkit'
const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/get-notifications`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        const loadedNotifications = responseData.map(notification => {
          // console.log('in tranformResponse, notification: ', notification)
          notification.id = notification._id
          return notification
        })

        return notificationsAdapter.setAll(
          notificationsAdapter.getInitialState(),
          loadedNotifications
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Notification', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Notification', id })),
          ]
        } else return [{ type: 'Notification', id: 'LIST' }]
      },
    }),
    getUnreadNotifications: builder.query({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/unread-notifications`,
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      providesTags: ['Unread'],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          const { nbOfUnreadNotifs } = data
          dispatch(setUnreadNotifications({ nbOfUnreadNotifs }))
        } catch (error) {
          console.log(error)
        }
      },
    }),
    markAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/mark-as-read`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: ['Unread'],
      onQueryStarted: async (arg, { dispatch }) => {
        try {
          // Dispatch the action before awaiting the queryFulfilled promise
          dispatch(setMarkAsRead())
        } catch (error) {
          console.log(error)
        }
      },
      onError: (error, variables, context) => {
        // Roll back the optimistic update by dispatching an action
        dispatch(revertMarkAsRead())

        // Perform additional error handling logic if needed
        console.log('Error occurred during markAsRead mutation:', error)
      },
    }),
    deleteNotification: builder.mutation({
      query: notifId => ({
        url: `${NOTIFICATIONS_URL}/notification/${notifId}/delete`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
      onQueryStarted: async (notifId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          notificationsApiSlice.util.updateQueryData(
            'getNotifications',
            'notificationsList',
            draft => {
              const notification = draft?.entities[notifId]
              if (notification) {
                delete draft.entities[notifId]
                draft.ids = draft.ids.filter(id => id !== notifId)
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
  }),
})

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApiSlice

export const selectNotificationsResult =
  notificationsApiSlice.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  notificationsResult => notificationsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotifications,
  // selectById: selectNotificationById,
  // selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notificationsAdapter.getSelectors(
  state => selectNotificationsData(state) ?? initialState
)
// console.log(notificationsAdapter)

function getToken() {
  return localStorage.getItem('accessToken')
}
