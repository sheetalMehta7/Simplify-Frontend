import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createTeam,
  getAllTeams,
  getTeamDetails,
  getTeamMembers,
  updateTeam,
  deleteTeam,
} from '../../../api/teamApi'

// Define the Team and Member interfaces
interface Team {
  id: string
  name: string
  description?: string
  members: { id: string; name: string }[] // Members of the team
}

interface TeamState {
  teams: Team[] // All teams
  selectedTeam: Team | null // Current selected team
  teamMembers: { id: string; name: string; role: string }[] // Members of the selected team
  loading: boolean // Loading state
  error: string | null // Error message, if any
}

// Initial state of the teams slice
const initialState: TeamState = {
  teams: [], // Array to store teams
  selectedTeam: null, // Initially no team selected
  teamMembers: [], // Empty members array
  loading: false, // No loading at start
  error: null, // No error at start
}

// Thunks for async actions

// Fetch all teams
export const fetchTeams = createAsyncThunk('teams/fetchTeams', async () => {
  const teams = await getAllTeams()
  return teams
})

// Create a new team with members and an optional project ID
export const createNewTeam = createAsyncThunk(
  'teams/createNewTeam',
  async (data: {
    name: string
    description?: string
    members: string[]
    projectId?: string
  }) => {
    const team = await createTeam(data)
    return team
  },
)

// Update an existing team with members and an optional project ID
export const updateTeamThunk = createAsyncThunk(
  'teams/updateTeam',
  async ({
    teamId,
    data,
  }: {
    teamId: string
    data: {
      name?: string
      description?: string
      members?: string[]
      projectId?: string
    }
  }) => {
    const updatedTeam = await updateTeam(teamId, data)
    return updatedTeam
  },
)

// Delete a team by ID
export const deleteTeamThunk = createAsyncThunk(
  'teams/deleteTeam',
  async (teamId: string) => {
    await deleteTeam(teamId)
    return teamId // Return deleted team ID to remove it from the state
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

// Fetch members of a team by team ID
export const fetchTeamMembers = createAsyncThunk(
  'teams/fetchTeamMembers',
  async (teamId: string) => {
    const members = await getTeamMembers(teamId)
    return members
  },
)

// Create the teamSlice
const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all teams
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

      // Create a new team
      .addCase(createNewTeam.pending, (state) => {
        state.loading = true
      })
      .addCase(createNewTeam.fulfilled, (state, action) => {
        state.loading = false
        state.teams.push(action.payload) // Add new team to the state
      })
      .addCase(createNewTeam.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Error creating team'
      })

      // Update an existing team
      .addCase(updateTeamThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTeamThunk.fulfilled, (state, action) => {
        state.loading = false
        const index = state.teams.findIndex(
          (team) => team.id === action.payload.id,
        )
        if (index !== -1) {
          state.teams[index] = action.payload // Update the team in the state
        }
      })
      .addCase(updateTeamThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Error updating team'
      })

      // Delete a team
      .addCase(deleteTeamThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteTeamThunk.fulfilled, (state, action) => {
        state.loading = false
        state.teams = state.teams.filter((team) => team.id !== action.payload)
      })
      .addCase(deleteTeamThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Error deleting team'
      })

      // Fetch details of a team
      .addCase(fetchTeamDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTeamDetails.fulfilled, (state, action) => {
        state.loading = false
        state.selectedTeam = action.payload
      })
      .addCase(fetchTeamDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Error fetching team details'
      })

      // Fetch members of a team
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false
        state.teamMembers = action.payload
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Error fetching team members'
      })
  },
})

export default teamSlice.reducer
