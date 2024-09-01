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
import TaskBoard from './TaskBoard'

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
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  const handleTabClick = (tabName: string) => setActiveTab(tabName)
  const toggleFilter = () => setIsFilterOpen((prev) => !prev)
  const toggleModal = () => setIsModalOpen((prev) => !prev)

  const handleSaveTask = (task: Task) => {
    console.log('Task saved:', task)
    setIsModalOpen(false)
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
            <div className="mt-4 md:mt-0 flex space-x-">
              <FilterButton
                ref={filterButtonRef}
                isFilterOpen={isFilterOpen}
                onClick={toggleFilter}
              />
              <CreateTaskButton onClick={toggleModal} />
            </div>
          </div>

          {isFilterOpen && (
            <FilterDropdown isOpen={isFilterOpen} onClose={toggleFilter} />
          )}

          <Modal show={isModalOpen} onClose={toggleModal}>
            <Modal.Header>Create Task</Modal.Header>
            <Modal.Body>
              <CreateTaskModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                onSave={handleSaveTask}
              />
            </Modal.Body>
          </Modal>
        </div>
      </div>

      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          <TabContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

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

interface FilterButtonProps {
  isFilterOpen: boolean
  onClick: () => void
}

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ isFilterOpen, onClick }, ref) => (
    <button
      ref={ref}
      className="flex items-center justify-center px-4 py-2  text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
      onClick={onClick}
    >
      <MdFilterAlt className="mr-2" />
      Filter
    </button>
  ),
)

interface CreateTaskButtonProps {
  onClick: () => void
}

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center px-4 py-2 text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
  >
    <MdCreate className="h-6 mr-2" />
    Create Tasks
  </button>
)

interface TabContentProps {
  activeTab: string
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'My Tasks':
      return <TaskBoard />
    case 'Recent':
      return (
        <p className="text-gray-900 dark:text-gray-200">
          Recent tasks will be displayed here.
        </p>
      )
    case 'Projects':
      return (
        <p className="text-gray-900 dark:text-gray-200">
          Project tasks will be displayed here.
        </p>
      )
    default:
      return null
  }
}

export default DashboardTabs
