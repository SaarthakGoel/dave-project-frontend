import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const apiSlice = createApi({
  baseQuery : fetchBaseQuery({baseUrl : 'http://localhost:3500'}),
  tagTypes : ['Note' , 'User'],
  endpoints : builder => ({})
})