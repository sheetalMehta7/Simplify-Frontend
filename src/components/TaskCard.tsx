import React from 'react'
import { FaFlag } from 'react-icons/fa'

interface TaskCardProps {
  title: string
  assignee: string
  dueDate: string
  status: string
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  assignee,
  dueDate,
  status,
}) => {
  return (
    <div className="relative bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md text-gray-900 dark:text-white">
      {/* Flag Icon */}
      <FaFlag
        className={`absolute top-2 left-2 ${getStatusColor(status)}`}
        size={16}
      />
      {/* Card Content */}
      <div className="ml-8">
        <h3 className="text-sm font-semibold md:text-base lg:text-base">
          {title}
        </h3>
        <p className="text-xs md:text-xs mb-1">Assignee: {assignee}</p>
        <p className="text-xs md:text-xs mb-2">
          Due Date: {formatDate(dueDate)}
        </p>
        <span
          className={`text-xxs md:text-xs font-bold py-1 px-2 rounded-full bg-opacity-20 ${getStatusColor(
            status,
          )}`}
        >
          {status}
        </span>
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'todo':
      return 'text-yellow-700 dark:text-yellow-500 bg-yellow-200 dark:bg-yellow-500'
    case 'in-progress':
      return 'text-blue-700 dark:text-blue-500 bg-blue-200 dark:bg-blue-500'
    case 'review':
      return 'text-orange-700 dark:text-orange-500 bg-orange-200 dark:bg-orange-500'
    case 'done':
      return 'text-green-700 dark:text-green-500 bg-green-200 dark:bg-green-500'
    default:
      return 'text-gray-700 dark:text-gray-500 bg-gray-200 dark:bg-gray-500'
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

export default TaskCard
