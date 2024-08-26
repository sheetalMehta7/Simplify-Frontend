import React, { useState, useRef } from 'react'
import {
  MdDashboard,
  MdCreate,
  MdLockClock,
  MdFolder,
  MdFilterAlt,
} from 'react-icons/md'
import { FilterDropdown } from '../components/FilterDropdown'

interface DashboardTabsProps {
  setActiveTab: (tabName: string) => void
  activeTab: string
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  setActiveTab,
  activeTab,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  const tabClass = (tabName: string) =>
    `flex items-center justify-center w-32 h-10 ${
      tabName === activeTab ? 'bg-blue-400 text-white' : 'text-white'
    } bg-transparent rounded-md hover:bg-blue-400 hover:text-white transition-all duration-300`

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="relative p-4 bg-slate-800 rounded-md shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
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
            <MdLockClock className="mr-2" />
            Recent
          </button>
          <button
            className={tabClass('Projects')}
            onClick={() => setActiveTab('Projects')}
          >
            <MdFolder className="mr-2" />
            Projects
          </button>
          <button
            ref={filterButtonRef}
            className="flex items-center justify-center w-32 h-10 text-white bg-transparent rounded-md hover:bg-blue-400 hover:text-white transition-all duration-300"
            onClick={handleFilterClick}
          >
            <MdFilterAlt className="mr-2" />
            Filter
          </button>
        </div>

        {/* Create Tasks Button */}
        <button className="flex items-center justify-center rounded-md w-36 h-10 border border-gray-300 hover:bg-blue-400 hover:text-white transition-all duration-300">
          <MdCreate className="h-6 mr-2" />
          Create Tasks
        </button>
      </div>

      {/* Filter Dropdown */}
      <FilterDropdown
        isOpen={isFilterOpen}
        closeDropdown={() => setIsFilterOpen(false)}
      />
    </div>
  )
}
