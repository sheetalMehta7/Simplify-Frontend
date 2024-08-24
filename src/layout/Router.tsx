import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from "../pages/Home"
import SignUp from "../pages/Signup"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
