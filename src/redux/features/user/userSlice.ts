// src/redux/features/user/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from '../../../api/userApi'

// Define the allowed roles as an enum or union type
type UserRole = 'member' | 'admin'

interface User {
  id: string
  email: string
  name: string
}

interface Team {
  id: string
  name: string
}

interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole // Role restricted to 'admin' or 'member'
  teams: Team[] // Teams the user is part of
}

interface UserState {
  profile: UserProfile | null
  users: User[] // All users for team creation
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
  users: [], // Empty array for users
  loading: false,
  error: null,
}

// Thunk to fetch user profile, including teams and roles
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async () => {
    const profile = await getUserProfile()
    return profile
  },
)

// Thunk to fetch all users
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async () => {
    const users = await getAllUsers()
    return users
  },
)

// Thunk to update user profile
export const updateUserProfileThunk = createAsyncThunk(
  'user/updateUserProfile',
  async (data: Partial<Omit<UserProfile, 'role'>> & { role?: UserRole }) => {
    const updatedProfile = await updateUserProfile(data)
    return updatedProfile
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        // Ensure the teams field is initialized
        state.profile = {
          ...action.payload,
          teams: action.payload.teams || [], // Default to an empty array if teams are missing
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch user profile'
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        // Ensure teams is maintained when updating the profile
        state.profile = {
          ...state.profile!,
          ...action.payload,
          teams: state.profile?.teams || [], // Keep the teams field
        }
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
  },
})

export default userSlice.reducer
