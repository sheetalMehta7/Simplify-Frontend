import axiosInstance from '../helpers/axiosInstance'

interface TeamPayload {
  name: string
  description?: string
  members: string[]
  projectId?: string
}

interface UpdateTeamPayload {
  name?: string
  description?: string
  members?: string[]
  projectId?: string
}

// Create a new team
export const createTeam = async (data: TeamPayload) => {
  const response = await axiosInstance.post('/teams', data)
  return response.data
}

// Get all teams
export const getAllTeams = async () => {
  const response = await axiosInstance.get('/teams')
  return response.data
}

// Get team details by ID
export const getTeamDetails = async (teamId: string) => {
  const response = await axiosInstance.get(`/teams/${teamId}`)
  return response.data
}

// Get team members by team ID
export const getTeamMembers = async (teamId: string) => {
  const response = await axiosInstance.get(`/teams/${teamId}/members`)
  return response.data
}

// Update a team
export const updateTeam = async (teamId: string, data: UpdateTeamPayload) => {
  const response = await axiosInstance.put(`/teams/${teamId}`, data)
  return response.data
}

// Delete a team
export const deleteTeam = async (teamId: string) => {
  const response = await axiosInstance.delete(`/teams/${teamId}`)
  return response.data
}
