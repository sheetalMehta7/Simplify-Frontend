import React from 'react'

interface UserProfileDropdownProps {
  isOpen: boolean
  onClose: () => void
  iconRef: React.RefObject<SVGSVGElement>
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  isOpen,
  onClose,
  iconRef,
}) => {
  if (!isOpen) return null

  const dropdownPosition = {
    top: iconRef.current
      ? iconRef.current.getBoundingClientRect().bottom + window.scrollY
      : 0,
    left: iconRef.current ? iconRef.current.getBoundingClientRect().left : 0,
  }

  return (
    <div
      className="absolute z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
      style={{
        top: dropdownPosition.top + 30, // Adjusting position
        left: dropdownPosition.left,
        transform: 'translateX(-80%)',
      }}
    >
      <div className="p-4">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          Jese Leos
        </div>
        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
          @jeseleos
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600">
        <button
          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          Dashboard
        </button>
        <button
          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          Projects
        </button>
        <button
          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          Settings
        </button>
        <div className="border-t border-gray-200 dark:border-gray-600" />
        <button
          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          Log out
        </button>
      </div>
    </div>
  )
}

export default UserProfileDropdown
