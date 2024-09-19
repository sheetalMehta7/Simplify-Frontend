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
    dispatch(loadUserFromLocalStorage())

    setupAxiosInterceptors(navigate)
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'authToken' && !event.newValue) {
        dispatch(logout())
        navigate('/')
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
