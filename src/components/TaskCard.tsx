import React from 'react'
import { FaFlag } from 'react-icons/fa' // Import flag icon from react-icons

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
    <div className="relative bg-gray-800 p-4 rounded-lg shadow-md text-white">
      {/* Flag Icon */}
      <FaFlag
        className={`absolute top-2 left-2 ${getStatusColor(status)}`}
        size={16} // Adjust icon size for better fit
      />
      {/* Card Content */}
      <div className="ml-8">
        <h3 className="text-sm font-semibold md:text-base lg:text-base">
          {title}
        </h3>{' '}
        {/* Reduced heading size */}
        <p className="text-xs md:text-xs mb-1">Assignee: {assignee}</p>
        <p className="text-xs md:text-xs mb-2">
          Due Date: {formatDate(dueDate)}
        </p>
        <span
          className={`text-xxs md:text-xs font-bold py-1 px-2 rounded-full ${getStatusColor(status)}`}
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
      return 'text-yellow-500' // Yellow for To-Do
    case 'in-progress':
      return 'text-blue-500' // Blue for In-Progress
    case 'review':
      return 'text-orange-500' // Purple for Review
    case 'done':
      return 'text-green-500' // Green for Done
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString() // Format date to a readable format
}

export default TaskCard
