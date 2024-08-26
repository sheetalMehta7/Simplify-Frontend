import React, { useState } from 'react'
import { HiClipboardList, HiUserCircle } from 'react-icons/hi'
import { MdDashboard, MdCreate } from 'react-icons/md'

export const DashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('My Tasks')

  const tabClass = (tabName: string) =>
    `flex items-center justify-center w-40 h-10 ${
      activeTab === tabName ? 'bg-blue-400 text-white' : ''
    } border border-gray-300 rounded-md hover:bg-blue-400 hover:text-white transition-all duration-300`

  return (
    <div className="p-4 bg-slate-800 rounded-md shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        {/* Custom Tabs */}
        <div className="flex space-x-4">
          <button
            className={tabClass('My Tasks')}
            onClick={() => setActiveTab('My Tasks')}
          >
            <MdDashboard className="mr-2" />
            My Tasks
          </button>
          <button
            className={tabClass('Recent')}
            onClick={() => setActiveTab('Recent')}
          >
            <HiUserCircle className="mr-2" />
            Recent
          </button>
          <button
            className={tabClass('Filter')}
            onClick={() => setActiveTab('Filter')}
          >
            <HiClipboardList className="mr-2" />
            Filter
          </button>
        </div>

        {/* Create Tasks Button */}
        <button className="flex items-center justify-center rounded-md w-40 h-10 border border-gray-300 hover:bg-blue-400 hover:text-white transition-all duration-300">
          <MdCreate className="h-6 mr-2" />
          Create Tasks
        </button>
      </div>
    </div>
  )
}
