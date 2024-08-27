import React, { useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { DashboardTabs } from '../components/DashboardTabs'
import { TaskBoard } from '../components/TaskBoard'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [activeSubTab, setActiveSubTab] = useState('My Tasks')

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab)
    // Reset sub-tab when switching to a different main tab
    if (tab !== 'Dashboard') {
      setActiveSubTab('My Tasks')
    }
  }

  const handleSubTabSelect = (subTab: string) => {
    setActiveSubTab(subTab)
  }

  return (
    <DashboardLayout onTabSelect={handleTabSelect}>
      <div>
        {activeTab === 'Dashboard' && (
          <>
            <DashboardTabs
              setActiveTab={handleSubTabSelect}
              activeTab={activeSubTab}
            />
            <div>
              {activeSubTab === 'My Tasks' && <TaskBoard />}
              {activeSubTab === 'Recent' && <div>Recent content goes here</div>}
              {activeSubTab === 'Projects' && (
                <div>Projects content goes here</div>
              )}
            </div>
          </>
        )}
        {activeTab === 'Issues' && <div>Issues content goes here</div>}
        {activeTab === 'Boards' && <div>Boards content goes here</div>}
        {activeTab === 'Calendar' && <div>Calendar content goes here</div>}
        {activeTab === 'Projects' && <div>Projects content goes here</div>}
        {activeTab === 'Development' && (
          <div>Development content goes here</div>
        )}
        {activeTab === 'Marketing' && <div>Marketing content goes here</div>}
        {activeTab === 'Sales' && <div>Sales content goes here</div>}
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
