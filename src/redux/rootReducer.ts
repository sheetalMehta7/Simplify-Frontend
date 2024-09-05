// src/redux/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import tasksReducer from './features/tasks/tasksSlice'
import authReducer from './features/auth/authSlice'
import errorReducer from './features/error/errorSlice'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  auth: authReducer,
  error: errorReducer,
})

export default rootReducer
