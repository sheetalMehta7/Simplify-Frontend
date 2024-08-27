import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Teams from '../pages/Teams'
import TeamTasks from '../pages/TeamTasks'
import PersonalTasks from '../pages/PersonalTasks'
import DashboardLayout from './DashboardLayout'

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/user" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="personal-tasks" element={<PersonalTasks />} />
          <Route path="team-tasks" element={<TeamTasks />} />
          <Route path="teams" element={<Teams />} />
        </Route>
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
