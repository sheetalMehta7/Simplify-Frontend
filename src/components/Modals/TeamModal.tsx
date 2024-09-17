import React, { useState, useEffect } from 'react'
import { Modal, TextInput, Button } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { fetchAllUsers } from '../../redux/features/user/userSlice'
import {
  createNewTeam,
  updateTeamThunk,
} from '../../redux/features/teams/teamSlice'
import { MdCheck, MdPersonAdd } from 'react-icons/md'

interface TeamModalProps {
  isOpen: boolean
  onClose: (teamUpdated?: boolean) => void
  mode: 'create' | 'edit'
  team?: { id: string; name: string; description?: string; members: string[] }
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

  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [showMoreUsers, setShowMoreUsers] = useState(false)

  // Fetch users when modal is opened
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllUsers())
      if (mode === 'edit' && team) {
        setTeamName(team.name)
        setDescription(team.description || '')
        setSelectedMembers(team.members)
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
  }

  // Function to handle displaying only the first word of the username
  const displayFirstWord = (name: string) => {
    const nameParts = name.split(' ')
    return nameParts.length > 1 ? nameParts[0] : name
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
        // Handle team creation
        await dispatch(
          createNewTeam({
            name: teamName,
            description,
            members: selectedMembers,
          }),
        )
      } else if (mode === 'edit' && team) {
        // Handle team update
        await dispatch(
          updateTeamThunk({
            teamId: team.id,
            data: {
              name: teamName,
              description,
              members: selectedMembers,
            },
          }),
        )
      }
      resetForm()
      onClose(true) // Close modal and refresh the list
    }
  }

  // Render remaining users for selection
  const renderUsers = () => {
    if (loadingUsers) {
      return (
        <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
      )
    }

    // Filter out already selected members
    const remainingUsers = users.filter(
      (user) => !selectedMembers.includes(user.id),
    )

    // Show message if no more users to add
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
                src={`https://ui-avatars.com/api/?name=${displayFirstWord(user.name)}&background=random`}
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
              {displayFirstWord(user.name)}
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

        {/* Display Selected Members */}
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
                    {displayFirstWord(member.name)}
                  </p>
                </div>
              )
            )
          })}
        </div>

        {/* Button to show more users */}
        <div className="mt-4">
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={() => setShowMoreUsers(!showMoreUsers)}
          >
            <MdPersonAdd className="mr-2 mt-0.5" />
            {showMoreUsers ? 'Hide Members' : 'Add More Members'}
          </Button>
        </div>

        {/* Conditionally display more users */}
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
