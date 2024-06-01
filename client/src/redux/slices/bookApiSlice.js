import { apiSlice } from '../api/apiSlice'

import { createEntityAdapter } from '@reduxjs/toolkit'

const booksAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})
const booksCheckAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})
const bookRecipesAdapter = createEntityAdapter({})
const publicBooksAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
})

const USERS_URL = '/users'
const BOOKS_URL = '/books'

export const bookApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBooks: builder.query({
      query: () => ({
        url: `${USERS_URL}/user/books`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        const loadedBooks = responseData.map(book => {
          book.id = book._id
          return book
        })

        return booksAdapter.setAll(booksAdapter.getInitialState(), loadedBooks)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Book', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Book', id })),
          ]
        } else return [{ type: 'Book', id: 'LIST' }]
      },
    }),
    getBook: builder.query({
      query: bookId => ({
        url: `${BOOKS_URL}/book/${bookId}/recipes`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        const bookRecipes = bookRecipesAdapter.setAll(
          bookRecipesAdapter.getInitialState(),
          responseData.recipes
        )
        const { book } = responseData

        return { book, bookRecipes }
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'BookRecipe', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'BookRecipe', id })),
          ]
        } else return [{ type: 'BookRecipe', id: 'LIST' }]
      },
    }),
    getBooksByUserId: builder.query({
      query: id => ({
        url: `${BOOKS_URL}/user/${id}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      transformResponse: async responseData => {
        const loadedPublicBooks = responseData.map(book => {
          book.id = book._id
          return book
        })
        return publicBooksAdapter.setAll(
          publicBooksAdapter.getInitialState(),
          loadedPublicBooks
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'PublicBook', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'PublicBook', id })),
          ]
        } else return [{ type: 'PublicBook', id: 'LIST' }]
      },
    }),
    // to check if a recipe is in the user's books
    getCheckedBooks: builder.query({
      query: recipeId => ({
        url: `${BOOKS_URL}/${recipeId}/check`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: async responseData => {
        //already returning it with id prop in response
        return booksCheckAdapter.setAll(
          booksCheckAdapter.getInitialState(),
          responseData
        )
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'BookCheck', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'BookCheck', id })),
          ]
        } else return [{ type: 'BookCheck', id: 'LIST' }]
      },
    }),
    createBook: builder.mutation({
      query: bookData => ({
        url: `${BOOKS_URL}/book/create`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        body: bookData,
      }),
      invalidatesTags: [{ type: 'Book', id: 'LIST' }],
    }),
    updateBook: builder.mutation({
      query: updatedData => ({
        url: `${BOOKS_URL}/book/${updatedData.id}/update`,
        method: 'PUT',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
        body: updatedData.bookData,
      }),
      invalidatesTags: [{ type: 'Book', id: 'LIST' }],
    }),
    deleteBook: builder.mutation({
      query: bookId => ({
        url: `${BOOKS_URL}/book/${bookId}/delete`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'Book', id: 'LIST' }],
      onQueryStarted: async (bookId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          bookApiSlice.util.updateQueryData('getBooks', 'booksList', draft => {
            const book = draft.entities[bookId]
            if (book) delete draft.entities[bookId]
          })
        )
        try {
          await queryFulfilled
        } catch (error) {
          console.error(error)
          patchResult.undo()
        }
      },
    }),
    addRecipeToBook: builder.mutation({
      query: ({ bookId, recipeId }) => ({
        url: `${BOOKS_URL}/book/${bookId}/recipe/${recipeId}/add`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [{ type: 'BookCheck', id: 'LIST' }],
      onQueryStarted: async (
        { bookId, recipeId },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          bookApiSlice.util.updateQueryData(
            'getCheckedBooks',
            recipeId,
            draft => {
              const book = draft.entities[bookId]
              if (book) book.isInBook = true
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
    removeRecipeFromBook: builder.mutation({
      query: ({ bookId, recipeId }) => ({
        url: `${BOOKS_URL}/book/${bookId}/recipe/${recipeId}/remove`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }),
      invalidatesTags: [
        { type: 'BookCheck', id: 'LIST' },
        { type: 'BookRecipe', id: 'LIST' },
      ],
      onQueryStarted: async (
        { bookId, recipeId },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult1 = dispatch(
          bookApiSlice.util.updateQueryData(
            'getCheckedBooks',
            recipeId,
            draft => {
              const book = draft.entities[bookId]
              if (book) book.isInBook = false
            }
          )
        )
        const patchResult2 = dispatch(
          bookApiSlice.util.updateQueryData('getBook', bookId, draft => {
            const recipe = draft.bookRecipes.entities[recipeId]
            if (recipe) {
              draft.bookRecipes.ids = draft.bookRecipes.ids.filter(
                id => id !== recipeId
              )
              delete draft.bookRecipes.entities[recipeId]
            }
          })
        )
        try {
          await queryFulfilled
        } catch (error) {
          patchResult1.undo()
          patchResult2.undo()
        }
      },
    }),
  }),
})

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useGetBooksByUserIdQuery,
  useGetCheckedBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useAddRecipeToBookMutation,
  useRemoveRecipeFromBookMutation,
} = bookApiSlice

function getToken() {
  return localStorage.getItem('accessToken')
}
