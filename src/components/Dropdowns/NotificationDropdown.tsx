import React from 'react'
import { FaBell } from 'react-icons/fa'
import { Task } from '../../redux/features/tasks/tasksSlice'

interface NotificationDropdownProps {
  taskNotifications: Task[]
  dropdownRef: React.RefObject<HTMLDivElement>
  onClose: () => void
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  taskNotifications,
  dropdownRef,
}) => {
  // Click handler for when a notification item is clicked
  const handleNotificationItemClick = (taskId: string) => {
    console.log(`Task ${taskId} clicked!`)
    // Add logic for what should happen when the task is clicked
  }

  // Function to get the number of days remaining for a task
  const getDaysRemaining = (dueDate: string) => {
    const currentDate = new Date()
    const taskDueDate = new Date(dueDate)
    const timeDifference = taskDueDate.getTime() - currentDate.getTime()
    return Math.ceil(timeDifference / (1000 * 3600 * 24)) // Convert milliseconds to days
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-5 right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
    >
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white">
          Notifications
        </h3>
        <ul className="mt-2 space-y-2 divide-y divide-gray-200 dark:divide-gray-700">
          {taskNotifications.length > 0 ? (
            taskNotifications.map((task) => {
              const daysRemaining = getDaysRemaining(task.dueDate)

              // Conditional class for highlighting the due date
              let dueDateClass = 'text-gray-500'
              if (daysRemaining === 1) {
                dueDateClass = 'text-red-500' // Highlight in red if due in 1 day
              } else if (daysRemaining === 2) {
                dueDateClass = 'text-yellow-500' // Highlight in yellow if due in 2 days
              }

              return (
                <li
                  key={task.id}
                  className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleNotificationItemClick(task.id)}
                >
                  <FaBell className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
                  <div>
                    <p>{task.title}</p>
                    <p className={`text-xs ${dueDateClass}`}>
                      Due in {daysRemaining} day{daysRemaining > 1 ? 's' : ''}
                    </p>
                  </div>
                </li>
              )
            })
          ) : (
            <li className="py-2 text-sm text-gray-700 dark:text-gray-300">
              No upcoming tasks
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default NotificationDropdown
