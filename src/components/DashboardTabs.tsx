import React, { useState, useRef } from 'react'
import {
  MdDashboard,
  MdLockClock,
  MdFolder,
  MdFilterAlt,
  MdCreate,
} from 'react-icons/md'
import { Modal } from 'flowbite-react'
import FilterDropdown from './Modals/FilterDropdown'
import CreateTaskModal from './Modals/CreateTaskModal'
import TaskBoard from './TaskBoard' // Import the TaskBoard component

export const DashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('My Tasks') // Default tab
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  const tabClass = (tabName: string) =>
    `flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 ${
      tabName === activeTab
        ? 'text-white bg-blue-500'
        : 'text-gray-900 dark:text-gray-200 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500'
    }`

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleSaveTask = (task: Task) => {
    // Handle saving the task here
    console.log('Task saved:', task)
    setIsModalOpen(false) // Close modal after saving
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="container mx-auto p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
          <div className="flex items-center justify-between">
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
                className="flex items-center justify-center px-4 py-2 text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
                onClick={handleFilterClick}
              >
                <MdFilterAlt className="mr-2" />
                Filter
              </button>
            </div>

            {/* Create Tasks Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
            >
              <MdCreate className="h-6 mr-2" />
              Create Tasks
            </button>
          </div>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          )}

          {/* Create Task Modal */}
          <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Modal.Header>Create Task</Modal.Header>
            <Modal.Body>
              <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask} // Correctly passing the onSave handler
              />
            </Modal.Body>
          </Modal>
        </div>
      </div>

      <div className="flex-1 container mx-auto p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {/* Display content based on the active tab */}
          {activeTab === 'My Tasks' && <TaskBoard />}
          {activeTab === 'Recent' && (
            <p className="text-gray-900 dark:text-gray-200">
              Recent tasks will be displayed here.
            </p>
          )}
          {activeTab === 'Projects' && (
            <p className="text-gray-900 dark:text-gray-200">
              Project tasks will be displayed here.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardTabs
