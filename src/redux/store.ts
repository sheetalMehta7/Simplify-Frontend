import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './features/tasks/tasksSlice'
import authReducer from './features/auth/authSlice'
import errorReducer from './features/error/errorSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
    error: errorReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
