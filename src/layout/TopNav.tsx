import React, { useState, useRef, useEffect } from 'react'
import { IoMdNotificationsOutline, IoMdSearch } from 'react-icons/io'
import { IoSettingsOutline } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { DarkThemeToggle, Kbd, TextInput } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, Task } from '../redux/features/tasks/tasksSlice'
import { fetchUserProfile } from '../redux/features/user/userSlice'
import { AppDispatch, RootState } from '../redux/store'
import UserProfileDropdown from '../components/Dropdowns/UserProfileDropdown'
import NotificationDropdown from '../components/Dropdowns/NotificationDropdown'
import SearchModal from '../components/Modals/SearchModal'

const CgProfileWithRef = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => <CgProfile ref={ref} {...props} />)

const TopNav: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)

  const profileIconRef = useRef<SVGSVGElement>(null)
  const notificationsIconRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Selectors
  const profile = useSelector((state: RootState) => state.user.profile)
  const profileLoading = useSelector((state: RootState) => state.user.loading)

  const tasks: { [key: string]: Task[] } = useSelector((state: RootState) => {
    return (
      state.tasks.personalTasks || {
        todo: [],
        'in-progress': [],
        review: [],
        done: [],
      }
    )
  })

  // Fetch user profile when profile dropdown is opened
  useEffect(() => {
    if (isProfileOpen && !profile) {
      dispatch(fetchUserProfile())
    }
  }, [isProfileOpen, dispatch, profile])

  // Fetch tasks when component mounts
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  // Calculate remaining days for a task's due date
  const calculateDaysRemaining = (dueDate: string) => {
    const currentDate = new Date()
    const taskDueDate = new Date(dueDate)
    const timeDifference = taskDueDate.getTime() - currentDate.getTime()
    return Math.ceil(timeDifference / (1000 * 3600 * 24))
  }

  // Filter tasks that have a due date within the next 5 days and are in 'todo' status
  const upcomingTasks = (Object.values(tasks) as Task[][])
    .flat()
    .filter(
      (task: Task) =>
        task.status === 'todo' && calculateDaysRemaining(task.dueDate) <= 5,
    )
    .sort((a, b) => a.priority.localeCompare(b.priority))

  // Update notification badge visibility based on filtered tasks
  useEffect(() => {
    setHasUnreadNotifications(upcomingTasks.length > 0)
  }, [upcomingTasks])

  // Handle clicks outside the dropdowns to close them
  const handleClickOutside = (event: MouseEvent) => {
    if (
      notificationsIconRef.current &&
      !notificationsIconRef.current.contains(event.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsNotificationsOpen(false)
      setIsProfileOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle notification icon click
  const handleNotificationClick = () => {
    setIsNotificationsOpen((prev) => !prev)
    if (!isNotificationsOpen) {
      setIsProfileOpen(false)
      setHasUnreadNotifications(false)
    }
  }

  // Handle profile icon click
  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev)
    if (!isProfileOpen) {
      setIsNotificationsOpen(false)
    }
  }

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 shadow-md">
        {/* Search Bar */}
        <div className="flex items-center w-full max-w-4xl relative">
          <TextInput
            icon={IoMdSearch}
            placeholder="Search people, projects or tasks"
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>K</Kbd>
          </div>
        </div>

        {/* Icons and Dropdowns */}
        <div className="flex gap-6 relative items-center pl-4">
          <DarkThemeToggle />

          {/* Notifications */}
          <div
            className="relative flex items-center"
            ref={notificationsIconRef}
            onClick={handleNotificationClick}
          >
            <IoMdNotificationsOutline className="text-2xl cursor-pointer" />
            {hasUnreadNotifications && upcomingTasks.length > 0 && (
              <div className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full">
                {upcomingTasks.length}
              </div>
            )}
            {isNotificationsOpen && (
              <NotificationDropdown
                taskNotifications={upcomingTasks}
                dropdownRef={dropdownRef}
                onClose={() => setIsNotificationsOpen(false)}
              />
            )}
          </div>

          {/* Settings */}
          <IoSettingsOutline className="text-2xl cursor-pointer" />

          {/* Profile */}
          <div className="relative flex items-center">
            <CgProfileWithRef
              className="text-2xl cursor-pointer"
              ref={profileIconRef}
              onClick={handleProfileClick}
            />
            {isProfileOpen && (
              <UserProfileDropdown
                dropdownRef={dropdownRef}
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                iconRef={profileIconRef}
                profile={profile}
                loading={profileLoading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        show={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  )
}

export default TopNav
