import React from 'react'
import { Drawer, Button, Badge } from 'flowbite-react'
import { FaTimes, FaTasks } from 'react-icons/fa'
import { Task } from './TaskBoard' // Import Task correctly

interface TaskDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
}

const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  if (!task) return null

  const statusColors: { [key: string]: string } = {
    todo: 'blue',
    'in-progress': 'yellow',
    review: 'purple',
    done: 'green',
  }

  return (
    <Drawer
      position="right"
      open={isOpen}
      onClose={onClose}
      className="z-50 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaTasks className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
            Task Details
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400 transition-colors"
        >
          <FaTimes size={24} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Task Title */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            Title
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{task.title}</p>
        </div>

        {/* Assignee */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            Assignee
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {task.assignee || 'Unassigned'}
          </p>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            Due Date
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            Status
          </h3>
          <Badge
            color={statusColors[task.status] || 'gray'}
            className="text-sm font-semibold py-1 px-3"
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Button
            color="purple"
            className="flex-1 text-sm py-2 sm:text-base sm:py-2.5 hover:bg-purple-700 transition-colors"
          >
            Edit Task
          </Button>
          <Button
            color="yellow"
            className="flex-1 text-sm py-2 sm:text-base sm:py-2.5 hover:bg-yellow-500 transition-colors"
          >
            Change Priority
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default TaskDetailsDrawer
