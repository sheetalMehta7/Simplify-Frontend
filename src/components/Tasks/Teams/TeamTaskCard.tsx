// src/components/TeamTaskCard.tsx
import React from 'react'
import { TeamTask, TaskPriority } from '../../../types/Task'
import { HiPencil, HiOutlineEye } from 'react-icons/hi'

interface TeamTaskCardProps {
  task: TeamTask
  onEdit: (task: TeamTask) => void
  onTaskClick: (task: TeamTask) => void
}

const priorityStyles: { [key in TaskPriority]: string } = {
  low: 'bg-green-100 text-green-600',
  medium: 'bg-yellow-100 text-yellow-600',
  high: 'bg-red-100 text-red-600',
}

const TeamTaskCard: React.FC<TeamTaskCardProps> = ({
  task,
  onEdit,
  onTaskClick,
}) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-700 shadow-md rounded-lg flex justify-between items-center cursor-pointer">
      {/* Task Details */}
      <div onClick={() => onTaskClick(task)} className="flex flex-col">
        <h3 className="text-md font-semibold dark:text-white mb-1">
          {task.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Due: {task.dueDate.toLocaleDateString()}
        </p>
        <span
          className={`inline-block mt-1 text-xs px-2 py-1 rounded-lg ${
            priorityStyles[task.priority]
          }`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{' '}
          Priority
        </span>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-500 hover:text-blue-700"
        >
          <HiPencil size={18} />
        </button>
        <button
          onClick={() => onTaskClick(task)}
          className="text-gray-500 hover:text-gray-700"
        >
          <HiOutlineEye size={18} />
        </button>
      </div>
    </div>
  )
}

export default TeamTaskCard
