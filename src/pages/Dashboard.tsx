import React, { useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import DashboardTabs from '../components/Tabs/DashboardTabs'
import TeamsDashboardTabs from '../components/Tabs/TeamsDashboardTabs'
import Calendar from '../components/Calendar/Calendar'
import ProjectDashboardTabs from '../components/Tabs/ProjectDashboardTabs'
import { Outlet } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard')

  const handleTabSelect = async (tab: string) => {
    setActiveTab(tab)
    if (tab === 'TeamsBoard') {
      // Uncomment this if you want to fetch team tasks when the TeamsBoard tab is selected
      // await dispatch(fetchTeamTasks())
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <DashboardTabs />
            <div>
              <Outlet />
            </div>
          </>
        )
      case 'TeamsBoard':
        return <TeamsDashboardTabs />
      case 'Calendar':
        return <Calendar />
      case 'Issues':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Issues content goes here.
          </p>
        )
      case 'Projects':
        return <ProjectDashboardTabs />
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
