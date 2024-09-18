import React, { useState } from 'react'
import {
  MdDashboard,
  MdLockClock,
  MdFolder,
  MdCreate,
  MdCancel,
} from 'react-icons/md'
import { VscSettings } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import FilterDropdown from '../Modals/FilterModal'
import CreateTaskModal from '../Modals/CreateTaskModal'
import PersonalTaskBoard from '../Tasks/Personal/PersonalTaskBoard'
import { createNewTask } from '../../redux/features/tasks/tasksSlice'
import { AppDispatch } from '../../redux/store'
import { RootState } from '../../redux/rootReducer'
import { Task } from '../../redux/features/tasks/tasksSlice'
import { Button } from 'flowbite-react'

interface Tab {
  name: string
  icon: React.ReactNode
}

const TABS: Tab[] = [
  { name: 'My Tasks', icon: <MdDashboard /> },
  { name: 'Recent', icon: <MdLockClock /> },
  { name: 'Projects', icon: <MdFolder /> },
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

  // Fetch userId from the Redux state
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

  // Handle task creation and map status to the correct enum values
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
        userId, // Fetch and use the correct userId
      }

      await dispatch(createNewTask(taskWithValidStatus)).unwrap()
      closeModal() // Close the modal after successfully saving the task
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Tabs and Filter/Task buttons */}
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
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
                className="flex items-center justify-center w-40 h-10 text-sm font-medium px-4 py-2"
              >
                <VscSettings className="mr-2 mt-0.5" /> Filter
              </Button>
              <Button
                onClick={openModal}
                gradientDuoTone="purpleToBlue"
                className="flex items-center justify-center w-40 h-10 text-sm font-medium px-4 py-2"
              >
                <MdCreate className="mr-2 mt-0.5" /> Create Task
              </Button>
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

          {/* Active Filters */}
          {Object.values(filters).some((filter) => filter) && (
            <div className="mt-4 flex flex-wrap gap-2">
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
              <Button color="red" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          )}

          {/* Create Task Modal */}
          <CreateTaskModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={handleSaveTask}
          />
        </div>
      </div>

      {/* Task Board based on active tab */}
      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {activeTab === 'My Tasks' && <PersonalTaskBoard filters={filters} />}
        </div>
      </div>
    </div>
  )
}

export default DashboardTabs

interface FilterTagProps {
  label: string
  onRemove: () => void
}

const FilterTag: React.FC<FilterTagProps> = ({ label, onRemove }) => (
  <div className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full m-1">
    <span className="mr-2">{label}</span>
    <button onClick={onRemove} className="text-red-500 hover:text-red-700">
      <MdCancel size={18} />
    </button>
  </div>
)

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
  <div className="flex space-x-2 md:space-x-4">
    {tabs.map((tab) => (
      <button
        key={tab.name}
        className={`flex items-center justify-center w-40 h-10 rounded-md transition-all duration-300 text-sm font-medium ${
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
