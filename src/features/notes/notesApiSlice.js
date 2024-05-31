import {
  createSelector , 
  createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({});

const initialState = notesAdapter.getInitialState();

export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder) => ({
    getNotes : builder.query({
      query : () => '/notes',
      validateStatus : (response , result) => {
        return response.status === 200 && !result.isError
      },
      keepUnusedDataFor : 5,
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

  }),
})

export const {useGetNotesQuery} = noteApiSlice;

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