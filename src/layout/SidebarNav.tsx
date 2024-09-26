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

interface SidebarNavProps {
  onTabSelect: (tab: string) => void
  onToggle: () => void
  isShrinked: boolean
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  onTabSelect,
  onToggle,
  isShrinked,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>('Dashboard')
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
      tab: 'Dashboard',
    },
    {
      icon: <RiGitRepositoryCommitsFill className="text-xl" />,
      label: 'Issues',
      tab: 'Issues',
    },
    {
      icon: <FaTeamspeak className="text-xl" />,
      label: 'Teams Board',
      tab: 'TeamsBoard',
    },
    {
      icon: <HiClipboardList className="text-xl" />,
      label: 'Projects',
      tab: 'Projects',
    },
    {
      icon: <MdCalendarToday className="text-xl" />,
      label: 'Calendar',
      tab: 'Calendar',
    },
    {
      icon: <BsFillBarChartLineFill className="text-xl" />,
      label: 'Development',
      tab: 'Development',
    },
    {
      icon: <AiOutlineMail className="text-xl" />,
      label: 'Marketing',
      tab: 'Marketing',
    },
  ]

  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab)
    onTabSelect(tab)
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 z-30 left-0 h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 flex flex-col transition-all duration-300 shadow-lg rounded-r-lg ${
          isShrinked ? 'w-14' : 'w-52'
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          {!isShrinked && (
            <h1 className="text-lg font-bold tracking-wide truncate">
              Simplify
            </h1>
          )}
          <button onClick={onToggle} className="text-xl p-2">
            {isShrinked ? '>' : '<'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 overflow-hidden">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.tab}>
                <button
                  onClick={() => handleTabSelect(item.tab)}
                  className={`flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md w-full text-left transition-all duration-200 ${
                    selectedTab === item.tab
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : ''
                  }`}
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
            className="flex items-center justify-center p-4 hover:bg-gray-200 dark:hover:bg-red-700 rounded-lg w-full transition-all duration-300"
            onClick={handleLogout}
          >
            <CgLogOut className="text-xl" />
            {!isShrinked && (
              <span className="ml-3 text-sm md:text-base">Log out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Section */}
      <main className="ml-52 p-6 w-full">
        {selectedTab === 'Projects' && <div>Projects Content</div>}
        {selectedTab === 'Dashboard' && <div>Dashboard Content</div>}
        {selectedTab === 'TeamsBoard' && <div>Teams Board Content</div>}
      </main>
    </div>
  )
}

export default SidebarNav
