import React, { useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import DashboardTabs from '../components/DashboardTabs'
import { Outlet } from 'react-router-dom'
import Calendar from '../components/Calendar/Calendar'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard')
  const [activeSubTab, setActiveSubTab] = useState<string>('My Tasks')

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'Dashboard') {
      setActiveSubTab('My Tasks')
    }
  }

  const handleSubTabSelect = (subTab: string) => {
    setActiveSubTab(subTab)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <DashboardTabs
              setActiveTab={handleSubTabSelect}
              activeTab={activeSubTab}
            />
            <div>
              <Outlet />
            </div>
          </>
        )
      case 'Calendar':
        return <Calendar />
      case 'Issues':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Issues content goes here.
          </p>
        )
      case 'Boards':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Boards content goes here.
          </p>
        )
      case 'Projects':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Projects content goes here.
          </p>
        )
      case 'Development':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Development content goes here.
          </p>
        )
      case 'Marketing':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Marketing content goes here.
          </p>
        )
      default:
        return (
          <p className="text-gray-900 dark:text-gray-200">Content not found.</p>
        )
    }
  }

  return (
    <DashboardLayout onTabSelect={handleTabSelect}>
      <div>{renderContent()}</div>
    </DashboardLayout>
  )
}

export default Dashboard
