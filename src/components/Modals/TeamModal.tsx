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
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    undefined,
  )
  const [showMoreUsers, setShowMoreUsers] = useState(false)

  // Error state for validation
  const [teamNameError, setTeamNameError] = useState<string>('')
  const [projectError, setProjectError] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllUsers())
      dispatch(fetchAllProjects())

      if (mode === 'edit' && team) {
        // Set team name and description
        setTeamName(team.name)
        setDescription(team.description ?? '')

        // Correctly map team members to their IDs
        setSelectedMembers(
          (team.members ?? [])
            .map((member) => member.user?.id) // Access member.user.id correctly
            .filter((id) => id !== undefined),
        )

        if (team.projects && team.projects.length > 0) {
          setSelectedProject(team.projects[0].id)
        } else {
          setSelectedProject(undefined)
        }
      } else {
        resetForm()
      }
    }
  }, [dispatch, isOpen, mode, team])

  const resetForm = () => {
    setTeamName('')
    setDescription('')
    setSelectedMembers([])
    setSelectedProject(undefined)
    setTeamNameError('')
    setProjectError('')
  }

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      setSelectedProject(value)
      setProjectError('') // Clear error when a valid project is selected
    } else {
      setSelectedProject(undefined)
      setProjectError('Project selection is required.') // Set error if no project is selected
    }
  }

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTeamName(value)
    if (value.trim()) {
      setTeamNameError('')
    }
  }

  const validateFields = () => {
    let valid = true

    if (!teamName.trim()) {
      setTeamNameError('Team name is required.')
      valid = false
    }

    if (!selectedProject) {
      setProjectError('Project selection is required.')
      valid = false
    }

    return valid
  }

  const updateMembers = async (updatedMembers: string[]) => {
    if (team && mode === 'edit') {
      await dispatch(
        updateTeamThunk({
          teamId: team.id,
          data: {
            name: team.name,
            description: team.description,
            members: updatedMembers,
          },
        }),
      )
    }
  }

  const handleSelectMember = async (userId: string) => {
    let updatedMembers = []
    if (selectedMembers.includes(userId)) {
      updatedMembers = selectedMembers.filter((id) => id !== userId)
    } else {
      updatedMembers = [...selectedMembers, userId]
    }
    setSelectedMembers(updatedMembers)
    await updateMembers(updatedMembers)
  }

  const isSelected = (userId: string) => selectedMembers.includes(userId)

  const handleSaveTeam = async () => {
    if (!validateFields()) {
      return
    }

    if (teamName.trim()) {
      if (mode === 'create') {
        await dispatch(
          createNewTeam({
            name: teamName,
            description,
            members: selectedMembers,
            projectId: selectedProject,
          }),
        )
      }
      resetForm()
      onClose(true)
    }
  }

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
                  {member.name.split(' ')[0]}
                </p>
              </div>
            )
          )
        })}
      </div>
    )
  }

  const renderUsers = () => {
    if (loadingUsers) {
      return (
        <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
      )
    }

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
          onChange={handleTeamNameChange}
          className="dark:bg-gray-700 dark:text-white"
        />
        {teamNameError && (
          <p className="text-red-600 text-sm mt-1">{teamNameError}</p>
        )}
        <TextInput
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="dark:bg-gray-700 dark:text-white"
        />

        {/* Display Selected Project with validation */}
        {mode === 'create' ? (
          <>
            <Select
              value={selectedProject ?? ''}
              onChange={handleProjectSelect}
              className="dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Project</option>
              {loadingProjects ? (
                <option disabled>Loading projects...</option>
              ) : (
                projects
                  .filter((project) => !project.archived)
                  .map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))
              )}
            </Select>
            {projectError && (
              <p className="text-red-600 text-sm mt-1">{projectError}</p>
            )}
          </>
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
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={handleSaveTeam}
          disabled={!!teamNameError || !!projectError}
        >
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
