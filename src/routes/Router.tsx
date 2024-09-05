import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUserFromLocalStorage } from '../redux/features/auth/authSlice'

const AppRouter = () => {
  const dispatch = useDispatch()

  // Load the user from localStorage when the app starts
  useEffect(() => {
    dispatch(loadUserFromLocalStorage())
  }, [dispatch])

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

const Router = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default Router
