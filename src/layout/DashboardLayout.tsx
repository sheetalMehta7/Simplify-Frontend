import React from 'react'
import { Outlet } from 'react-router-dom';
import { SidebarNav } from '../layout/SidebarNav'
import { TopNav } from '../layout/TopNav'

const DashboardLayout = () => {
  return (
    <div className="grid h-screen grid-cols-12 db-bg" style={{width: '1000px'}}>
      <div className="col-span-2">
        <SidebarNav />
      </div>
      <div className="col-span-10 flex flex-col text-white">
        <TopNav />
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
