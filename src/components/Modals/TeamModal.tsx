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
import { fetchAllProjects } from '../../redux/features/projects/projectSlice' // Fetch all projects

interface TeamModalProps {
  isOpen: boolean
  onClose: (teamUpdated?: boolean) => void
  mode: 'create' | 'edit'
  team?: {
    id: string
    name: string
    description?: string
    members: { user: { id: string; name: string } }[]
    projects: { id: string; title: string }[] // For edit mode to display project title
  }
}

const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  mode,
  team,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  // Fetch users and projects from Redux state
  const users = useSelector((state: RootState) => state.user.users)
  const loadingUsers = useSelector((state: RootState) => state.user.loading)
  const projects = useSelector((state: RootState) => state.projects.projects) // Fetch projects from Redux
  const loadingProjects = useSelector(
    (state: RootState) => state.projects.loading,
  )

  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null) // Selected project ID
  const [showMoreUsers, setShowMoreUsers] = useState(false)

  const [loggedInUser, setLoggedInUser] = useState<{
    name: string
    email: string
  } | null>(null)

  // Fetch the logged-in user details from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setLoggedInUser(parsedUser)
    }
  }, [])

  // Fetch users and projects when the modal is opened
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllUsers())
      dispatch(fetchAllProjects()) // Fetch all projects for the dropdown

      if (mode === 'edit' && team) {
        setTeamName(team.name)
        setDescription(team.description || '')

        // Safely map members
        setSelectedMembers(
          (team.members || [])
            .filter((member) => member && member.user && member.user.id) // Ensure member and user exist
            .map((member) => member.user.id), // Map valid user IDs
        )

        if (team.projects && team.projects.length > 0) {
          setSelectedProject(team.projects[0].id) // Set project if available in edit mode
        } else {
          setSelectedProject(null) // No project associated
        }
      } else if (mode === 'create') {
        resetForm() // Ensure form is reset when the modal opens in create mode
      }
    }
  }, [dispatch, isOpen, mode, team])

  // Reset form fields for create mode
  const resetForm = () => {
    setTeamName('')
    setDescription('')
    setSelectedMembers([])
    setSelectedProject(null) // Reset selected project
  }

  // Function to handle project selection from the dropdown
  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value || null) // Set selected project or null if none is selected
  }

  // Toggle member selection
  const handleSelectMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId))
    } else {
      setSelectedMembers([...selectedMembers, userId])
    }
  }

  const isSelected = (userId: string) => selectedMembers.includes(userId)

  // Handle team creation or updating
  const handleSaveTeam = async () => {
    if (teamName.trim()) {
      if (mode === 'create') {
        await dispatch(
          createNewTeam({
            name: teamName,
            description,
            members: selectedMembers,
            projectId: selectedProject || undefined, // Include projectId if selected
          }),
        )
      } else if (mode === 'edit' && team) {
        await dispatch(
          updateTeamThunk({
            teamId: team.id,
            data: {
              name: teamName,
              description,
              members: selectedMembers,
              // We don't need to update the project in edit mode, but the value can still be sent
            },
          }),
        )
      }
      resetForm()
      onClose(true)
    }
  }

  // Render remaining users for selection
  const renderUsers = () => {
    if (loadingUsers) {
      return (
        <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
      )
    }

    // Filter out already selected members and the logged-in user
    const remainingUsers = users.filter(
      (user) =>
        !selectedMembers.includes(user.id) &&
        user.email !== loggedInUser?.email,
    )

    if (remainingUsers.length === 0) {
      return (
        <p className="text-gray-500 dark:text-gray-400">
          All members have been added to the team.
        </p>
      )
    }

    return (
      <div className="grid grid-cols-6 gap-4 max-h-48 overflow-y-auto">
        {remainingUsers.map((user) => (
          <div
            key={user.id}
            className="relative cursor-pointer transition-opacity duration-300"
            onClick={() => handleSelectMember(user.id)}
            style={{ opacity: isSelected(user.id) ? 0.5 : 1 }}
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
              {user.name.split(' ')[0]} {/* Display only the first name */}
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

        {/* Project selection dropdown for create mode, and disabled input for edit mode */}
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
