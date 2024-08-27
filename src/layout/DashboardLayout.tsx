import React from 'react'
import { SidebarNav } from '../layout/SidebarNav'
import { TopNav } from '../layout/TopNav'

interface DashboardLayoutProps {
  children: React.ReactNode
  onTabSelect: (tab: string) => void
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onTabSelect,
}) => {
  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-2">
        <SidebarNav onTabSelect={onTabSelect} />
      </div>
      <div className="col-span-10 bg-gray-900 text-white flex flex-col">
        <TopNav />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
