import React, { useState, useEffect } from 'react'
import { MdDashboard, MdGroups, MdPerson, MdCreate } from 'react-icons/md'
import { VscSettings } from 'react-icons/vsc'
import FilterDropdown from '../Modals/FilterModal'
import TeamModal from '../Modals/TeamModal'
import CreateTaskModal from '../Modals/CreateTaskModal'
import { Button, Select, Label } from 'flowbite-react'
import Teams from '../Tasks/Teams/Teams'
import TeamTaskBoard from '../Tasks/Teams/TeamTaskBoard'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchTeams,
  fetchTeamMembers,
} from '../../redux/features/teams/teamSlice'
import { AppDispatch, RootState } from '../../redux/store'

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
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] =
    useState<boolean>(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [currentTeamId, setCurrentTeamId] = useState<string>('') // Track the current team selection

  const dispatch: AppDispatch = useDispatch()
  const teams = useSelector((state: RootState) => state.teams.teams)
  const teamMembers = useSelector((state: RootState) => state.teams.teamMembers)
  const loadingTeams = useSelector((state: RootState) => state.teams.loading)
  const teamsError = useSelector((state: RootState) => state.teams.error)

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

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  // Automatically select the most recently created team when teams are fetched
  useEffect(() => {
    if (teams.length > 0) {
      const latestTeam = teams.reduce((prev, current) =>
        new Date(prev.created) > new Date(current.created) ? prev : current,
      )
      setCurrentTeamId(latestTeam.id)
      dispatch(fetchTeamMembers(latestTeam.id))
      setFilters((prev) => ({ ...prev, teamId: latestTeam.id }))
    }
  }, [teams, dispatch])

  const handleTeamSelect = (teamId: string) => {
    setCurrentTeamId(teamId)
    dispatch(fetchTeamMembers(teamId)) // Fetch members of the selected team
    setFilters((prev) => ({ ...prev, teamId })) // Update filters with the selected team
  }

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

  const closeTeamModal = () => {
    setIsTeamModalOpen(false)
    setSelectedTeam(null)
  }

  const openCreateTaskModal = () => {
    setIsCreateTaskModalOpen(true)
  }

  const closeCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false)
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
      {/* Header with Tabs and Right-Side Buttons */}
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            {/* Tab Buttons on the left */}
            <TabButtons activeTab={activeTab} onTabClick={handleTabClick} />

            {/* Team Dropdown to select current team */}
            {activeTab === 'Team Tasks' && (
              <div className="w-full md:w-44">
                <Label htmlFor="teamSelect" value="Select Team" />
                <Select
                  id="teamSelect"
                  value={currentTeamId}
                  onChange={(e) => handleTeamSelect(e.target.value)}
                  disabled={loadingTeams}
                  className="text-sm"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Action Buttons: Filter and Create Team/Task on the right */}
            <div className="flex space-x-2">
              {activeTab === 'Team Tasks' && (
                <>
                  <Button
                    onClick={toggleFilter}
                    color="gray"
                    className="w-full md:w-28 h-10 flex items-center justify-center text-sm font-medium"
                  >
                    <VscSettings className="mr-2 mt-0.5" /> Filter
                  </Button>
                  <Button
                    onClick={openCreateTaskModal}
                    gradientDuoTone="purpleToBlue"
                    className="w-full md:w-36 h-10 flex items-center justify-center text-sm font-medium"
                    disabled={!currentTeamId} // Disable if no team is selected
                  >
                    <MdCreate className="mr-2 mt-0.5" /> Create Task
                  </Button>
                </>
              )}
              {activeTab === 'Teams' && (
                <Button
                  onClick={openCreateTeamModal}
                  gradientDuoTone="purpleToBlue"
                  className="w-full md:w-36 h-10 flex items-center justify-center text-sm font-medium"
                >
                  <MdCreate className="mr-2 mt-0.5" /> Create Team
                </Button>
              )}
            </div>
          </div>

          {/* Error Handling */}
          {teamsError && (
            <div className="text-red-500">
              <p>{teamsError}</p>
            </div>
          )}

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

          {/* Create Task Modal */}
          <CreateTaskModal
            isOpen={isCreateTaskModalOpen}
            onClose={closeCreateTaskModal}
            onSave={(task) => console.log('Saving task', task)}
            teamId={currentTeamId} // Pass the selected team ID
            teamMembers={teamMembers} // Pass the team members
          />
        </div>
      </div>

      {/* Content based on Active Tab */}
      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {activeTab === 'Team Tasks' && (
            <TeamTaskBoard teamId={filters.teamId} filters={filters} />
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
                    className="w-full md:w-52 h-10 flex items-center justify-center text-sm font-medium px-4 py-2"
                  >
                    <MdCreate className="mr-2 mt-0.5" /> Create New Team
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

// Utility Components for the Tab Buttons
interface TabButtonsProps {
  activeTab: string
  onTabClick: (tabName: string) => void
}

const TabButtons: React.FC<TabButtonsProps> = ({ activeTab, onTabClick }) => (
  <div className="flex space-x-1 md:space-x-3 flex-wrap">
    {TABS.map((tab) => (
      <button
        key={tab.name}
        className={`w-full md:w-28 h-8 md:h-10 flex items-center justify-center rounded-md transition-all duration-300 text-sm font-medium ${
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
