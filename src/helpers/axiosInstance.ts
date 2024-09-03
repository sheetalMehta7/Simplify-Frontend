// src/api/axiosInstance.ts
import axios from 'axios'
import { useError } from '../context/ErrorContext'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { setError } = useError()
    const errorMessage =
      error.response?.data?.message || 'An unexpected error occurred'
    setError(errorMessage)

    return Promise.reject(error)
  },
)

export default axiosInstance
