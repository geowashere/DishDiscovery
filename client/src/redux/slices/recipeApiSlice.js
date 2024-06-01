import { apiSlice } from '../api/apiSlice'
import { createEntityAdapter, nanoid } from '@reduxjs/toolkit'

const recipesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})
// *commentsAdapter has recipe, recipe user, and comments of the recipe
const commentsAdapter = createEntityAdapter({})
const userRecipesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})
const myRecipesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})
const pendingRecipesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})
const likedRecipesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})
const ingredientsAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1,
})

const RECIPES_URL = '/recipes'
const USERS_URL = '/users'
const INGREDIENTS_URL = '/ingredients'

export const recipeApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getLikedRecipes: builder.query({
      query: () => ({
        url: `${USERS_URL}/user/liked-recipes`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        const loadedLikedRecipes = responseData.map(likedRecipe => {
          likedRecipe.id = likedRecipe._id
          return likedRecipe
        })

        return likedRecipesAdapter.setAll(
          likedRecipesAdapter.getInitialState(),
          loadedLikedRecipes
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'LikedRecipe', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'LikedRecipe', id })),
          ]
        } else return [{ type: 'LikedRecipe', id: 'LIST' }]
      },
    }),
    getRecipes: builder.query({
      query: () => ({
        url: `${USERS_URL}/user/recipes`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        return myRecipesAdapter.setAll(
          myRecipesAdapter.getInitialState(),
          responseData
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'MyRecipe', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'MyRecipe', id })),
          ]
        } else return [{ type: 'MyRecipe', id: 'LIST' }]
      },
    }),
    getRecipesByUserId: builder.query({
      query: id => ({
        url: `${RECIPES_URL}/user/${id}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        const loadedUserRecipes = responseData.map(userRecipe => {
          userRecipe.id = userRecipe._id
          return userRecipe
        })

        return userRecipesAdapter.setAll(
          userRecipesAdapter.getInitialState(),
          loadedUserRecipes
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'UserRecipe', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'UserRecipe', id })),
          ]
        } else return [{ type: 'UserRecipe', id: 'LIST' }]
      },
    }),
    getAllRecipes: builder.query({
      query: () => ({
        url: `${RECIPES_URL}/public-recipes`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        const loadedRecipes = responseData.map(recipe => {
          recipe.id = recipe._id
          return recipe
        })

        return recipesAdapter.setAll(
          recipesAdapter.getInitialState(),
          loadedRecipes
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Recipe', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Recipe', id })),
          ]
        } else return [{ type: 'Recipe', id: 'LIST' }]
      },
    }),
    getEnums: builder.query({
      query: () => ({
        url: `${RECIPES_URL}/recipe/enums`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
    }),
    getAllIngredients: builder.query({
      query: () => ({
        url: `${INGREDIENTS_URL}/get`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        const loadedIngredients = responseData.map(ingredient => {
          ingredient.id = ingredient._id
          return ingredient
        })

        return ingredientsAdapter.setAll(
          ingredientsAdapter.getInitialState(),
          loadedIngredients
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Ingredient', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Ingredient', id })),
          ]
        } else return [{ type: 'Ingredient', id: 'LIST' }]
      },
    }),
    addIngredient: builder.mutation({
      query: ingredient => ({
        url: `${INGREDIENTS_URL}/add`,
        method: 'POST',
        body: ingredient,
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'Ingredient',
          id: 'List',
        },
      ],
      onQueryStarted: async (ingredient, { dispatch, queryFulfilled }) => {
        const tempId = nanoid()
        const postResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getAllIngredients',
            'ingredientsList',
            draft => {
              draft.entities[tempId] = {
                id: tempId,
                name: ingredient.ingredient,
              }
              draft.ids.push(tempId)
            }
          )
        )
        try {
          const {
            data: { newIngredient },
          } = await queryFulfilled

          dispatch(
            recipeApiSlice.util.updateQueryData(
              'getAllIngredients',
              'ingredientsList',
              draft => {
                delete draft.entities[tempId]
                draft.ids = draft.ids.filter(id => id !== tempId)
                draft.entities[newIngredient._id] = newIngredient
                draft.ids.push(newIngredient._id)
              }
            )
          )
        } catch (error) {
          console.log(error)
          postResult.undo()
        }
      },
    }),
    updateIngredient: builder.mutation({
      query: ({ ingredientId, updatedIngredient }) => ({
        url: `${INGREDIENTS_URL}/update/${ingredientId}`,
        method: 'PATCH',
        body: { updatedIngredient },
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      invalidatesTags: [
        {
          type: 'Ingredient',
          id: 'List',
        },
      ],
      onQueryStarted: async (ingredient, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getAllIngredients',
            'ingredientsList',
            draft => {
              draft.entities[ingredient.ingredientId] = {
                id: ingredient.ingredientId,
                name: ingredient.updatedIngredient,
              }
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.log(error)
          patchResult.undo()
        }
      },
    }),
    getRecipe: builder.query({
      query: recipeId => ({
        url: `${RECIPES_URL}/recipe/${recipeId}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
    }),
    getPendingRecipes: builder.query({
      query: () => ({
        url: `${USERS_URL}/user/pending-recipes`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      transformResponse: async responseData => {
        const loadedPendingRecipes = responseData.map(recipe => {
          recipe.id = recipe._id
          return recipe
        })

        return pendingRecipesAdapter.setAll(
          pendingRecipesAdapter.getInitialState(),
          loadedPendingRecipes
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'PendingRecipe', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'PendingRecipe', id })),
          ]
        } else return [{ type: 'PendingRecipe', id: 'LIST' }]
      },
    }),
    getRecipeComments: builder.query({
      query: recipeId => ({
        url: `${RECIPES_URL}/recipe/${recipeId}/comments`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      transformResponse: async responseData => {
        const comments = commentsAdapter.setAll(
          commentsAdapter.getInitialState(),
          responseData.comments
        )
        const { recipe } = responseData

        return { comments, recipe }
      },
      providesTags: (result, error, arg) => {
        if (result?.comments?.ids) {
          return [
            { type: 'RecipeComment', id: 'LIST' },
            ...result.comments.ids.map(id => ({ type: 'RecipeComment', id })),
          ]
        } else return [{ type: 'RecipeComment', id: 'LIST' }]
      },
    }),
    getTitles: builder.query({
      query: () => ({
        url: `${RECIPES_URL}/titles`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
    }),
    createRecipe: builder.mutation({
      query: recipeData => ({
        url: `${RECIPES_URL}/recipe/create`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        body: recipeData,
      }),
    }),
    updateRecipe: builder.mutation({
      query: ({ recipeId, recipeData }) => ({
        url: `${RECIPES_URL}/recipe/${recipeId}/update`,
        method: 'PUT',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        body: recipeData,
      }),
      invalidatesTags: [{ type: 'MyRecipe', id: 'LIST' }],
    }),
    deleteRecipe: builder.mutation({
      query: recipeId => ({
        url: `${RECIPES_URL}/recipe/${recipeId}/delete`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'MyRecipe', id: 'LIST' }],
      onQueryStarted: async (recipeId, { dispatch, queryFulfilled }) => {
        const patchResult1 = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getRecipes',
            'myRecipesList',
            draft => {
              const recipe = draft?.entities[recipeId]
              if (recipe) {
                delete draft?.entities[recipeId]
                draft.ids.filter(id => id !== recipeId)
              }
            }
          )
        )
        const patchResult2 = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getAllRecipes',
            'recipesList',
            draft => {
              const recipe = draft?.entities[recipeId]
              if (recipe) {
                delete draft?.entities[recipeId]
                draft.ids.filter(id => id !== recipeId)
              }
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
    likeRecipe: builder.mutation({
      query: recipeId => ({
        url: `${RECIPES_URL}/recipe/${recipeId}/like`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'Recipe', id: 'LIST' }],
      onQueryStarted: async (recipeId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getAllRecipes',
            'recipesList',
            draft => {
              const recipe = draft.entities[recipeId]
              if (recipe) {
                recipe.isLikedByUser = true
                recipe.nbOfLikes += 1
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
    unlikeRecipe: builder.mutation({
      query: recipeId => ({
        url: `${RECIPES_URL}/recipe/${recipeId}/unlike`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'Recipe', id: 'LIST' }],
      onQueryStarted: async (recipeId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getAllRecipes',
            'recipesList',
            draft => {
              const recipe = draft.entities[recipeId]
              if (recipe) {
                recipe.isLikedByUser = false
                recipe.nbOfLikes -= 1
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
    removeLikedRecipe: builder.mutation({
      query: recipeId => ({
        url: `${RECIPES_URL}/recipe/${recipeId}/unlike`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'LikedRecipe', id: 'LIST' }],
      onQueryStarted: async (recipeId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getLikedRecipes',
            'likesList',
            draft => {
              const recipe = draft.entities[recipeId]
              if (recipe) {
                delete draft.entities[recipeId]
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
    toggleStatus: builder.mutation({
      query: ({ recipeId, caption }) => ({
        url: `${RECIPES_URL}/${recipeId}/toggle-status`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        body: caption,
      }),
      onQueryStarted: async ({ recipeId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getRecipes',
            'myRecipesList',
            draft => {
              const recipe = draft.entities[recipeId]
              if (recipe)
                recipe.status =
                  recipe.status === 'private' ? 'public' : 'private'
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
          console.error(error)
        }
      },
    }),
    addComment: builder.mutation({
      query: ({ recipeId, commentBody }) => ({
        url: `${RECIPES_URL}/recipe/${recipeId}/comment`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        body: commentBody,
      }),
      invalidatesTags: [
        { type: 'RecipeComment', id: 'LIST' },
        { type: 'Recipe', id: 'LIST' },
      ],
      onQueryStarted: async (
        { recipeId, commentBody },
        { dispatch, queryFulfilled }
      ) => {
        const tempId = nanoid()
        const patchResult1 = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getRecipeComments',
            recipeId,
            draft => {
              draft.comments.entities[tempId] = {
                id: tempId,
                content: commentBody.content,
                createdAt: 'a few seconds ago',
                nbOfLikes: 0,
                isCommentLikedByUser: false,
                hasReplies: 0,
                commentedUserUsername: commentBody.user.username,
                commentedUserAvatar: commentBody.user.avatar,
              }
              draft.comments.ids.push(tempId)
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
              'getRecipeComments',
              recipeId,
              draft => {
                const index = draft.comments.findIndex(
                  comment => comment.id === tempId
                )

                if (index !== -1) draft.comments[index] = newComment
              }
            )
          )
        } catch (error) {
          patchResult1.undo()
          patchResult2.undo()
        }
      },
    }),
    createPendingRecipe: builder.mutation({
      query: recipeData => ({
        url: `${RECIPES_URL}/pending-recipe`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        body: recipeData,
      }),
    }),
    updatePendingRecipe: builder.mutation({
      query: ({ recipeId, recipeData }) => ({
        url: `${RECIPES_URL}/pending-recipe/${recipeId}`,
        method: 'PUT',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        body: recipeData,
      }),
    }),
    deletePendingRecipe: builder.mutation({
      query: recipeId => ({
        url: `${RECIPES_URL}/pending-recipe/${recipeId}`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      onQueryStarted: async (recipeId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          recipeApiSlice.util.updateQueryData(
            'getPendingRecipes',
            'pendingRecipesList',
            draft => {
              const pendingRecipe = draft.entities[recipeId]
              if (pendingRecipe) delete draft.entities[recipeId]
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.error(error)
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetRecipesByUserIdQuery,
  useGetRecipeQuery,
  useGetAllRecipesQuery,
  useGetTitlesQuery,
  useGetPendingRecipesQuery,
  useCreatePendingRecipeMutation,
  useUpdatePendingRecipeMutation,
  useDeletePendingRecipeMutation,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useLikeRecipeMutation,
  useUnlikeRecipeMutation,
  useGetRecipeCommentsQuery,
  useAddCommentMutation,
  useGetRecipesQuery,
  useGetLikedRecipesQuery,
  useRemoveLikedRecipeMutation,
  useGetEnumsQuery,
  useGetAllIngredientsQuery,
  useAddIngredientMutation,
  useToggleStatusMutation,
  useUpdateIngredientMutation,
} = recipeApiSlice

function getToken() {
  return localStorage.getItem('accessToken')
}
