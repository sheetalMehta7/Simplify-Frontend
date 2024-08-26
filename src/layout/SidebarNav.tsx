import { MdDashboard } from 'react-icons/md'
import { HiUserCircle, HiClipboardList } from 'react-icons/hi'
import { CgLogOut } from 'react-icons/cg'
import { Link } from 'react-router-dom'

export const SidebarNav: React.FC = () => {
  return (
    <aside className="h-full bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold">Simplify</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <MdDashboard className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <HiUserCircle className="mr-3" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
            >
              <HiClipboardList className="mr-3" />
              Projects
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <Link
          to="/"
          className="flex items-center p-4 hover:bg-gray-700 rounded-lg"
        >
          <CgLogOut className="mr-3" />
          Log out
        </Link>
      </div>
    </aside>
  )
}
