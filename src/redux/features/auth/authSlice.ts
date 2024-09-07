// src/redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: {
    id: number
    email: string
    name: string
  } | null
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
    loginSuccess(
      state,
      action: PayloadAction<{ user: AuthState['user']; token: string }>,
    ) {
      state.user = action.payload.user
      state.token = action.payload.token

      // Store the token and user in localStorage
      localStorage.setItem('authToken', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout(state) {
      state.user = null
      state.token = null

      // Clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    },
    loadUserFromLocalStorage(state) {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('authToken')

      if (user && token) {
        state.user = JSON.parse(user)
        state.token = token
      }
    },
  },
})

export const { loginSuccess, logout, loadUserFromLocalStorage } =
  authSlice.actions

export default authSlice.reducer
