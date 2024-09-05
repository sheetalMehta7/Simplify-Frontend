// src/components/Router.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUserFromLocalStorage } from '../redux/features/auth/authSlice'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../redux/store'
import { Provider } from 'react-redux'

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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default Router
