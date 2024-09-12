// api/teamApi.ts
import axiosInstance from '../helpers/axiosInstance'

// Create a new team
export const createTeam = async (data: {
  name: string
  description?: string
}) => {
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
