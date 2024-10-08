import React from 'react'
import SidebarNav from '../layout/SidebarNav'
import TopNav from '../layout/TopNav'
import { Outlet } from 'react-router-dom'

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <TopNav /> {/* Render TopNav as sticky */}
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet /> {/* Renders the nested route content */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
