import React, { useMemo } from 'react'
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

  const currentDate = useMemo(() => new Date(), [])

  const upcomingTodoTasks = useMemo(
    () =>
      taskNotifications
        .filter((task) => task.status === 'todo')
        .map((task) => ({
          ...task,
          daysRemaining: Math.ceil(
            (new Date(task.dueDate).getTime() - currentDate.getTime()) /
              (1000 * 3600 * 24),
          ),
        }))
        .filter((task) => task.daysRemaining >= 0),
    [taskNotifications, currentDate],
  )

  const getBellClass = (daysRemaining: number) => {
    if (daysRemaining === 0) return 'text-red-500'
    if (daysRemaining === 2) return 'text-yellow-300'
    return 'text-gray-500 dark:text-gray-300'
  }

  const getDueDateClass = (daysRemaining: number) => {
    if (daysRemaining === 0) return 'text-red-500'
    if (daysRemaining === 2) return 'text-yellow-300'
    return 'text-gray-500'
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
          {upcomingTodoTasks.length > 0 ? (
            upcomingTodoTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => handleNotificationItemClick(task.id)}
              >
                <LuBellRing
                  className={`h-5 w-5 mr-2 ${getBellClass(task.daysRemaining)}`}
                />
                <div>
                  <p>{task.title}</p>
                  <p
                    className={`text-xs ${getDueDateClass(task.daysRemaining)}`}
                  >
                    {task.daysRemaining === 0
                      ? 'Due today'
                      : `Due in ${task.daysRemaining} day${task.daysRemaining > 1 ? 's' : ''}`}
                  </p>
                </div>
              </li>
            ))
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
