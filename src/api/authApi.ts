// src/api/authApi.ts
import axiosInstance from '../helpers/axiosInstance'

export const signup = async (email: string, password: string, name: string) => {
  const response = await axiosInstance.post('/auth/signup', {
    email,
    password,
    name,
  })

  // Store token and user details (role included) in localStorage
  localStorage.setItem('token', response.data.token)
  localStorage.setItem('user', JSON.stringify(response.data.user))

  return response.data
}

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  })

  // Store token and user details (role included) in localStorage
  localStorage.setItem('token', response.data.token)
  localStorage.setItem('user', JSON.stringify(response.data.user))

  return response.data
}
