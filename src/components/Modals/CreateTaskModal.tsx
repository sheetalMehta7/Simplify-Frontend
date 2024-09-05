import React, { useState } from 'react'
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Select,
  Label,
} from 'flowbite-react'
import { MdTitle, MdDateRange, MdPriorityHigh, MdLabel } from 'react-icons/md'

interface Task {
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  userId: number
}

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Partial<Task>) => void
  userId: number
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userId,
}) => {
  const [taskDetails, setTaskDetails] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'normal',
    dueDate: '',
    userId: userId, // Set userId from props
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setTaskDetails((prevDetails) => ({ ...prevDetails, [name]: value }))
  }

  const validateForm = () => {
    const { title, dueDate } = taskDetails
    const newErrors: { [key: string]: string } = {}

    if (!title) newErrors.title = 'Title is required'
    if (dueDate && new Date(dueDate) < new Date()) {
      newErrors.dueDate = 'Due Date cannot be in the past'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(taskDetails) // Pass the task details back to the parent component
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
              value={taskDetails.title || ''}
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
              value={taskDetails.description || ''}
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
              value={taskDetails.dueDate || ''}
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
              value={taskDetails.priority || 'normal'}
              onChange={handleChange}
              icon={MdPriorityHigh}
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="status" value="Status" />
            <Select
              id="status"
              name="status"
              value={taskDetails.status || 'todo'}
              onChange={handleChange}
              icon={MdLabel}
            >
              <option value="todo">To-Do</option>
              <option value="in-progress">In-Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </Select>
          </div>
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
