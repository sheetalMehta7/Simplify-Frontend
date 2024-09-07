import React, { ReactNode, useState, useEffect, useCallback } from 'react'
import SidebarNav from './SidebarNav'
import TopNav from './TopNav'
import { Outlet } from 'react-router-dom'

interface DashboardLayoutProps {
  onTabSelect: (tab: string) => void
  children?: ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onTabSelect,
  children,
}) => {
  const [isShrinked, setIsShrinked] = useState(window.innerWidth <= 1024)

  const handleResize = useCallback(() => {
    setIsShrinked(window.innerWidth <= 1024)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const handleSidebarToggle = useCallback(() => {
    setIsShrinked((prev) => !prev)
  }, [])

  return (
    <div className="flex min-h-screen">
      <aside
        className={`transition-all duration-300 ${isShrinked ? 'w-14' : 'w-52'}`}
      >
        <SidebarNav
          onTabSelect={onTabSelect}
          onToggle={handleSidebarToggle}
          isShrinked={isShrinked}
        />
      </aside>

      <div className="flex-1 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-opacity duration-300 ease-in-out">
        <TopNav />
        <main className="flex-1 p-1 md:p-2">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
