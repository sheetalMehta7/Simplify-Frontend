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

// Fetch all users to allow adding team members
export const getAllUsers = async () => {
  const response = await axiosInstance.get('/user/all')
  return response.data
}
