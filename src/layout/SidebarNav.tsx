// SidebarNav.tsx
import React, { useState } from 'react'
import { MdDashboard, MdCalendarToday } from 'react-icons/md'
import { HiClipboardList } from 'react-icons/hi'
import { RiGitRepositoryCommitsFill } from 'react-icons/ri'
import { BsFillBarChartLineFill } from 'react-icons/bs'
import { AiOutlineMail } from 'react-icons/ai'
import { CgLogOut } from 'react-icons/cg'
import { FaTeamspeak } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/features/auth/authSlice'

const SidebarNav: React.FC = () => {
  const [isShrinked, setIsShrinked] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/', { replace: true })
  }

  const navItems = [
    {
      icon: <MdDashboard className="text-xl" />,
      label: 'Dashboard',
      path: 'my-tasks',
    },
    {
      icon: <RiGitRepositoryCommitsFill className="text-xl" />,
      label: 'Issues',
      path: 'issues',
    },
    {
      icon: <FaTeamspeak className="text-xl" />,
      label: 'Teams Board',
      path: 'teams',
    },
    {
      icon: <HiClipboardList className="text-xl" />,
      label: 'Projects',
      path: 'projects',
    },
    {
      icon: <MdCalendarToday className="text-xl" />,
      label: 'Calendar',
      path: 'calendar',
    },
    {
      icon: <BsFillBarChartLineFill className="text-xl" />,
      label: 'Development',
      path: 'development',
    },
    {
      icon: <AiOutlineMail className="text-xl" />,
      label: 'Marketing',
      path: 'marketing',
    },
  ]

  return (
    <div
      className={`flex flex-col h-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 transition-all duration-300 shadow-lg ${isShrinked ? 'w-14' : 'w-52'}`}
    >
      {/* Toggle Button */}
      <div className="p-4 flex justify-between items-center">
        {!isShrinked && (
          <h1 className="text-lg font-bold tracking-wide truncate">Simplify</h1>
        )}
        <button
          onClick={() => setIsShrinked(!isShrinked)}
          className="text-xl p-2"
        >
          {isShrinked ? '>' : '<'}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => navigate(`/dashboard/${item.path}`)}
                className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md w-full text-left transition-all duration-200"
              >
                {item.icon}
                {!isShrinked && (
                  <span className="ml-3 text-sm md:text-base">
                    {item.label}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="pb-3">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-4 hover:bg-gray-200 dark:hover:bg-red-700 rounded-lg w-full transition-all duration-300"
        >
          <CgLogOut className="text-xl" />
          {!isShrinked && (
            <span className="ml-3 text-sm md:text-base">Log out</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default SidebarNav
