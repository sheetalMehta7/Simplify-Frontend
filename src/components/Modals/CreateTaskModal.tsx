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

interface Task {
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  assigneeName: string
  userId: string // New addition to store userId
  teamId?: string
}

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Partial<Task>) => void
  teamId?: string
  teamName?: string // Pass the team name to display
  dueDate?: Date | null
  teamMembers: any[] // Array of team members
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teamId,
  teamName,
  dueDate,
  teamMembers,
}) => {
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

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

    setTaskDetails((prevDetails) => ({ ...prevDetails, [name]: value }))
  }

  const validateForm = () => {
    const { title, dueDate, priority, status } = taskDetails
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const finalTaskDetails = {
        ...taskDetails,
        assigneeName: taskDetails.teamId
          ? taskDetails.assigneeName
          : taskDetails.assigneeName,
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
        userId: taskDetails.userId,
        teamId: teamId || '',
      })

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
              maxLength={100} // Enforce maxLength to prevent typing beyond 100 chars
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

          {/* Show team members dropdown if teamId exists */}
          {teamId && teamMembers?.length > 0 ? (
            <div>
              <Label htmlFor="assignee" value="Assign to Team Member" />
              <Select
                id="assignee"
                name="assignee"
                value={taskDetails.assigneeName}
                onChange={handleChange}
              >
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
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
