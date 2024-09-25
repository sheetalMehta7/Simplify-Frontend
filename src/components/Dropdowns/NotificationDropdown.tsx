import React from 'react'
import { LuBellRing } from 'react-icons/lu'
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
  const handleNotificationItemClick = (taskId: string) => {
    console.log(`Task ${taskId} clicked!`)
  }

  // Function to get the number of days remaining for a task
  const getDaysRemaining = (dueDate: string) => {
    const currentDate = new Date()
    const taskDueDate = new Date(dueDate)
    const timeDifference = taskDueDate.getTime() - currentDate.getTime()
    return Math.ceil(timeDifference / (1000 * 3600 * 24))
  }

  // Filter out tasks that are not in "todo" status and those that are past due
  const upcomingTodoTasks = taskNotifications.filter(
    (task) => task.status === 'todo' && getDaysRemaining(task.dueDate) >= 0,
  )

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
          {upcomingTodoTasks.length > 0 ? (
            upcomingTodoTasks.map((task) => {
              const daysRemaining = getDaysRemaining(task.dueDate)

              // Determine bell icon style based on due date
              let bellClass = 'text-gray-500 dark:text-gray-300'
              if (daysRemaining === 0) {
                bellClass = 'text-red-500' // Red for tasks due today
              } else if (daysRemaining === 2) {
                bellClass = 'text-yellow-300' // Yellow for tasks due in 2 days
              }

              // Conditional class for highlighting the due date
              let dueDateClass = 'text-gray-500'
              if (daysRemaining === 0) {
                dueDateClass = 'text-red-500' // Red for tasks due today
              } else if (daysRemaining === 2) {
                dueDateClass = 'text-yellow-300' // Yellow for tasks due in 2 days
              }

              return (
                <li
                  key={task.id}
                  className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => handleNotificationItemClick(task.id)}
                >
                  <LuBellRing className={`h-5 w-5 mr-2 ${bellClass}`} />{' '}
                  {/* LuBellRing icon */}
                  <div>
                    <p>{task.title}</p>
                    <p className={`text-xs ${dueDateClass}`}>
                      {daysRemaining === 0
                        ? 'Due today'
                        : `Due in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`}
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
