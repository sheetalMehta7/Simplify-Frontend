import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserProfile, updateUserProfile } from '../../../api/userApi'

interface UserProfile {
  id: string
  email: string
  name: string
  role: string // Role in the team, e.g., 'admin', 'member'
  teams: { id: string; name: string }[] // Teams the user is part of
}

interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
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

// Thunk to update user profile
export const updateUserProfileThunk = createAsyncThunk(
  'user/updateUserProfile',
  async (data: Partial<UserProfile>) => {
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
        state.profile = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch user profile'
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload
      })
  },
})

export default userSlice.reducer
