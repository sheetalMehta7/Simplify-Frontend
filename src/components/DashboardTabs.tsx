import React, { useState, useRef } from 'react'
import {
  MdDashboard,
  MdLockClock,
  MdFolder,
  MdFilterAlt,
  MdCreate,
} from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import FilterDropdown from './Modals/FilterDropdown'
import CreateTaskModal from './Modals/CreateTaskModal'
import TaskBoard from './Tasks/TaskBoard'
import { createNewTask } from '../redux/features/tasks/tasksSlice'
import { RootState, AppDispatch } from '../redux/store'
import { Task } from '../redux/features/tasks/tasksSlice'

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
  const [activeTab, setActiveTab] = useState(TABS[0].name)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Access tasks from the Redux store
  const { tasks } = useSelector((state: RootState) => state.tasks)
  const dispatch: AppDispatch = useDispatch() // Correctly type the dispatch

  const filterButtonRef = useRef<HTMLButtonElement>(null)

  const handleTabClick = (tabName: string) => setActiveTab(tabName)
  const toggleFilter = () => setIsFilterOpen((prev) => !prev)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Dispatch the task creation to Redux and close the modal
  const handleSaveTask = async (newTask: Partial<Task>) => {
    try {
      await dispatch(createNewTask(newTask)).unwrap() // Unwrap the promise to handle errors
      closeModal() // Close the modal after the task is successfully created
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <TabButtons
              tabs={TABS}
              activeTab={activeTab}
              onTabClick={handleTabClick}
            />
            <div className="mt-4 md:mt-0 flex space-x-2">
              <FilterButton
                ref={filterButtonRef}
                isFilterOpen={isFilterOpen}
                onClick={toggleFilter}
              />
              <CreateTaskButton onClick={openModal} />
            </div>
          </div>

          {isFilterOpen && (
            <FilterDropdown isOpen={isFilterOpen} onClose={toggleFilter} />
          )}

          {/* Create Task Modal */}
          <CreateTaskModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={handleSaveTask} // Handle task creation and save to Redux
            userId={1} // Example userId
          />
        </div>
      </div>

      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {activeTab === 'My Tasks' && <TaskBoard tasks={tasks} />}
        </div>
      </div>
    </div>
  )
}

export default DashboardTabs

const TabButtons: React.FC<{
  tabs: Tab[]
  activeTab: string
  onTabClick: (tabName: string) => void
}> = ({ tabs, activeTab, onTabClick }) => (
  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
    {tabs.map((tab) => (
      <button
        key={tab.name}
        className={`flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 ${
          tab.name === activeTab
            ? 'text-white bg-blue-500'
            : 'text-gray-900 dark:text-gray-200 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500'
        }`}
        onClick={() => onTabClick(tab.name)}
      >
        {tab.icon}
        <span className="ml-2">{tab.name}</span>
      </button>
    ))}
  </div>
)

const FilterButton = React.forwardRef<
  HTMLButtonElement,
  { isFilterOpen: boolean; onClick: () => void }
>(({ isFilterOpen, onClick }, ref) => (
  <button
    ref={ref}
    className="flex items-center justify-center px-4 py-2 text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
    onClick={onClick}
  >
    <MdFilterAlt className="mr-2" />
    Filter
  </button>
))

const CreateTaskButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center px-4 py-2 text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
  >
    <MdCreate className="h-6 mr-2" />
    Create Tasks
  </button>
)
