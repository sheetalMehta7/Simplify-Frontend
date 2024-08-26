import React, { useState, useRef, useEffect } from 'react'
import { IoMdNotificationsOutline, IoMdSearch } from 'react-icons/io'
import { RiSettingsLine } from 'react-icons/ri'
import { CgProfile } from 'react-icons/cg'
import UserProfileDropdown from '../components/UserProfileDropdown'
import NotificationDropdown from '../components/NotificationDropdown'

export const TopNav: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(2) // Example notification count
  const profileIconRef = useRef<SVGSVGElement>(null) // Ref for the profile icon
  const notificationsIconRef = useRef<SVGSVGElement>(null) // Ref for the notifications icon

  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen)

  const toggleNotificationsDropdown = () =>
    setIsNotificationsOpen(!isNotificationsOpen)

  const handleNotificationClick = () => {
    setNotifications(0) // Clear notifications on click
    toggleNotificationsDropdown() // Toggle dropdown visibility
  }

  useEffect(() => {
    // Close dropdowns if clicking outside of the dropdown and icons
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target as Node) &&
        notificationsIconRef.current &&
        !notificationsIconRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
        setIsNotificationsOpen(false)
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
      <div className="flex gap-6 relative">
        <div className="relative flex items-center" ref={notificationsIconRef}>
          <IoMdNotificationsOutline
            className="text-2xl cursor-pointer" // Increased icon size
            onClick={handleNotificationClick}
          />
          {notifications > 0 && (
            <div className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full">
              {notifications}
            </div>
          )}
          {isNotificationsOpen && (
            <NotificationDropdown
              onClose={() => setIsNotificationsOpen(false)}
            />
          )}
        </div>
        <RiSettingsLine className="text-2xl cursor-pointer" />{' '}
        {/* Increased icon size */}
        <CgProfile
          className="text-2xl cursor-pointer" // Increased icon size
          ref={profileIconRef}
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
