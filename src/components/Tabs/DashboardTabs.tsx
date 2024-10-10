// src/Components/DashboardTabs.tsx

import React, { useState } from 'react'
import {
  MdDashboard,
  MdCheckCircle,
  MdStar,
  MdArchive,
  MdCreate,
  MdCancel,
} from 'react-icons/md'
import { VscSettings } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import FilterDropdown from '../Modals/FilterModal'
import CreateTaskModal from '../Modals/CreateTaskModal'
import PersonalTaskBoard from '../Tasks/Personal/PersonalTaskBoard'
import { createNewTask, Task } from '../../redux/features/tasks/tasksSlice'
import { AppDispatch } from '../../redux/store'
import { RootState } from '../../redux/rootReducer'
import { Button } from 'flowbite-react'

interface Tab {
  name: string
  icon: React.ReactNode
}

const TABS: Tab[] = [
  { name: 'My Tasks', icon: <MdDashboard /> },
  { name: 'Completed', icon: <MdCheckCircle /> },
  { name: 'Favorites', icon: <MdStar /> },
  { name: 'Archived', icon: <MdArchive /> },
]

const DashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].name)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<{
    date: string
    assignee: string
    status: string
    teamId: string
  }>({
    date: '',
    assignee: '',
    status: '',
    teamId: '',
  })

  const dispatch: AppDispatch = useDispatch()

  const userId = useSelector((state: RootState) => state.auth.user?.id)

  const handleTabClick = (tabName: string) => setActiveTab(tabName)
  const toggleFilter = () => setIsFilterOpen((prev) => !prev)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const applyFilters = (filterValues: {
    date: string
    assignee: string
    status: string
    teamId: string
  }) => {
    setFilters(filterValues)
  }

  const clearAllFilters = () => {
    setFilters({ date: '', assignee: '', status: '', teamId: '' })
  }

  const removeFilter = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: '',
    }))
  }

  const handleSaveTask = async (newTask: Partial<Task>) => {
    try {
      const taskWithValidStatus = {
        ...newTask,
        status:
          newTask.status === 'todo'
            ? 'todo'
            : newTask.status === 'in-progress'
              ? 'in-progress'
              : newTask.status === 'review'
                ? 'review'
                : 'done',
        userId,
      }

      await dispatch(createNewTask(taskWithValidStatus)).unwrap()
      closeModal()
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Tabs and Filter/Task buttons */}
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Tabs */}
            <TabButtons
              tabs={TABS}
              activeTab={activeTab}
              onTabClick={handleTabClick}
            />
            {/* Filter and Create Buttons */}
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button
                onClick={toggleFilter}
                color="gray"
                className="flex items-center justify-center w-full md:w-32 h-10 text-sm font-medium px-4 py-2"
              >
                <VscSettings className="mr-2 mt-0.5" /> Filter
              </Button>
              <Button
                onClick={openModal}
                gradientDuoTone="purpleToBlue"
                className="flex items-center justify-center w-full md:w-40 h-10 text-sm font-medium px-4 py-2"
              >
                <MdCreate className="mr-2 mt-0.5" /> Create Task
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <FilterDropdown
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onApply={applyFilters}
            onClearAll={clearAllFilters}
          />
        )}
      </div>

      {/* Active Filters displayed separately without background */}
      {Object.values(filters).some((filter) => filter) && (
        <div className="container mx-auto px-4 md:px-5 mt-2 mb-4">
          <div className="flex flex-wrap gap-2">
            {filters.date && (
              <FilterTag
                label={`Date: ${filters.date}`}
                onRemove={() => removeFilter('date')}
              />
            )}
            {filters.assignee && (
              <FilterTag
                label={`Assignee: ${filters.assignee}`}
                onRemove={() => removeFilter('assignee')}
              />
            )}
            {filters.status && (
              <FilterTag
                label={`Status: ${filters.status}`}
                onRemove={() => removeFilter('status')}
              />
            )}
            <Button size="sm" color="red" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
      />

      {/* Task Board based on active tab */}
      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {activeTab === 'My Tasks' ? (
            <PersonalTaskBoard filters={filters} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {activeTab} feature is coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardTabs

// --- FilterTag Component ---

interface FilterTagProps {
  label: string
  onRemove: () => void
}

const FilterTag: React.FC<FilterTagProps> = ({ label, onRemove }) => (
  <div className="inline-flex items-center px-2 py-1 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-full m-1">
    <span className="mr-2 text-sm">{label}</span>
    <button onClick={onRemove} className="text-red-500 hover:text-red-700">
      <MdCancel size={16} />
    </button>
  </div>
)

// --- TabButtons Component ---

interface TabButtonsProps {
  tabs: Tab[]
  activeTab: string
  onTabClick: (tabName: string) => void
}

const TabButtons: React.FC<TabButtonsProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => (
  <div className="flex flex-wrap space-x-1 md:space-x-3">
    {tabs.map((tab) => (
      <button
        key={tab.name}
        className={`flex items-center justify-center w-full md:w-28 h-8 md:h-10 rounded-md transition-all duration-300 text-sm font-medium mb-2 md:mb-0 ${
          tab.name === activeTab
            ? 'text-white bg-blue-500'
            : 'text-gray-900 dark:text-gray-200 hover:text-white hover:bg-blue-500 dark:hover:bg-blue-500'
        }`}
        onClick={() => onTabClick(tab.name)}
      >
        <span className="mr-2">{tab.icon}</span>
        <span>{tab.name}</span>
      </button>
    ))}
  </div>
)
