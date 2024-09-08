import axiosInstance from '../helpers/axiosInstance'

// Fetch user profile (no need to pass userId explicitly anymore)
export const getUserProfile = async () => {
  const response = await axiosInstance.get('/user/profile')
  return response.data
}

// Update user profile
export const updateUserProfile = async (data: {
  email?: string
  name?: string
}) => {
  const response = await axiosInstance.put('/user/profile', data)
  return response.data
}
