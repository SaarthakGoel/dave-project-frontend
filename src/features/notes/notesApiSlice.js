import {
  createSelector , 
  createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
  sortComparer : (a , b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
});

const initialState = notesAdapter.getInitialState();

export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder) => ({
    getNotes : builder.query({
      query : () => '/notes',
      validateStatus : (response , result) => {
        return response.status === 200 && !result.isError
      },
      transformResponse : responseData => {
        const loadednotes = responseData.map(user => {
          user.id = user._id;
          return user
        });
        return notesAdapter.setAll(initialState , loadednotes)
      },
      providesTags : (result , error , arg) => {
        if(result?.ids) {
          return [
            {type : 'User' , id : 'LIST'},
            ...result.ids.map(id => ({type : 'User' , id}))
          ]
        }else return [{type : 'User' , id : 'LIST'}]
      }
    }),
    addNewNotes : builder.mutation({
      query : (initialNote) => ({
        url : '/notes' ,
        method : 'POST',
        body : {...initialNote}
      }),
      invalidatesTags : [
        {type : 'Note' , id : 'LIST'}
      ]
    }),
    updateNote : builder.mutation({
      query : (initialNote) => ({
        url : '/notes',
        method : 'PATCH',
        body : {...initialNote}
      }),
      invalidatesTags : (result , error , arg) => [
        {type : 'Note' , id : arg.id}
      ]
    }),
    deleteNote : builder.mutation({
      query : ({id}) => ({
        url : '/notes',
        method : 'DELETE' ,
        body : {id} 
      }),
      invalidatesTags : (result , error , arg ) => [
        {type : 'Note' , id : arg.id}
      ]
    })
  }),
})

export const {
  useGetNotesQuery,
  useAddNewNotesMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} = noteApiSlice;

// returns the query result object
export const selectNotesResult = noteApiSlice.endpoints.getNotes.select()

// creates memoized selector
const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)