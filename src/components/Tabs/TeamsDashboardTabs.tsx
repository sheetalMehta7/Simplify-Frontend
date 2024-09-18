import React, { useState } from 'react'
import { MdDashboard, MdGroups, MdPerson, MdCreate } from 'react-icons/md'
import { VscSettings } from 'react-icons/vsc'
import FilterDropdown from '../Modals/FilterModal'
import TeamModal from '../Modals/TeamModal'
import { Button } from 'flowbite-react'
import Teams from '../Tasks/Teams/Teams'

interface Tab {
  name: string
  icon: React.ReactNode
}

const TABS: Tab[] = [
  { name: 'Team Tasks', icon: <MdDashboard /> },
  { name: 'Teams', icon: <MdGroups /> },
  { name: 'Members', icon: <MdPerson /> },
]

const TeamsDashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].name)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  const [filters, setFilters] = useState<{
    date: string
    assignee: string
    status: string
    teamId: string
  }>({
    date: '',
    assignee: '',
    status: '',
    teamId: '',
  })

  // Simulated teams array, you should replace it with your actual teams data
  const teams = [] // Empty array represents no teams available

  const handleTabClick = (tabName: string) => setActiveTab(tabName)
  const toggleFilter = () => setIsFilterOpen((prev) => !prev)

  const openCreateTeamModal = () => {
    setSelectedTeam(null)
    setModalMode('create')
    setIsTeamModalOpen(true)
  }

  const openEditTeamModal = (team: any) => {
    setSelectedTeam(team)
    setModalMode('edit')
    setIsTeamModalOpen(true)
  }

  const closeTeamModal = (_teamUpdated: boolean = false) => {
    setIsTeamModalOpen(false)
    setSelectedTeam(null)
  }

  const applyFilters = (filterValues: {
    date: string
    assignee: string
    status: string
    teamId: string
  }) => {
    setFilters(filterValues)
  }

  const clearAllFilters = () => {
    setFilters({ date: '', assignee: '', status: '', teamId: '' })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Tabs, Filter, and Create Team Buttons */}
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
          <div className="flex justify-between items-center">
            {/* Tab Buttons */}
            <TabButtons activeTab={activeTab} onTabClick={handleTabClick} />

            {/* Action Buttons: Filter and Create Team */}
            <div className="flex space-x-2 items-center">
              <Button
                onClick={toggleFilter}
                color="gray"
                className="flex items-center justify-center h-10 text-sm font-medium px-4 py-2"
              >
                <VscSettings className="mr-2" /> Filter
              </Button>
              <Button
                onClick={openCreateTeamModal}
                gradientDuoTone="purpleToBlue"
                className="flex items-center justify-center h-10 text-sm font-medium px-4 py-2"
              >
                <MdCreate className="mr-2" /> Create Team
              </Button>
            </div>
          </div>

          {/* Filter Modal */}
          {isFilterOpen && (
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onApply={applyFilters}
              onClearAll={clearAllFilters}
            />
          )}

          {/* Team Modal for both Create and Edit */}
          <TeamModal
            isOpen={isTeamModalOpen}
            onClose={closeTeamModal}
            mode={modalMode}
            team={selectedTeam}
          />
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {activeTab === 'Team Tasks' && (
            <>
              {/* Simulate no tasks available */}
              {teams.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-center">
                  <p className="text-gray-900 dark:text-gray-200 text-lg mb-4">
                    No tasks available. Please create a new task.
                  </p>
                  <Button
                    onClick={openCreateTeamModal}
                    gradientDuoTone="purpleToBlue"
                    className="flex items-center justify-center h-10 text-sm font-medium px-4 py-2"
                  >
                    <MdCreate className="mr-2" /> Create New Task
                  </Button>
                </div>
              ) : (
                <div>Team Tasks Content</div>
              )}
            </>
          )}
          {activeTab === 'Teams' && (
            <>
              {teams.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-center">
                  <p className="text-gray-900 dark:text-gray-200 text-lg mb-4">
                    No teams available. Please create a new team.
                  </p>
                  <Button
                    onClick={openCreateTeamModal}
                    gradientDuoTone="purpleToBlue"
                    className="flex items-center justify-center h-10 text-sm font-medium px-4 py-2"
                  >
                    <MdCreate className="mr-2" /> Create New Team
                  </Button>
                </div>
              ) : (
                <Teams onEditTeam={openEditTeamModal} />
              )}
            </>
          )}
          {activeTab === 'Members' && <div>Team Members List</div>}
        </div>
      </div>
    </div>
  )
}

export default TeamsDashboardTabs

// Utility Components (Updated for equal and responsive sizing)

interface TabButtonsProps {
  tabs?: Tab[] // Make tabs optional to use default value
  activeTab: string
  onTabClick: (tabName: string) => void
}

const TabButtons: React.FC<TabButtonsProps> = ({
  tabs = [
    { name: 'Team Tasks', icon: <MdDashboard /> },
    { name: 'Teams', icon: <MdGroups /> },
    { name: 'Members', icon: <MdPerson /> },
  ],
  activeTab,
  onTabClick,
}) => (
  <div className="flex space-x-2 md:space-x-4">
    {tabs.map((tab) => (
      <button
        key={tab.name}
        className={`flex items-center justify-center w-40 h-10 rounded-md transition-all duration-300 text-sm font-medium ${
          tab.name === activeTab
            ? 'text-white bg-blue-500'
            : 'text-gray-900 dark:text-gray-200 hover:bg-blue-500 hover:text-white'
        }`}
        onClick={() => onTabClick(tab.name)}
      >
        <span className="mr-2">{tab.icon}</span>
        <span>{tab.name}</span>
      </button>
    ))}
  </div>
)
