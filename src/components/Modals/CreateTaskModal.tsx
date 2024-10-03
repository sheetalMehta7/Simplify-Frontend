// CreateTaskModal.tsx
import React, { useState, useEffect } from 'react'
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Select,
  Label,
} from 'flowbite-react'
import { MdTitle, MdDateRange, MdPriorityHigh, MdLabel } from 'react-icons/md'
import { format } from 'date-fns'

// Define the Task interface
interface Task {
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  assigneeName: string
  userId: string // Stores the user's ID
  teamId?: string
}

// Define the TeamMember interface
interface TeamMember {
  id: string
  name: string
}

// Define the props for CreateTaskModal
interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Partial<Task>) => void
  teamId?: string
  teamName?: string // Team name to display
  dueDate?: Date | null
  teamMembers?: TeamMember[] // Array of team members
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teamId,
  teamName,
  dueDate,
  teamMembers = [], // Default to empty array to prevent undefined
}) => {
  // Initialize task details state
  const [taskDetails, setTaskDetails] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'low',
    dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : '',
    assigneeName: '',
    userId: '',
    teamId: teamId || '',
  })

  // Initialize errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Populate assignee for personal tasks (no teamId)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user && user.name && user.id && !teamId) {
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        assigneeName: user.name,
        userId: user.id,
      }))
    }
  }, [teamId])

  // Update dueDate in state when the prop changes
  useEffect(() => {
    if (dueDate) {
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        dueDate: format(dueDate, 'yyyy-MM-dd'),
      }))
    }
  }, [dueDate])

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target

    // Handle title length validation
    if (name === 'title' && value.length > 100) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: 'Title cannot exceed 100 characters',
      }))
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }))
    }

    // Handle assignee selection
    if (name === 'assignee') {
      const selectedMember = teamMembers.find((member) => member.id === value)
      if (selectedMember) {
        setTaskDetails((prevDetails) => ({
          ...prevDetails,
          userId: selectedMember.id,
          assigneeName: selectedMember.name,
        }))
      } else {
        // If no member is selected
        setTaskDetails((prevDetails) => ({
          ...prevDetails,
          userId: '',
          assigneeName: '',
        }))
      }
    } else {
      // Handle other fields normally
      setTaskDetails((prevDetails) => ({ ...prevDetails, [name]: value }))
    }
  }

  // Validate the form before submission
  const validateForm = () => {
    const { title, dueDate, priority, status, userId } = taskDetails
    const newErrors: { [key: string]: string } = {}

    if (!title) newErrors.title = 'Title is required'
    if (title && title.length > 100)
      newErrors.title = 'Title cannot exceed 100 characters'
    if (!priority) newErrors.priority = 'Priority is required'
    if (!status) newErrors.status = 'Status is required'
    if (!dueDate) {
      newErrors.dueDate = 'Due Date is required'
    } else if (new Date(dueDate) < new Date()) {
      newErrors.dueDate = 'Due Date cannot be in the past'
    }
    if (teamId && !userId) {
      newErrors.assignee = 'Assignee is required for team tasks'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const finalTaskDetails = {
        ...taskDetails,
        assigneeName: taskDetails.assigneeName,
        userId: taskDetails.userId,
      }

      onSave(finalTaskDetails)

      // Reset the form after submission
      setTaskDetails({
        title: '',
        description: '',
        status: 'todo',
        priority: 'low',
        dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : '',
        assigneeName: '',
        userId: '',
        teamId: teamId || '',
      })

      setErrors({})
      onClose()
    }
  }

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <h2 className="text-xl font-bold">Create New Task</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {/* Title Input */}
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
              maxLength={100} // Prevent typing beyond 100 characters
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description Textarea */}
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

          {/* Due Date Input */}
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

          {/* Priority Select */}
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

          {/* Status Select */}
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

          {/* Assignee Selection for Team Tasks */}
          {teamId && (
            <div>
              <Label htmlFor="assignee" value="Assign to Team Member" />
              <Select
                id="assignee"
                name="assignee"
                value={taskDetails.userId}
                onChange={handleChange}
                color={errors.assignee ? 'failure' : ''}
              >
                <option value="">Select Assignee</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </Select>
              {errors.assignee && (
                <p className="text-red-500 text-sm mt-1">{errors.assignee}</p>
              )}
            </div>
          )}

          {/* Assignee Display for Personal Tasks */}
          {!teamId && (
            <div>
              <Label htmlFor="assignee" value="Assigned To" />
              <TextInput
                id="assignee"
                name="assignee"
                value={taskDetails.assigneeName}
                disabled
              />
            </div>
          )}

          {/* Display Assigned Team Name */}
          {teamName && (
            <div>
              <Label htmlFor="teamName" value="Assigned Team" />
              <TextInput
                id="teamName"
                name="teamName"
                value={teamName}
                disabled
              />
            </div>
          )}
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

export default CreateTaskModal
