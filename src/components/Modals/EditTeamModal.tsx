import React, { useState, useEffect } from 'react'
import { Modal, TextInput, Button } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { fetchAllUsers } from '../../redux/features/user/userSlice'
import { updateTeamThunk } from '../../redux/features/teams/teamSlice'
import { MdCheck } from 'react-icons/md'

interface EditTeamModalProps {
  isOpen: boolean
  onClose: () => void
  team: { id: string; name: string; description?: string; members: string[] }
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  isOpen,
  onClose,
  team,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const users = useSelector((state: RootState) => state.user.users)
  const loadingUsers = useSelector((state: RootState) => state.user.loading)

  const [teamName, setTeamName] = useState(team.name)
  const [description, setDescription] = useState(team.description || '')
  const [selectedMembers, setSelectedMembers] = useState<string[]>(team.members) // Pre-select members
  const [showMoreUsers, setShowMoreUsers] = useState(false) // Toggle for showing more members

  // Fetch users when the modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllUsers()) // Fetch all users when modal is open
    }
  }, [dispatch, isOpen])

  const handleUpdateTeam = async () => {
    if (teamName.trim()) {
      await dispatch(
        updateTeamThunk({
          teamId: team.id, // Pass the teamId separately
          data: {
            name: teamName,
            description,
            members: selectedMembers, // Pass selected members for the update
          },
        }),
      )
      onClose()
    }
  }

  const handleSelectMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId))
    } else {
      setSelectedMembers([...selectedMembers, userId])
    }
  }

  const isSelected = (userId: string) => selectedMembers.includes(userId)

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header className="bg-white dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Edit Team
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

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Team Members
        </h3>

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
                    {member.name}
                  </p>
                </div>
              )
            )
          })}
        </div>

        {/* Button to show more users */}
        <div className="mt-4">
          <Button onClick={() => setShowMoreUsers(!showMoreUsers)}>
            {showMoreUsers ? 'Hide Members' : 'Add More Members'}
          </Button>
        </div>

        {/* Conditionally display more users */}
        {showMoreUsers && (
          <div className="flex flex-wrap gap-4 max-h-48 overflow-y-auto mt-4">
            {users
              .filter((user) => !selectedMembers.includes(user.id)) // Filter out selected members
              .map((user) => (
                <div
                  key={user.id}
                  className="relative cursor-pointer"
                  onClick={() => handleSelectMember(user.id)}
                >
                  <div
                    className={`relative w-12 h-12 rounded-full overflow-hidden transform transition-transform duration-200 ${
                      isSelected(user.id) ? 'opacity-75' : ''
                    } hover:scale-105`}
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={`Avatar of ${user.name}`}
                      className="w-full h-full rounded-full"
                    />
                    {isSelected(user.id) && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
                        <MdCheck className="text-white text-xl" />
                      </div>
                    )}
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                </div>
              ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-white dark:bg-gray-800">
        <Button color="blue" onClick={handleUpdateTeam}>
          Update
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditTeamModal
