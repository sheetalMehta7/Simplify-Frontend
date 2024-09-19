import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  loadUserFromLocalStorage,
  logout,
} from '../redux/features/auth/authSlice'
import { setupAxiosInterceptors } from '../helpers/axiosInstance'
import { Home } from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'

const AppRouter = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Load user from localStorage when the app starts
    dispatch(loadUserFromLocalStorage())

    // Set up Axios interceptors with navigation handling
    setupAxiosInterceptors(navigate)

    // Listen for logout event across tabs
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'logout') {
        // Logout event detected from another tab
        dispatch(logout())
        navigate('/') // Redirect to the home or login page
      }
    }

    window.addEventListener('storage', handleStorageEvent)

    return () => {
      window.removeEventListener('storage', handleStorageEvent)
    }
  }, [dispatch, navigate])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRouter
