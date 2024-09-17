import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadUserFromLocalStorage } from '../redux/features/auth/authSlice'
import { setupAxiosInterceptors } from '../helpers/axiosInstance'
import { Home } from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'

// Action to set the last visited page in Redux
const setLastVisitedPage = (page: string) => ({
  type: 'SET_LAST_VISITED_PAGE',
  payload: page,
})

const AppRouter = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Load user from localStorage when the app starts
    dispatch(loadUserFromLocalStorage())
    // Set up Axios interceptors with navigation handling
    setupAxiosInterceptors(navigate)
  }, [dispatch, navigate])

  useEffect(() => {
    // Dispatch the last visited page whenever the location changes
    dispatch(setLastVisitedPage(location.pathname))
  }, [location, dispatch])

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
