import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadUserFromLocalStorage } from '../redux/features/auth/authSlice'
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
