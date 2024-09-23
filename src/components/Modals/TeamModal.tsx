import React, { useState, useEffect } from 'react'
import { Modal, TextInput, Button, Select } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { fetchAllUsers } from '../../redux/features/user/userSlice'
import {
  createNewTeam,
  updateTeamThunk,
} from '../../redux/features/teams/teamSlice'
import { MdCheck, MdPersonAdd } from 'react-icons/md'
import { fetchAllProjects } from '../../redux/features/projects/projectSlice'

interface TeamModalProps {
  isOpen: boolean
  onClose: (teamUpdated?: boolean) => void
  mode: 'create' | 'edit'
  team?: {
    id: string
    name: string
    description?: string
    members: { user: { id: string; name: string } }[]
    projects: { id: string; title: string }[]
  }
}

const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  mode,
  team,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const users = useSelector((state: RootState) => state.user.users)
  const loadingUsers = useSelector((state: RootState) => state.user.loading)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const loadingProjects = useSelector(
    (state: RootState) => state.projects.loading,
  )

  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [showMoreUsers, setShowMoreUsers] = useState(false)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllUsers()) // Fetch users when modal opens
      dispatch(fetchAllProjects()) // Fetch projects

      if (mode === 'edit' && team) {
        // Set the team name and description for editing
        setTeamName(team.name)
        setDescription(team.description || '')

        // Pre-load members into selectedMembers state
        setSelectedMembers(
          (team.members || [])
            .filter((member) => member && member.user && member.user.id)
            .map((member) => member.user.id),
        )

        // Set selected project if present
        if (team.projects && team.projects.length > 0) {
          setSelectedProject(team.projects[0].id)
        } else {
          setSelectedProject(null)
        }
      } else {
        resetForm() // Reset form if creating a new team
      }
    }
  }, [dispatch, isOpen, mode, team])

  const resetForm = () => {
    setTeamName('')
    setDescription('')
    setSelectedMembers([])
    setSelectedProject(null)
  }

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value || null)
  }

  // Function to update the team members when they are selected or deselected
  const updateMembers = async (updatedMembers: string[]) => {
    if (team && mode === 'edit') {
      await dispatch(
        updateTeamThunk({
          teamId: team.id,
          data: {
            name: team.name,
            description: team.description,
            members: updatedMembers, // Pass the updated members
          },
        }),
      )
    }
  }

  const handleSelectMember = async (userId: string) => {
    let updatedMembers = []
    if (selectedMembers.includes(userId)) {
      updatedMembers = selectedMembers.filter((id) => id !== userId) // Remove if already selected
    } else {
      updatedMembers = [...selectedMembers, userId] // Add if not selected
    }
    setSelectedMembers(updatedMembers)
    await updateMembers(updatedMembers) // Call API to update team members
  }

  const isSelected = (userId: string) => selectedMembers.includes(userId)

  const handleSaveTeam = async () => {
    if (teamName.trim()) {
      if (mode === 'create') {
        await dispatch(
          createNewTeam({
            name: teamName,
            description,
            members: selectedMembers,
            projectId: selectedProject || undefined,
          }),
        )
      }
      resetForm()
      onClose(true)
    }
  }

  // Render selected members above the button
  const renderSelectedMembers = () => {
    if (selectedMembers.length === 0) {
      return (
        <p className="text-gray-500 dark:text-gray-400">
          No members selected yet.
        </p>
      )
    }

    return (
      <div className="flex flex-wrap gap-4 max-h-48 overflow-y-auto">
        {selectedMembers.map((memberId) => {
          const member = users.find((user) => user.id === memberId)
          return (
            member && (
              <div
                key={member.id}
                className="relative cursor-pointer"
                onClick={() => handleSelectMember(member.id)}
              >
                <div className="relative rounded-full overflow-hidden transform transition-transform duration-200 opacity-75 hover:scale-105">
                  <img
                    src={`https://ui-avatars.com/api/?name=${member.name}&background=random`}
                    alt={`Avatar of ${member.name}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
                    <MdCheck className="text-white text-xl" />
                  </div>
                </div>
                <p className="text-center mt-2 text-sm text-gray-900 dark:text-white">
                  {member.name.split(' ')[0]} {/* Display first name */}
                </p>
              </div>
            )
          )
        })}
      </div>
    )
  }

  // Render remaining users for selection, excluding selected ones
  const renderUsers = () => {
    if (loadingUsers) {
      return (
        <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
      )
    }

    // Filter users that are not selected
    const availableUsers = users.filter(
      (user) => !selectedMembers.includes(user.id),
    )

    if (availableUsers.length === 0) {
      return (
        <p className="text-gray-500 dark:text-gray-400">
          No users available to add to the team.
        </p>
      )
    }

    return (
      <div className="grid grid-cols-6 gap-4 max-h-48 overflow-y-auto">
        {availableUsers.map((user) => (
          <div
            key={user.id}
            className="relative cursor-pointer transition-opacity duration-300"
            onClick={() => handleSelectMember(user.id)}
            style={{ opacity: isSelected(user.id) ? 0.75 : 1 }}
          >
            <div
              className={`relative w-12 h-12 rounded-full overflow-hidden transform transition-transform duration-200 hover:scale-105`}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                alt={`Avatar of ${user.name}`}
                className="w-full h-full rounded-full"
              />
              {isSelected(user.id) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
                  <MdCheck className="text-white text-2xl" />
                </div>
              )}
            </div>
            <p className="text-center mt-2 text-sm text-gray-900 dark:text-white">
              {user.name.split(' ')[0]}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Modal show={isOpen} onClose={() => onClose(false)} size="lg">
      <Modal.Header className="bg-white dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {mode === 'create' ? 'Create New Team' : 'Edit Team'}
        </h3>
      </Modal.Header>
      <Modal.Body className="bg-white dark:bg-gray-800 space-y-6">
        <TextInput
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="dark:bg-gray-700 dark:text-white"
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="dark:bg-gray-700 dark:text-white"
        />

        {/* Display Selected Project */}
        {mode === 'create' ? (
          <Select
            value={selectedProject || ''}
            onChange={handleProjectSelect}
            className="dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Project (Optional)</option>
            {loadingProjects ? (
              <option disabled>Loading projects...</option>
            ) : (
              projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))
            )}
          </Select>
        ) : (
          <TextInput
            placeholder="Project"
            value={team?.projects?.[0]?.title || 'No Project Assigned'}
            disabled
            className="dark:bg-gray-700 dark:text-white"
          />
        )}

        {/* Render Selected Members */}
        {renderSelectedMembers()}

        <div className="mt-4">
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={() => setShowMoreUsers(!showMoreUsers)}
          >
            <MdPersonAdd className="mr-2 mt-0.5" />
            {showMoreUsers ? 'Hide Members' : 'Add More Members'}
          </Button>
        </div>

        {showMoreUsers && (
          <div className="mt-4 transition-opacity duration-300">
            {renderUsers()}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-white dark:bg-gray-800">
        <Button gradientDuoTone="purpleToBlue" onClick={handleSaveTeam}>
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
        <Button color="gray" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TeamModal
