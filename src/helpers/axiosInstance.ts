import axios from 'axios'
import { store } from '../redux/store'
import { setError } from '../redux/features/error/errorSlice'
import { logout } from '../redux/features/auth/authSlice'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
})

// Add a request interceptor to automatically add the Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Modify the axiosInstance setup to accept the navigate function
export const setupAxiosInterceptors = (navigate: (path: string) => void) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred'

      console.error(`API Error: ${errorMessage}`)

      // Check if the error is due to an expired or invalid token
      if (
        error.response?.status === 403 &&
        errorMessage === 'Invalid or expired token'
      ) {
        store.dispatch(setError('Session expired. You have been logged out.'))

        // Wait for logout action to complete
        await store.dispatch(logout())

        // Navigate to the '/' route after logout
        navigate('/')
      } else {
        // For other errors, set the error message in the store
        store.dispatch(setError(errorMessage))
      }

      return Promise.reject(error)
    },
  )
}

export default axiosInstance
