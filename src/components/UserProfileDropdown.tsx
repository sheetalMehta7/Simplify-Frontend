import React from 'react'
import { Transition } from '@headlessui/react'

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
  // Calculate dropdown position relative to the profile icon
  const dropdownPosition = {
    top: iconRef.current
      ? iconRef.current.getBoundingClientRect().bottom + window.scrollY
      : 0,
    left: iconRef.current ? iconRef.current.getBoundingClientRect().left : 0,
  }

  return (
    <Transition
      show={isOpen}
      enter="transition ease-out duration-200"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-150"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div
        className="absolute z-50 bg-slate-800 border border-white-300 rounded-lg shadow-lg p-3 w-32"
        style={{
          top: dropdownPosition.top + 40, // Adjust for slight spacing
          left: dropdownPosition.left,
          transform: 'translateX(-10px)', // Ensure it doesn't cover the icon
        }}
      >
        <div
          className="flex items-center mb-4 cursor-pointer p-2 hover:bg-slate-700 rounded"
          onClick={onClose}
        >
          <span className="text-sm font-semibold">John Doe</span>
        </div>
        <div className="flex items-center mb-4 cursor-pointer p-2 hover:bg-slate-700 rounded">
          <span className="text-sm">Projects</span>
        </div>
        <div className="flex items-center mb-4 cursor-pointer p-2 hover:bg-slate-700 rounded">
          <span className="text-sm">Company</span>
        </div>
        <div className="flex items-center cursor-pointer p-2 hover:bg-slate-700 rounded">
          <span className="text-sm">Settings</span>
        </div>
      </div>
    </Transition>
  )
}

export default UserProfileDropdown
