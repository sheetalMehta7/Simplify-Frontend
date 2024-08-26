import React, { useState } from 'react'
import { SidebarNav } from '../layout/SidebarNav'
import { TopNav } from '../layout/TopNav'
import { DashboardTabs } from '../components/DashboardTabs'
import { TaskBoard } from '../components/TaskBoard'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('My Tasks')

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-2">
        <SidebarNav />
      </div>
      <div className="col-span-10 bg-gray-900 text-white">
        <TopNav />
        <div className="p-4">
          <DashboardTabs setActiveTab={setActiveTab} activeTab={activeTab} />
          <div>
            {activeTab === 'My Tasks' && <TaskBoard />}
            {activeTab === 'Recent' && <div>Recent content goes here</div>}
            {activeTab === 'Projects' && <div>Projects content goes here</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
