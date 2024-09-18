import axiosInstance from '../helpers/axiosInstance'

// Define the UserProfile type matching the backend response
export interface UserProfile {
  teams: never[]
  id: string
  email: string
  name: string
  role: 'member' | 'admin' // Assuming roles are member or admin
}

// Define the Team type for the user's teams
export interface Team {
  id: string
  name: string
  description?: string
  role: 'member' | 'admin' // User's role within the team
}

// Fetch user profile (with team information if applicable)
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get('/user/profile')
  return response.data
}

// Update user profile (supporting updates to team role if necessary)
export const updateUserProfile = async (data: {
  email?: string
  name?: string
  role?: 'member' | 'admin' // Optional update to role (for team admins)
}): Promise<UserProfile> => {
  const response = await axiosInstance.put('/user/profile', data)
  return response.data
}

// Fetch teams the user is part of
export const getUserTeams = async (): Promise<Team[]> => {
  const response = await axiosInstance.get('/teams')
  return response.data
}

// Define the User type for all users in the system
export interface User {
  id: string
  name: string
  email: string
  role: 'member' | 'admin' // User's global role in the app
}

// Fetch all users to allow adding team members
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/user/all')
  return response.data
}
