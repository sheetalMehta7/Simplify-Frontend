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
  teamId?: string
}

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Partial<Task>) => void
  teamId?: string
  dueDate?: Date | null
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teamId,
  dueDate,
}) => {
  const [taskDetails, setTaskDetails] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'low',
    dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : '', // Format the date using date-fns
    assigneeName: '', // Placeholder, will be populated with userName
    teamId: teamId || '', // Optional teamId if it's a team task
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user && user.name) {
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        assigneeName: user.name, // Set the assigneeName to the user's name
      }))
    }
  }, [])

  useEffect(() => {
    if (dueDate) {
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        dueDate: format(dueDate, 'yyyy-MM-dd'), // Ensure only the date part is used with proper formatting
      }))
    }
  }, [dueDate])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setTaskDetails((prevDetails) => ({ ...prevDetails, [name]: value }))
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  const validateForm = () => {
    const { title, dueDate, priority, status } = taskDetails
    const newErrors: { [key: string]: string } = {}

    if (!title) newErrors.title = 'Title is required'
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
      }

      onSave(finalTaskDetails) // Save task and close modal
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
            <Label htmlFor="assignee" value="Assigned To" />
            <TextInput
              id="assignee"
              name="assignee"
              value={taskDetails.assigneeName}
              disabled
            />
          </div>
          {teamId && (
            <div>
              <Label htmlFor="teamId" value="Assigned Team" />
              <TextInput id="teamId" name="teamId" value={teamId} disabled />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleSubmit}>
          Create Task
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateTaskModal
