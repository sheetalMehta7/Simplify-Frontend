import { combineReducers } from '@reduxjs/toolkit'
import tasksReducer from './features/tasks/tasksSlice'
import authReducer from './features/auth/authSlice'
import errorReducer from './features/error/errorSlice'
import userReducer from './features/user/userSlice'
import teamsReducer from './features/teams/teamSlice'
import teamTaskSlice from './features/teams/teamTaskSlice'
import projectReducer from './features/projects/projectSlice'

const rootReducer = combineReducers({
  user: userReducer,
  tasks: tasksReducer,
  teamTask: teamTaskSlice,
  teams: teamsReducer,
  auth: authReducer,
  error: errorReducer,
  projects: projectReducer,
})

export default rootReducer
