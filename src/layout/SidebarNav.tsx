import React from 'react'
import { MdDashboard, MdCalendarToday } from 'react-icons/md'
import { HiClipboardList } from 'react-icons/hi'
import { RiGitRepositoryCommitsFill } from 'react-icons/ri'
import { BsKanban, BsFillBarChartLineFill, BsClock } from 'react-icons/bs'
import { AiOutlineMail } from 'react-icons/ai'
import { CgLogOut } from 'react-icons/cg'
import { Link } from 'react-router-dom'

export const SidebarNav: React.FC = () => {
  return (
    <aside className="h-full bg-gray-800 text-white flex flex-col ">
      <div className="p-4">
        <h1 className="text-xl font-bold tracking-wide pl-1">Simplify</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <MdDashboard className="mr-3 text-xl" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/issues"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <RiGitRepositoryCommitsFill className="mr-3 text-xl" />
              Issues
            </Link>
          </li>
          <li>
            <Link
              to="/boards"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <BsKanban className="mr-3 text-xl" />
              Boards
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <MdCalendarToday className="mr-3 text-xl" />
              Calendar
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <HiClipboardList className="mr-3 text-xl" />
              Projects
            </Link>
          </li>
          <li>
            <Link
              to="/development"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <BsFillBarChartLineFill className="mr-3 text-xl" />
              Development
            </Link>
          </li>
          <li>
            <Link
              to="/marketing"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <AiOutlineMail className="mr-3 text-xl" />
              Marketing
            </Link>
          </li>
          <li>
            <Link
              to="/sales"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <BsClock className="mr-3 text-xl" />
              Sales
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <Link
          to="/"
          className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
        >
          <CgLogOut className="mr-3 text-xl" />
          Log out
        </Link>
      </div>
    </aside>
  )
}
