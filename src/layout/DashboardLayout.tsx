import React, { ReactNode, useState, useEffect } from 'react'
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
  const [isShrinked, setIsShrinked] = useState(false)

  // Automatically shrink the sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsShrinked(true)
      } else {
        setIsShrinked(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initialize the state based on the current window size

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSidebarToggle = () => {
    setIsShrinked(!isShrinked)
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${isShrinked ? 'w-14' : 'w-52'}`}
      >
        <SidebarNav
          onTabSelect={onTabSelect}
          onToggle={handleSidebarToggle}
          isShrinked={isShrinked}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
        <TopNav />
        <main className="flex-1">
          {children}
          <Outlet /> {/* Dynamically render the child routes here */}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
