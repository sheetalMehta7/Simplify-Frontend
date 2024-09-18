// src/redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the user structure, including role
interface User {
  id: string
  email: string
  name: string
  role: 'member' | 'admin' // Define the roles explicitly
}

interface AuthState {
  user: User | null
  token: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Handle login success
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token

      // Store the token and user in localStorage
      localStorage.setItem('authToken', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },

    // Handle logout
    logout(state) {
      state.user = null
      state.token = null

      // Clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    },

    // Load user and token from local storage during app initialization
    loadUserFromLocalStorage(state) {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('authToken')

      if (user && token) {
        state.user = JSON.parse(user)
        state.token = token
      }
    },

    // Update user profile locally after changes
    updateUserProfile(
      state,
      action: PayloadAction<{
        name: string
        email: string
        role: 'member' | 'admin'
      }>,
    ) {
      if (state.user) {
        state.user.name = action.payload.name
        state.user.email = action.payload.email
        state.user.role = action.payload.role
      }

      // Update user in local storage to persist changes
      localStorage.setItem('user', JSON.stringify(state.user))
    },
  },
})

export const {
  loginSuccess,
  logout,
  loadUserFromLocalStorage,
  updateUserProfile,
} = authSlice.actions

export default authSlice.reducer
