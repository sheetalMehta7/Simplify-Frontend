import React, { useState, useRef, useEffect } from 'react'
import { IoMdNotificationsOutline, IoMdSearch } from 'react-icons/io'
import { IoSettingsOutline } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { DarkThemeToggle, Kbd, TextInput } from 'flowbite-react'
import UserProfileDropdown from '../components/Dropdowns/UserProfileDropdown'
import NotificationDropdown from '../components/Dropdowns/NotificationDropdown'
import SearchModal from '../components/Modals/SearchModal'

const CgProfileWithRef = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => <CgProfile ref={ref} {...props} />)

const TopNav: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(2)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const profileIconRef = useRef<SVGSVGElement>(null)
  const notificationsIconRef = useRef<SVGSVGElement>(null)

  const toggleProfileDropdown = () => setIsProfileOpen((prev) => !prev)
  const toggleNotificationsDropdown = () =>
    setIsNotificationsOpen((prev) => !prev)

  const handleNotificationClick = () => {
    setNotifications(0)
    toggleNotificationsDropdown()
  }

  const openSearchModal = () => {
    setIsSearchModalOpen(true)
  }

  const closeSearchModal = () => {
    setIsSearchModalOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'K') {
        event.preventDefault()
        openSearchModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
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
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 shadow-md">
        <div className="flex items-center w-full max-w-4xl relative">
          <TextInput
            icon={IoMdSearch}
            placeholder="Search people, projects or tasks"
            className="w-full bg-gray-200 dark:bg-gray-700 hover: text-gray-900 dark:text-white rounded-lg"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>K</Kbd>
          </div>
        </div>
        <div className="flex gap-6 relative items-center pl-4">
          <DarkThemeToggle />
          <div
            className="relative flex items-center"
            ref={notificationsIconRef}
          >
            <IoMdNotificationsOutline
              className="text-2xl cursor-pointer"
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
          <IoSettingsOutline className="text-2xl cursor-pointer" />
          <div className="relative flex items-center">
            <CgProfileWithRef
              className="text-2xl cursor-pointer"
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
      </div>

      <SearchModal show={isSearchModalOpen} onClose={closeSearchModal} />
    </>
  )
}

export default TopNav
