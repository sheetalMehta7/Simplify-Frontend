// src/components/Modals/CreateTeamModal.tsx
import React, { useState, useEffect } from 'react'
import { Modal, TextInput, Button } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllUsers } from '../../redux/features/user/userSlice'
import { createNewTeam } from '../../redux/features/teams/teamSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { MdCheck } from 'react-icons/md'

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]) // Store selected users

  const users = useSelector((state: RootState) => state.user.users)
  const loadingUsers = useSelector((state: RootState) => state.user.loading)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllUsers()) // Fetch all users when the modal opens
    }
  }, [dispatch, isOpen])

  const handleCreateTeam = async () => {
    if (teamName.trim()) {
      await dispatch(
        createNewTeam({
          name: teamName,
          description,
          members: selectedMembers, // Pass members to the action
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
          Create New Team
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
          Add Members
        </h3>

        {loadingUsers ? (
          <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
        ) : (
          <div className="flex flex-wrap gap-4 max-h-48 overflow-y-auto">
            {users.map((user) => (
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
                      <MdCheck className="text-white text-2xl" />
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
        <Button onClick={handleCreateTeam}>Create</Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateTeamModal
