import React, { useState, useRef, useEffect } from 'react'
import {
  FaFlag,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaTasks,
  FaChevronRight,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { Tooltip } from 'flowbite-react'
import { useDispatch } from 'react-redux'
import {
  updateTaskThunk,
  deleteTaskThunk,
  moveTaskLocally,
} from '../../../redux/features/tasks/tasksSlice'
import { Task } from '../../../redux/features/tasks/tasksSlice'
import { AppDispatch } from '../../../redux/store'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onTaskClick: (task: Task) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onTaskClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [statusChangeOpen, setStatusChangeOpen] = useState(false)
  const [submenuPosition, setSubmenuPosition] = useState<'left' | 'right'>(
    'right',
  )
  const dispatch: AppDispatch = useDispatch()
  const menuRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLLIElement>(null)

  // Helper function to check if the task is overdue and not done
  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() : false
  const isDone = task.status === 'done'

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setStatusChangeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleStatusChange = (newStatus: string) => {
    dispatch(
      moveTaskLocally({ taskId: task.id, oldStatus: task.status, newStatus }),
    )
    dispatch(updateTaskThunk({ id: task.id, status: newStatus }))
    setMenuOpen(false)
    setStatusChangeOpen(false)
  }

  const handleDelete = () => {
    dispatch(deleteTaskThunk(task.id))
    setMenuOpen(false)
  }

  const handleMouseEnterStatus = () => {
    const statusMenuRect = statusRef.current?.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    if (statusMenuRect && statusMenuRect.right + 200 > viewportWidth) {
      setSubmenuPosition('left')
    } else {
      setSubmenuPosition('right')
    }
    setStatusChangeOpen(true)
  }

  // Helper function to truncate title to 50 characters
  const truncateTitle = (title: string) => {
    return title.length > 50 ? title.substring(0, 50) + '...' : title
  }

  return (
    <div
      className={`relative p-4 rounded-lg shadow-md text-gray-900 dark:text-white cursor-pointer 
        ${isOverdue && !isDone ? 'bg-red-100 border-l-4 border-red-500' : 'bg-white dark:bg-gray-700'}`}
      onClick={() => onTaskClick(task)}
    >
      {/* Flag icon */}
      <FaFlag
        className={`absolute top-2 left-2 ${getFlagColor(task.status)}`}
        size={16}
      />

      {/* Overdue warning icon wrapped in Tooltip */}
      {isOverdue && !isDone && (
        <div className="flex gap-2 absolute top-2 right-6">
          <Tooltip placement="top" content="Task is Overdue!">
            <FaExclamationTriangle className="text-red-500" size={18} />
          </Tooltip>
        </div>
      )}

      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
        >
          <FaEllipsisV className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
            <ul className="py-1" onClick={(e) => e.stopPropagation()}>
              <li>
                <button
                  onClick={() => onEdit(task)}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </li>
              <li className="relative group" ref={statusRef}>
                <button
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onMouseEnter={handleMouseEnterStatus}
                  onMouseLeave={(e) => {
                    const relatedTarget = e.relatedTarget as Element
                    if (
                      !relatedTarget ||
                      !relatedTarget.closest('.status-submenu')
                    ) {
                      setStatusChangeOpen(false)
                    }
                  }}
                >
                  <span className="flex items-center">
                    <FaTasks className="mr-2" />
                    Status
                  </span>
                  <FaChevronRight className="ml-2" />
                </button>
                {statusChangeOpen && (
                  <div
                    className={`absolute ${
                      submenuPosition === 'right' ? 'left-full' : 'right-full'
                    } top-0 ml-1 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-20 status-submenu`}
                    onMouseEnter={() => setStatusChangeOpen(true)}
                    onMouseLeave={() => setStatusChangeOpen(false)}
                  >
                    <ul className="py-1">
                      {['todo', 'in-progress', 'review', 'done'].map(
                        (status) => (
                          <li key={status}>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => handleStatusChange(status)}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>

      <div
        className={`${
          isOverdue && !isDone ? 'dark:text-black' : 'dark:text-white'
        } ml-8`}
      >
        <h3
          className="text-sm font-semibold md:text-base lg:text-base"
          style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
        >
          {truncateTitle(task.title)}
        </h3>
        <p className="text-xs md:text-xs mb-1">
          Assignee: {task.assignee || 'Unassigned'}
        </p>
        <p className="text-xs md:text-xs mb-2">
          Due Date:{' '}
          {task.dueDate
            ? formatDate(task.dueDate, 'MMM dd, yyyy')
            : 'No due date'}
        </p>

        {/* Status Badge */}
        <span
          className={`text-xs font-bold py-1 px-2 rounded-full ${getBadgeColor(
            task.status,
          )}`}
        >
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>

        {/* Priority Badge */}
        <span
          className={`text-xs font-bold py-1 px-2 rounded-full ml-2 ${getPriorityBadgeColor(
            task.priority,
          )}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
    </div>
  )
}

// Utility functions to handle task status and priority color
function formatDate(dateString: string, _formatStr: string = 'MMM dd, yyyy') {
  const date = new Date(dateString)
  const formatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  return formatter.format(date)
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

function getPriorityBadgeColor(priority: string) {
  switch (priority) {
    case 'low':
      return 'bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800'
    case 'normal':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-200 dark:text-yellow-800'
    case 'high':
      return 'bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-200 dark:text-gray-800'
  }
}

export default TaskCard
