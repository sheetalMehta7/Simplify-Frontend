import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Home } from '../pages/Home'
import SignUp from '../pages/Signup'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Header from './Header'

const AppRouter = () => {
  const location = useLocation()

  // Define paths where the header should be displayed
  const showHeader =
    location.pathname === '/' || location.pathname === '/dashboard'

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
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
