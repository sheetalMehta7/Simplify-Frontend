import React, { useState, useRef, useEffect } from 'react'
import { IoMdNotificationsOutline, IoMdSearch } from 'react-icons/io'
import { RiSettingsLine } from 'react-icons/ri'
import { CgProfile } from 'react-icons/cg'
import UserProfileDropdown from '../components/UserProfile'

export const TopNav: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileIconRef = useRef<SVGSVGElement>(null) // Ref for the profile icon

  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen)

  useEffect(() => {
    // Close dropdown if clicking outside of the dropdown and icon
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative flex items-center justify-between bg-gray-800 text-white p-4">
      <div className="flex items-center w-full max-w-2xl relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoMdSearch className="text-gray-400 text-xl" />
        </span>
        <input
          type="text"
          placeholder="Search people, projects or tasks"
          className="pl-10 w-full bg-gray-700 text-white rounded-lg border-none focus:ring-0"
          style={{ width: '100%' }}
        />
      </div>
      <div className="flex gap-4 relative">
        <IoMdNotificationsOutline className="text-xl" />
        <RiSettingsLine className="text-xl" />
        <CgProfile
          className="text-xl cursor-pointer"
          // ref={profileIconRef}
          onClick={toggleProfileDropdown}
        />
        {isProfileOpen && (
          <UserProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            iconRef={profileIconRef}
          />
        )}
      </div>
    </div>
  )
}
