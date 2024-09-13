// redux/features/teams/teamSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createTeam,
  getAllTeams,
  getTeamDetails,
  getTeamMembers,
} from '../../../api/teamApi'

interface Team {
  id: string
  name: string
  description?: string
  members: { id: string; name: string }[]
}

interface TeamState {
  teams: Team[]
  selectedTeam: Team | null
  teamMembers: { id: string; name: string; role: string }[]
  loading: boolean
  error: string | null
}

const initialState: TeamState = {
  teams: [],
  selectedTeam: null,
  teamMembers: [],
  loading: false,
  error: null,
}

// Thunks

// Fetch all teams
export const fetchTeams = createAsyncThunk('teams/fetchTeams', async () => {
  const teams = await getAllTeams()
  return teams
})

// Create a new team
export const createNewTeam = createAsyncThunk(
  'teams/createNewTeam',
  async (data: { name: string; description?: string }) => {
    const team = await createTeam(data)
    return team
  },
)

// Fetch team details by team ID
export const fetchTeamDetails = createAsyncThunk(
  'teams/fetchTeamDetails',
  async (teamId: string) => {
    const team = await getTeamDetails(teamId)
    return team
  },
)

// Fetch team members by team ID
export const fetchTeamMembers = createAsyncThunk(
  'teams/fetchTeamMembers',
  async (teamId: string) => {
    const members = await getTeamMembers(teamId)
    return members
  },
)

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false
        state.teams = action.payload
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Error fetching teams'
      })
      .addCase(createNewTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload)
      })
      .addCase(fetchTeamDetails.fulfilled, (state, action) => {
        state.selectedTeam = action.payload
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.teamMembers = action.payload
      })
  },
})

export default teamSlice.reducer
