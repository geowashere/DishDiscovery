import { apiSlice } from '../api/apiSlice'
import { recipeApiSlice } from './recipeApiSlice'
import { createEntityAdapter, nanoid } from '@reduxjs/toolkit'

const repliesAdapter = createEntityAdapter({})
const RECIPES_URL = '/recipes'

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCommentReplies: builder.query({
      query: commentId => ({
        url: `${RECIPES_URL}/comment/${commentId}/replies`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      transformResponse: async responseData => {
        return repliesAdapter.setAll(
          repliesAdapter.getInitialState(),
          responseData
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Reply', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Reply', id })),
          ]
        } else return [{ type: 'Reply', id: 'LIST' }]
      },
    }),
    likeComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `${RECIPES_URL}/comment/${commentId}/like`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'RecipeComment', id: 'LIST' }],
      onQueryStarted: async (
        { recipeId, commentId },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getRecipeComments',
            recipeId,
            draft => {
              const comment = draft.comments.entities[commentId]
              if (comment) {
                comment.isCommentLikedByUser = true
                comment.nbOfLikes += 1
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
    unlikeComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `${RECIPES_URL}/comment/${commentId}/unlike`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'RecipeComment', id: 'LIST' }],
      onQueryStarted: async (
        { recipeId, commentId },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getRecipeComments',
            recipeId,
            draft => {
              const comment = draft.comments.entities[commentId]
              if (comment) {
                comment.isCommentLikedByUser = false
                comment.nbOfLikes -= 1
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
    likeReply: builder.mutation({
      query: ({ replyId }) => ({
        url: `${RECIPES_URL}/comment/${replyId}/like`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'Reply', id: 'LIST' }],
      onQueryStarted: async (
        { commentId, replyId },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getCommentReplies',
            commentId,
            draft => {
              const reply = draft.entities[replyId]
              if (reply) {
                reply.isLikedByUser = true
                reply.nbOfLikes += 1
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
    unlikeReply: builder.mutation({
      query: ({ replyId }) => ({
        url: `${RECIPES_URL}/comment/${replyId}/unlike`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'Reply', id: 'LIST' }],
      onQueryStarted: async (
        { commentId, replyId },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getCommentReplies',
            commentId,
            draft => {
              const reply = draft.entities[replyId]
              if (reply) {
                reply.isLikedByUser = false
                reply.nbOfLikes -= 1
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
    replyToComment: builder.mutation({
      query: ({ commentBody, commentId }) => ({
        url: `${RECIPES_URL}/comment/${commentId}/reply`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        body: commentBody,
      }),
      invalidatesTags: [
        { type: 'Reply', id: 'LIST' },
        { type: 'RecipeComment', id: 'LIST' },
      ],
      onQueryStarted: async (
        { commentId, recipeId, commentBody },
        { dispatch, queryFulfilled }
      ) => {
        const tempId = nanoid()
        const newDraft = {
          id: tempId,
          content: commentBody.content,
          nbOfLikes: 0,
          isLikedByUser: false,
          createdAt: 'a few seconds ago',
          commentedUserUsername: commentBody.user.username,
          commentedUserAvatar: commentBody.user.avatar,
        }

        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getCommentReplies',
            commentId,
            draft => {
              draft.entities[tempId] = newDraft
              draft.ids.push(tempId)
            }
          )
        )
        dispatch(
          recipeApiSlice.util.updateQueryData(
            'getRecipeComments',
            recipeId,
            draft => {
              const comment = draft.comments.entities[commentId]
              if (comment) draft.comments.entities[commentId].hasReplies += 1
            }
          )
        )
        const patchResult2 = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getAllRecipes',
            'recipesList',
            draft => {
              const recipe = draft.entities[recipeId]
              if (recipe) recipe.nbOfComments += 1
            }
          )
        )
        try {
          const { newComment } = await queryFulfilled
          dispatch(
            recipeApiSlice.util.updateQueryData(
              'getCommentReplies',
              commentId,
              draft => {
                const index = draft.findIndex(comment => comment.id === tempId)

                if (index !== -1) draft[index] = newComment
              }
            )
          )
        } catch (error) {
          patchResult.undo()
          patchResult2.undo()
        }
      },
    }),
    deleteComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `${RECIPES_URL}/comment/${commentId}`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [
        { type: 'RecipeComment', id: 'LIST' },
        { type: 'Recipe', id: 'LIST' },
      ],
      onQueryStarted: async (
        { commentId, recipeId },
        { dispatch, queryFulfilled }
      ) => {
        let nbOfReplies
        const patchResult1 = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getRecipeComments',
            recipeId,
            draft => {
              const comment = draft.comments.entities[commentId]

              nbOfReplies = comment.hasReplies

              if (comment) {
                delete draft.comments.entities[commentId]
                draft.comments.ids.filter(id => id !== commentId)
              }
            }
          )
        )
        const patchResult2 = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getAllRecipes',
            'recipesList',
            draft => {
              const recipe = draft.entities[recipeId]
              if (recipe) recipe.nbOfComments -= 1 + nbOfReplies
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
    deleteReply: builder.mutation({
      query: ({ replyId, commentId }) => ({
        url: `${RECIPES_URL}/comment/${commentId}/reply/${replyId}`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [
        { type: 'Reply', id: 'LIST' },
        { type: 'RecipeComment', id: 'LIST' },
      ],
      onQueryStarted: async (
        { replyId, commentId, recipeId },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult1 = dispatch(
          commentApiSlice.util.updateQueryData(
            'getCommentReplies',
            commentId,
            draft => {
              const reply = draft.entities[replyId]
              if (reply) delete draft.entities[replyId]
            }
          )
        )
        const patchResult2 = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getRecipeComments',
            recipeId,
            draft => {
              const comment = draft.comments.entities[commentId]
              if (comment) draft.comments.entities[commentId].hasReplies -= 1
            }
          )
        )
        const patchResult3 = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getAllRecipes',
            'recipesList',
            draft => {
              const recipe = draft.entities[recipeId]
              if (recipe) recipe.nbOfComments -= 1
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.error(error)
          patchResult1.undo()
          patchResult2.undo()
          patchResult3.undo()
        }
      },
    }),
  }),
})

export const {
  useGetCommentRepliesQuery,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useLikeReplyMutation,
  useUnlikeReplyMutation,
  useReplyToCommentMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation,
} = commentApiSlice

function getToken() {
  return localStorage.getItem('accessToken')
}
