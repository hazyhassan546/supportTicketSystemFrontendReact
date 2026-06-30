import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import authReducer from './slices/authSlice'
import ticketsReducer from './slices/ticketsSlice'
import lookupsReducer from './slices/lookupsSlice'
import commentsReducer from './slices/commentsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketsReducer,
    lookups: lookupsReducer,
    comments: commentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
