// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './features/tasks/tasksSlice'
import errorReducer from './features/error/errorSlice'
import authReducer from './features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    error: errorReducer,
  },
})

// Export RootState and AppDispatch types for use throughout the app
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
