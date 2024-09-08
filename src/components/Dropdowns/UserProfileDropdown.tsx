import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile } from '../../redux/features/user/userSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { logout } from '../../redux/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

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
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { profile, loading } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUserProfile())
    }
  }, [isOpen, dispatch])

  if (!isOpen) return null

  const dropdownPosition = {
    top: iconRef.current
      ? iconRef.current.getBoundingClientRect().bottom + window.scrollY
      : 0,
    left: iconRef.current ? iconRef.current.getBoundingClientRect().left : 0,
  }

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(logout())
    navigate('/', { replace: true })
  }

  return (
    <div
      className="absolute z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
      style={{
        top: dropdownPosition.top + 30,
        left: dropdownPosition.left,
        transform: 'translateX(-80%)',
      }}
    >
      <div className="p-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {profile?.name || 'Unknown User'}
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {profile?.email || '@unknown'}
            </div>
          </>
        )}
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
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  )
}

export default UserProfileDropdown
