import React, { useState, useEffect, useRef } from 'react'
import { MdDashboard, MdCreate, MdCancel } from 'react-icons/md'
import { VscSettings } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import FilterDropdown from './Modals/FilterModal'
import CreateTaskModal from './Modals/CreateTaskModal'
import TaskBoardCommon from './Tasks/TaskBoardCommon'
import {
  createNewTask,
  fetchTasks,
  Task,
} from '../redux/features/tasks/tasksSlice'
import { RootState, AppDispatch } from '../redux/store'
import { Button } from 'flowbite-react'

const DashboardTabs: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<{
    date: string
    assignee: string
    status: string
  }>({
    date: '',
    assignee: '',
    status: '',
  })

  const personalTasks = useSelector(
    (state: RootState) => state.tasks.personalTasks,
  )
  const user = useSelector((state: RootState) => state.user.profile)
  const dispatch: AppDispatch = useDispatch()
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  const ensureCorrectTaskStructure = (
    tasks: any,
  ): { [key: string]: Task[] } => {
    return {
      todo: tasks.todo || [],
      'in-progress': tasks['in-progress'] || [],
      review: tasks.review || [],
      done: tasks.done || [],
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchTasks()) // Fetch only personal tasks
    }
    fetchData()
  }, [dispatch])

  const toggleFilter = () => setIsFilterOpen((prev) => !prev)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const applyFilters = (filterValues: {
    date: string
    assignee: string
    status: string
  }) => {
    setFilters(filterValues)
  }

  const clearAllFilters = () => {
    setFilters({ date: '', assignee: '', status: '' })
  }

  const removeFilter = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: '',
    }))
  }

  const handleSaveTask = async (newTask: Partial<Task>) => {
    try {
      await dispatch(createNewTask(newTask)).unwrap()
      closeModal()
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const tasks = ensureCorrectTaskStructure(personalTasks)

  return (
    <div className="flex flex-col h-screen">
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <button className="flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 border border-gray-100 text-white bg-blue-500">
              <MdDashboard className="h-6 mr-2" />
              <span>My Tasks</span>
            </button>
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
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onApply={applyFilters}
              onClearAll={clearAllFilters}
            />
          )}

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

          {user && (
            <CreateTaskModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSave={handleSaveTask}
              userId={user.id}
              userName={user.name}
            />
          )}
        </div>
      </div>

      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          <TaskBoardCommon
            tasks={tasks}
            onCreateTask={openModal}
            onTaskClick={(task) => console.log('Task clicked:', task)}
            onEditTask={(task) => console.log('Edit task:', task)}
            onDragEnd={(result) => console.log('Drag ended:', result)}
          />
        </div>
      </div>
    </div>
  )
}

// Helper Components for Filter and Create Task Button

const FilterTag = ({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) => (
  <div className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full m-1">
    <span className="mr-2">{label}</span>
    <button onClick={onRemove} className="text-red-500 hover:text-red-700">
      <MdCancel size={18} />
    </button>
  </div>
)

const FilterButton = React.forwardRef<
  HTMLButtonElement,
  { isFilterOpen: boolean; onClick: () => void }
>(({ isFilterOpen, onClick }, ref) => (
  <button
    ref={ref}
    className={`flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 border border-gray-100 hover:text-white ${
      isFilterOpen
        ? 'text-white bg-blue-500'
        : 'text-gray-900 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500'
    }`}
    onClick={onClick}
  >
    <VscSettings className="h-6 mr-2" />
    {isFilterOpen ? 'Close Filter' : 'Filter'}
  </button>
))

const CreateTaskButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center px-4 py-2 text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 border border-gray-100 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
  >
    <MdCreate className="h-6 mr-2" />
    Create Task
  </button>
)

export default DashboardTabs
