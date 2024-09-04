import React, { useState } from 'react'
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Select,
  Label,
  Badge,
} from 'flowbite-react'
import {
  MdClose,
  MdTitle,
  MdDateRange,
  MdPriorityHigh,
  MdLabel,
} from 'react-icons/md'

interface Task {
  id: number
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  userId: number
  tags: string[]
}

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
  userId: number // Added to pass the current user's ID
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userId,
}) => {
  const [taskDetails, setTaskDetails] = useState<Task>({
    id: Date.now(),
    title: '',
    description: '',
    status: 'todo',
    priority: 'normal',
    dueDate: '',
    userId: userId,
    tags: [],
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
    const { title, dueDate, tags } = taskDetails
    const newErrors: { [key: string]: string } = {}

    if (!title) newErrors.title = 'Title is required'
    if (dueDate && new Date(dueDate) < new Date()) {
      newErrors.dueDate = 'Due Date cannot be in the past'
    }
    if (tags.length === 0) newErrors.tags = 'At least one tag is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(taskDetails)
      onClose()
    }
  }

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const value = e.currentTarget.value.trim()
      if (value && !taskDetails.tags.includes(value)) {
        setTaskDetails((prevDetails) => ({
          ...prevDetails,
          tags: [...prevDetails.tags, value],
        }))
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tag: string) => {
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      tags: prevDetails.tags.filter((t) => t !== tag),
    }))
  }

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold">Create New Task</h2>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              name="title"
              icon={MdTitle}
              value={taskDetails.title}
              onChange={handleChange}
              color={errors.title ? 'failure' : ''}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
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
              value={taskDetails.priority}
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
              value={taskDetails.status}
              onChange={handleChange}
              icon={MdLabel}
            >
              <option value="todo">To-Do</option>
              <option value="in-progress">In-Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              name="description"
              value={taskDetails.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="tags" value="Tags" />
            <div className="flex items-center gap-2">
              <TextInput
                id="tags"
                name="tags"
                onKeyDown={handleTagKeyPress}
                placeholder="Enter tags and press Enter"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {taskDetails.tags.map((tag) => (
                <Badge
                  key={tag}
                  color="info"
                  className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {tag}
                  <MdClose
                    className="ml-1 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
            )}
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
