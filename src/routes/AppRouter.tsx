// AppRouter.tsx
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
import TeamsDashboardTabs from '../components/Tabs/TeamsDashboardTabs'
import ProjectDashboardTabs from '../components/Tabs/ProjectDashboardTabs'
import Calendar from '../components/Calendar/Calendar'
import DashboardTabs from '../components/Tabs/DashboardTabs'

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
      >
        <Route path="my-tasks" element={<DashboardTabs />} />
        <Route path="teams" element={<TeamsDashboardTabs />} />
        <Route path="projects" element={<ProjectDashboardTabs />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="issues" element={<div>Issues Content</div>} />
        <Route path="development" element={<div>Development Content</div>} />
        <Route path="marketing" element={<div>Marketing Content</div>} />
      </Route>
    </Routes>
  )
}

export default AppRouter
