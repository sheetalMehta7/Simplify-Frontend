import React from 'react';
import { MdDashboard, MdCalendarToday } from 'react-icons/md';
import { HiClipboardList } from 'react-icons/hi';
import { RiGitRepositoryCommitsFill } from 'react-icons/ri';
import { BsKanban } from 'react-icons/bs';
import { CgLogOut } from 'react-icons/cg';
import { NavLink, useNavigate } from 'react-router-dom';

export const SidebarNav = () => {
  const navigate = useNavigate();
  const navItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: <MdDashboard className="mr-3 text-xl" /> },
    { path: '/user/personal-tasks', label: 'Personal Tasks', icon: <RiGitRepositoryCommitsFill className="mr-3 text-xl" /> },
    { path: '/user/teams', label: 'Teams', icon: <HiClipboardList className="mr-3 text-xl" /> },
    { path: '/user/team-tasks', label: 'Team Tasks', icon: <BsKanban className="mr-3 text-xl" /> },
    { path: '/user/calendar', label: 'Calendar', icon: <MdCalendarToday className="mr-3 text-xl" /> }
  ];

  const activeClassName = "bg-gray-700";

  return (
    <aside className="h-full flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold tracking-wide pl-1">Simplify</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-4 rounded-lg w-full text-left hover:bg-gray-700 ${
                    isActive ? activeClassName : ""
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <button
          onClick={() => navigate('/logout')}
          className="flex items-center p-4 hover:bg-gray-700 rounded-lg w-full text-left"
        >
          <CgLogOut className="mr-3 text-xl" />
          Log out
        </button>
      </div>
    </aside>
  );
};
