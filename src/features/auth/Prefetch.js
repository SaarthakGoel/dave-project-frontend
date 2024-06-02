import { store } from '../../app/store'
import { noteApiSlice } from '../notes/notesApiSlice'
import { userApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

  useEffect(() => {
    console.log('subscribing')
    const notes = store.dispatch(noteApiSlice.endpoints.getNotes.initiate())
    const users = store.dispatch(userApiSlice.endpoints.getUsers.initiate())

    return () => {
      console.log('unsubscribing')
      notes.unsubscribe();
      users.unsubscribe();
    }
  },[]) 

  return <Outlet /> 
}

export default Prefetch