import React from 'react'
import { MdDashboard, MdCalendarToday } from 'react-icons/md'
import { HiClipboardList } from 'react-icons/hi'
import { RiGitRepositoryCommitsFill } from 'react-icons/ri'
import { BsKanban, BsFillBarChartLineFill, BsClock } from 'react-icons/bs'
import { AiOutlineMail } from 'react-icons/ai'
import { CgLogOut } from 'react-icons/cg'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 flex flex-col transition-all duration-300 shadow-lg rounded-r-lg ${
        isShrinked ? 'w-14' : 'w-52'
      }`}
    >
      <div className="p-4 flex justify-between items-center border-gray-300 dark:border-gray-700">
        {!isShrinked && (
          <h1 className="text-lg font-bold tracking-wide">Simplify</h1>
        )}
        <button onClick={onToggle} className="text-xl p-2">
          {isShrinked ? '>' : '<'}
        </button>
      </div>
      <nav className="flex-1 space-y-2 scrollbar-hide">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onTabSelect('Dashboard')}
              className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <MdDashboard className="text-xl" />
              {!isShrinked && <span className="ml-3">Dashboard</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Issues')}
              className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <RiGitRepositoryCommitsFill className="text-xl" />
              {!isShrinked && <span className="ml-3">Issues</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Boards')}
              className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <BsKanban className="text-xl" />
              {!isShrinked && <span className="ml-3">Boards</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Calendar')}
              className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <MdCalendarToday className="text-xl" />
              {!isShrinked && <span className="ml-3">Calendar</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Projects')}
              className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <HiClipboardList className="text-xl" />
              {!isShrinked && <span className="ml-3">Projects</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Development')}
              className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <BsFillBarChartLineFill className="text-xl" />
              {!isShrinked && <span className="ml-3">Development</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Marketing')}
              className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <AiOutlineMail className="text-xl" />
              {!isShrinked && <span className="ml-3">Marketing</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Sales')}
              className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <BsClock className="text-xl" />
              {!isShrinked && <span className="ml-3">Sales</span>}
            </button>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <button
          className="flex items-center justify-center p-4 hover:bg-gray-200 dark:hover:bg-red-700 rounded-lg w-full transition-all duration-300 text-left"
          onClick={() => navigate('/')}
        >
          <CgLogOut className="text-xl" />
          {!isShrinked && <span className="ml-3">Log out</span>}
        </button>
      </div>
    </aside>
  )
}

export default SidebarNav
