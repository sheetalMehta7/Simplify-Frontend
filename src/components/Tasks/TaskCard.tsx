import React from 'react'
import { FaFlag } from 'react-icons/fa'

interface TaskCardProps {
  title: string
  assignee?: string // Optional in case there's no assignee
  dueDate?: string // Optional in case due date is not set
  status: string
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  assignee = 'Unassigned',
  dueDate,
  status,
}) => {
  return (
    <div className="relative bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md text-gray-900 dark:text-white">
      {/* Flag Icon */}
      <FaFlag
        className={`absolute top-2 left-2 ${getFlagColor(status)}`}
        size={16}
      />
      {/* Card Content */}
      <div className="ml-8">
        <h3 className="text-sm font-semibold md:text-base lg:text-base">
          {title}
        </h3>
        <p className="text-xs md:text-xs mb-1">Assignee: {assignee}</p>
        <p className="text-xs md:text-xs mb-2">
          Due Date: {dueDate ? formatDate(dueDate) : 'No due date'}
        </p>
        <span
          className={`text-xs font-bold py-1 px-2 rounded-full ${getBadgeColor(
            status,
          )}`}
        >
          {status}
        </span>
      </div>
    </div>
  )
}

function getFlagColor(status: string) {
  switch (status) {
    case 'todo':
      return 'text-yellow-500'
    case 'in-progress':
      return 'text-blue-500'
    case 'review':
      return 'text-orange-500'
    case 'done':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}

function getBadgeColor(status: string) {
  switch (status) {
    case 'todo':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-200 dark:text-yellow-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-200 dark:text-blue-800'
    case 'review':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-200 dark:text-orange-800'
    case 'done':
      return 'bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-200 dark:text-gray-800'
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default TaskCard
