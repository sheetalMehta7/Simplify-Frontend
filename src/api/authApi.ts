// src/api/authApi.ts
import axiosInstance from '../helpers/axiosInstance'

export const signup = async (email: string, password: string, name: string) => {
  const response = await axiosInstance.post('/auth/signup', {
    email,
    password,
    name,
  })
  return response.data
}

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  })
  return response.data
}
