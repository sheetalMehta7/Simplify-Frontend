import axios from 'axios'
import { store } from '../redux/store'
import { setError } from '../redux/features/error/errorSlice'
import { logout } from '../redux/features/auth/authSlice'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const setupAxiosInterceptors = (navigate: (path: string) => void) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred'

      // Check if the token is invalid or expired
      if (
        error.response?.status === 403 &&
        errorMessage === 'Invalid or expired token'
      ) {
        // Remove token from localStorage which triggers logout in all tabs
        localStorage.removeItem('authToken')

        // Dispatch an error message and log out the user
        store.dispatch(setError('Session expired. You have been logged out.'))
        store.dispatch(logout())

        // Redirect current tab
        navigate('/')
      } else {
        store.dispatch(setError(errorMessage))
      }

      return Promise.reject(error)
    },
  )
}

export default axiosInstance
