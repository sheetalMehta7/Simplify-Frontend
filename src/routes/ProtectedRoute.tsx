import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, token } = useSelector((state: RootState) => state.auth)

  if (!user || !token) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
