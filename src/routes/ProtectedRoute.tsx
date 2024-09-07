import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, token } = useSelector((state: RootState) => state.auth)

  // Check if user is authenticated by checking if both user and token exist
  if (!user || !token) {
    // Redirect to the home page if the user is not authenticated
    return <Navigate to="/" />
  }

  // If the user is authenticated, allow access to the protected route
  return children
}

export default ProtectedRoute
