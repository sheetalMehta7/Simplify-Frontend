import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken')

  // Check if the token exists and is valid (simple existence check for this example)
  if (!token) {
    return <Navigate to="/" replace />
  }

  // Additional validation can be added here, such as checking token expiration

  return <>{children}</>
}

export default ProtectedRoute
