import React, { useState, useRef } from 'react'
import {
  MdDashboard,
  MdGroups,
  MdPerson,
  MdCreate,
  MdCancel,
} from 'react-icons/md'
import { VscSettings } from 'react-icons/vsc'
import FilterDropdown from '../Modals/FilterModal'
import TeamModal from '../Modals/TeamModal' // Use the common TeamModal
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
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create') // Track the mode for TeamModal
  const [selectedTeam, setSelectedTeam] = useState<any>(null) // Track the team for editing
  const [filters, setFilters] = useState<{
    date: string
    assignee: string
    status: string
  }>({
    date: '',
    assignee: '',
    status: '',
  })

  const filterButtonRef = useRef<HTMLButtonElement>(null)

  const handleTabClick = (tabName: string) => setActiveTab(tabName)
  const toggleFilter = () => setIsFilterOpen((prev) => !prev)

  // Open modal for creating a new team
  const openCreateTeamModal = () => {
    setSelectedTeam(null)
    setModalMode('create')
    setIsTeamModalOpen(true)
  }

  // Open modal for editing an existing team
  const openEditTeamModal = (team: any) => {
    setSelectedTeam(team) // Set the selected team for editing
    setModalMode('edit') // Set to edit mode
    setIsTeamModalOpen(true)
  }

  // Close the modal and refresh the teams if needed
  const closeTeamModal = (teamUpdated: boolean = false) => {
    setIsTeamModalOpen(false)
    setSelectedTeam(null)
    if (teamUpdated) {
      // Refresh the teams list if a team was created or updated
      // (Assume that Teams component is already handling the fetch on its own)
    }
  }

  const applyFilters = (filterValues: {
    date: string
    assignee: string
    status: string
  }) => {
    setFilters(filterValues)
  }

  const clearAllFilters = () => {
    setFilters({ date: '', assignee: '', status: '' })
  }

  const removeFilter = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: '',
    }))
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Tabs and Filter/Team buttons */}
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <TabButtons
              tabs={TABS}
              activeTab={activeTab}
              onTabClick={handleTabClick}
            />
            <div className="mt-4 md:mt-0 flex space-x-2">
              <FilterButton
                ref={filterButtonRef}
                isFilterOpen={isFilterOpen}
                onClick={toggleFilter}
              />
              <CreateTeamButton onClick={openCreateTeamModal} />
            </div>
          </div>

          {/* Filter dropdown */}
          {isFilterOpen && (
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onApply={applyFilters}
              onClearAll={clearAllFilters}
            />
          )}

          {/* Active filters displayed as badges */}
          {Object.values(filters).some((filter) => filter) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.date && (
                <FilterTag
                  label={`Date: ${filters.date}`}
                  onRemove={() => removeFilter('date')}
                />
              )}
              {filters.assignee && (
                <FilterTag
                  label={`Assignee: ${filters.assignee}`}
                  onRemove={() => removeFilter('assignee')}
                />
              )}
              {filters.status && (
                <FilterTag
                  label={`Status: ${filters.status}`}
                  onRemove={() => removeFilter('status')}
                />
              )}
              <Button color="red" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          )}

          {/* Team Modal for both Create and Edit */}
          <TeamModal
            isOpen={isTeamModalOpen}
            onClose={closeTeamModal}
            mode={modalMode} // Pass the mode to determine create or edit
            team={selectedTeam} // Pass selected team for edit mode
          />
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {activeTab === 'Team Tasks' && <div>Team Tasks Content</div>}
          {activeTab === 'Teams' && (
            <Teams onEditTeam={openEditTeamModal} />
          )}{' '}
          {/* Pass edit handler to Teams component */}
          {activeTab === 'Members' && <div>Team Members List</div>}
        </div>
      </div>
    </div>
  )
}

export default TeamsDashboardTabs

// Utility Components (Unchanged from original code)

interface FilterTagProps {
  label: string
  onRemove: () => void
}

const FilterTag: React.FC<FilterTagProps> = ({ label, onRemove }) => (
  <div className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full m-1">
    <span className="mr-2">{label}</span>
    <button onClick={onRemove} className="text-red-500 hover:text-red-700">
      <MdCancel size={18} />
    </button>
  </div>
)

interface TabButtonsProps {
  tabs: Tab[]
  activeTab: string
  onTabClick: (tabName: string) => void
}

const TabButtons: React.FC<TabButtonsProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => (
  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
    {tabs.map((tab) => (
      <button
        key={tab.name}
        className={`flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 border border-gray-100 ${
          tab.name === activeTab
            ? 'text-white bg-blue-500'
            : 'text-gray-900 dark:text-gray-200 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500'
        }`}
        onClick={() => onTabClick(tab.name)}
      >
        {tab.icon}
        <span className="ml-2">{tab.name}</span>
      </button>
    ))}
  </div>
)

interface FilterButtonProps {
  isFilterOpen: boolean
  onClick: () => void
}

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ isFilterOpen, onClick }, ref) => (
    <button
      ref={ref}
      className="flex items-center justify-center px-4 py-2 text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 border border-gray-100 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
      onClick={onClick}
    >
      <VscSettings className="mr-2" />
      Filter
    </button>
  ),
)

const CreateTeamButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center px-4 py-2 text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 border border-gray-100 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
  >
    <MdCreate className="h-6 mr-2" />
    Create Team
  </button>
)
