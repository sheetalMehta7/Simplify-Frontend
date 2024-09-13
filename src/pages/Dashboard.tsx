import React, { useState, useEffect } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import DashboardTabs from '../components/DashboardTabs'
import TaskBoardCommon from '../components/Tasks/PersonalTaskBoard'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Calendar from '../components/Calendar/Calendar'
import Loader from '../components/Loader'
import { RootState, AppDispatch } from '../redux/store'
import { fetchTasks } from '../redux/features/tasks/tasksSlice'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard')
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const teamTasks = useSelector((state: RootState) => state.tasks.teamTasks)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [activeTab])

  const handleTabSelect = async (tab: string) => {
    setActiveTab(tab)
    if (tab === 'TeamTasks') {
      await dispatch(fetchTasks({ teamId: 'team' })) // Fetch team tasks when "Team Tasks" is selected
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader message="Loading content..." />
        </div>
      )
    }

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
        return (
          <TaskBoardCommon
            tasks={teamTasks}
            onCreateTask={() => {}}
            onTaskClick={() => {}}
            onEditTask={() => {}}
            onDragEnd={() => {}}
          />
        )
      case 'Calendar':
        return <Calendar />
      case 'Issues':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Issues content goes here.
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
