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
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ onTabSelect }) => {
  const navigate = useNavigate()
  return (
    <aside className="h-full bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold tracking-wide pl-1">Simplify</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onTabSelect('Dashboard')}
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <MdDashboard className="mr-3 text-xl" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Issues')}
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <RiGitRepositoryCommitsFill className="mr-3 text-xl" />
              Issues
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Boards')}
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <BsKanban className="mr-3 text-xl" />
              Boards
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Calendar')}
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <MdCalendarToday className="mr-3 text-xl" />
              Calendar
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Projects')}
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <HiClipboardList className="mr-3 text-xl" />
              Projects
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Development')}
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <BsFillBarChartLineFill className="mr-3 text-xl" />
              Development
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Marketing')}
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <AiOutlineMail className="mr-3 text-xl" />
              Marketing
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabSelect('Sales')}
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
            >
              <BsClock className="mr-3 text-xl" />
              Sales
            </button>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <button
          className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
          onClick={() => navigate('/')}
        >
          <CgLogOut className="mr-3 text-xl" />
          Log out
        </button>
      </div>
    </aside>
  )
}
