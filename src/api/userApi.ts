import axiosInstance from '../helpers/axiosInstance'

// Fetch user profile (with team information if applicable)
export const getUserProfile = async () => {
  const response = await axiosInstance.get('/user/profile')
  return response.data
}

// Update user profile (supporting updates to team role if necessary)
export const updateUserProfile = async (data: {
  email?: string
  name?: string
  role?: string // Optional update to role (for team admins)
}) => {
  const response = await axiosInstance.put('/user/profile', data)
  return response.data
}

// Fetch teams the user is part of
export const getUserTeams = async () => {
  const response = await axiosInstance.get('/teams')
  return response.data
}

// Create a new team (admin only)
export const createTeam = async (data: {
  name: string
  description?: string
}) => {
  const response = await axiosInstance.post('/teams', data)
  return response.data
}

// Fetch members of a specific team
export const getTeamMembers = async (teamId: string) => {
  const response = await axiosInstance.get(`/teams/${teamId}/members`)
  return response.data
}
