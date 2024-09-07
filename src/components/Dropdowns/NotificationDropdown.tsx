import React from 'react'

interface NotificationDropdownProps {
  onClose: () => void
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
}) => {
  const notifications = [
    'New comment on your post',
    'User mentioned you in a comment',
    'New follower "naveensing575"',
  ]

  return (
    <div className="absolute top-5 right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white">
          Notifications
        </h3>
        <ul className="mt-2 space-y-2 divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li
                key={index}
                className="py-2 text-sm text-gray-700 dark:text-gray-300"
              >
                {notification}
              </li>
            ))
          ) : (
            <li className="py-2 text-sm text-gray-700 dark:text-gray-300">
              No new notifications
            </li>
          )}
        </ul>
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded-md"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationDropdown
