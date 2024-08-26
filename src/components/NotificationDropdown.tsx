import React from 'react'

interface NotificationDropdownProps {
  onClose: () => void
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
}) => {
  // Example notifications list
  const notifications = [
    'New comment on your post',
    'User mentioned you in a comment',
    'New follower "naveensing575"',
  ]

  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-white-300 rounded-lg shadow-lg z-50">
      <div className="p-4 text-sm">
        <h3 className=" font-bold mb-2 text-center text-yellow-200">
          Notifications
        </h3>
        <ul className="space-y-2 ">
          {notifications.map((notification, index) => (
            <>
              <li key={index} className="p-2 hover:bg-slate-700 rounded">
                {notification}
              </li>
              <hr />
            </>
          ))}
        </ul>
        <button
          className="mt-3 w-full p-1 bg-slate-500 rounded"
          onClick={onClose}
        >
          Clear All
        </button>
      </div>
    </div>
  )
}

export default NotificationDropdown
