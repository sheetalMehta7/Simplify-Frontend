import React, { useState, useEffect } from 'react'
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Select,
  Label,
} from 'flowbite-react'
import {
  MdTitle,
  MdDateRange,
  MdPriorityHigh,
  MdLabel,
  MdPeople,
} from 'react-icons/md'
import { format } from 'date-fns'

interface Task {
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  assigneeIds: string[]
  teamId?: string
}

interface CreateTeamTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Partial<Task>) => void
  teamId: string
  teamMembers: { id: string; name: string }[]
  dueDate?: Date | null
}

const CreateTeamTaskModal: React.FC<CreateTeamTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teamId,
  teamMembers,
  dueDate,
}) => {
  const [taskDetails, setTaskDetails] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'low',
    dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : '',
    assigneeIds: [],
    teamId: teamId || '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Update task details when due date changes
  useEffect(() => {
    if (dueDate) {
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        dueDate: format(dueDate, 'yyyy-MM-dd'),
      }))
    }
  }, [dueDate])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
    setTaskDetails((prevDetails) => ({ ...prevDetails, [name]: value }))
  }

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAssignees = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    )
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      assigneeIds: selectedAssignees,
    }))
  }

  const validateForm = () => {
    const { title, dueDate, priority, status, teamId } = taskDetails
    const newErrors: { [key: string]: string } = {}

    if (!title) newErrors.title = 'Title is required'
    if (!priority) newErrors.priority = 'Priority is required'
    if (!status) newErrors.status = 'Status is required'
    if (!teamId) newErrors.teamId = 'Team is required'
    if (!dueDate) {
      newErrors.dueDate = 'Due Date is required'
    } else if (new Date(dueDate) < new Date()) {
      newErrors.dueDate = 'Due Date cannot be in the past'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(taskDetails)

      // Reset the form after submission
      setTaskDetails({
        title: '',
        description: '',
        status: 'todo',
        priority: 'low',
        dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : '',
        assigneeIds: [],
        teamId: teamId || '',
      })

      onClose()
    }
  }

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <h2 className="text-xl font-bold">Create New Team Task</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              name="title"
              icon={MdTitle}
              value={taskDetails.title ?? ''}
              onChange={handleChange}
              color={errors.title ? 'failure' : ''}
              placeholder="Enter task title"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              name="description"
              value={taskDetails.description ?? ''}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="dueDate" value="Due Date" />
            <TextInput
              id="dueDate"
              name="dueDate"
              type="date"
              icon={MdDateRange}
              value={taskDetails.dueDate ?? ''}
              onChange={handleChange}
              color={errors.dueDate ? 'failure' : ''}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>
          <div>
            <Label htmlFor="priority" value="Priority" />
            <Select
              id="priority"
              name="priority"
              value={taskDetails.priority ?? 'low'}
              onChange={handleChange}
              icon={MdPriorityHigh}
              color={errors.priority ? 'failure' : ''}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
            )}
          </div>
          <div>
            <Label htmlFor="status" value="Status" />
            <Select
              id="status"
              name="status"
              value={taskDetails.status ?? 'todo'}
              onChange={handleChange}
              icon={MdLabel}
              color={errors.status ? 'failure' : ''}
            >
              <option value="todo">To-Do</option>
              <option value="in-progress">In-Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>
          <div>
            <Label htmlFor="teamId" value="Team" />
            <TextInput
              id="teamId"
              name="teamId"
              value={teamId} // Disabled and shows the selected team
              disabled
            />
          </div>
          <div>
            <Label htmlFor="assignees" value="Assign To Team Members" />
            <Select
              id="assignees"
              name="assignees"
              multiple
              value={taskDetails.assigneeIds}
              onChange={handleAssigneeChange}
              icon={MdPeople}
              disabled={!teamId} // Disable if no team is selected
            >
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button gradientDuoTone="purpleToBlue" onClick={handleSubmit}>
          Create Task
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateTeamTaskModal
