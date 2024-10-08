import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  fetchTeams,
  deleteTeamThunk,
} from '../../../redux/features/teams/teamSlice'
import Loader from '../../Loader/Loader'
import TeamModal from '../../Modals/TeamModal'
import ConfirmModal from '../../Modals/ConfirmModal'
import { Button } from 'flowbite-react'
import { MdEdit, MdDelete } from 'react-icons/md'

const Teams: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const teams = useSelector((state: RootState) => state.teams.teams)
  const loading = useSelector((state: RootState) => state.teams.loading)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  const handleCreateTeam = () => {
    setSelectedTeam(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const openEditModal = (team: any) => {
    const teamWithMembers = {
      ...team,
      members: team.members
        ? team.members.map((member: any) => member.user?.id) // Extract the user ID from the 'user' object
        : [],
    }
    setSelectedTeam(teamWithMembers)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const closeModal = (teamUpdated: boolean = false) => {
    setIsModalOpen(false)
    setSelectedTeam(null)
    if (teamUpdated) {
      dispatch(fetchTeams()) // Fetch updated teams after the modal closes
    }
  }

  const openConfirmModal = (teamId: string) => {
    setTeamToDelete(teamId)
    setIsConfirmModalOpen(true)
  }

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false)
    setTeamToDelete(null)
  }

  const handleDeleteTeam = () => {
    if (teamToDelete) {
      dispatch(deleteTeamThunk(teamToDelete))
      closeConfirmModal()
      dispatch(fetchTeams()) // Refresh after deleting a team
    }
  }

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <Loader message="Loading teams..." />
      ) : (
        <>
          {teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-300 mb-4">
                No teams available. You can create a new team to get started.
              </p>
              <Button onClick={handleCreateTeam} gradientDuoTone="purpleToBlue">
                Create Team
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Teams</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {teams.map((team) => (
                  <li
                    key={team.id}
                    className="border p-4 rounded-md shadow-md bg-white dark:bg-gray-800"
                  >
                    <h3 className="text-lg font-bold">{team.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {team.description ?? 'No description available'}
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        onClick={() => openEditModal(team)}
                        gradientDuoTone="purpleToBlue"
                        size="xs"
                        className="flex items-center"
                      >
                        <MdEdit className="mr-1 mt-0.5" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => openConfirmModal(team.id)}
                        color="red"
                        size="xs"
                        className="flex items-center"
                      >
                        <MdDelete className="mr-1 mt-0.5" />
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <TeamModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        team={selectedTeam}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDeleteTeam}
        message="Are you sure you want to delete this team? This action cannot be undone."
      />
    </div>
  )
}

export default Teams
