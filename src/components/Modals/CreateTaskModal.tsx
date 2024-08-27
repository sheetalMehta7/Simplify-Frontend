import React, { useState } from 'react'
import moment from 'moment'
import { MdClose } from 'react-icons/md'

interface CreateTaskModalProps {
  onClose: () => void
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  onClose,
}) => {
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    assignee: '',
    dueDate: '',
    status: 'todo', // Default status
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setTaskDetails((prevDetails) => ({ ...prevDetails, [name]: value }))
  }

  const handleSubmit = () => {
    const { title, assignee, dueDate, status } = taskDetails
    let newErrors: { [key: string]: string } = {}

    if (!title) newErrors.title = 'Title is required'
    if (!assignee) newErrors.assignee = 'Assignee is required'
    if (!dueDate) newErrors.dueDate = 'Due Date is required'
    else if (moment(dueDate).isBefore(moment(), 'day'))
      newErrors.dueDate = 'Due Date cannot be in the past'
    if (!status) newErrors.status = 'Status is required'

    if (Object.keys(newErrors).length === 0) {
      // Logic to create a new task
      console.log('New Task:', taskDetails)
      onClose() // Close the modal after creating the task
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-gray-800 text-white p-6 rounded-lg w-96">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            <MdClose />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={taskDetails.title}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded-lg border-none focus:ring-0"
            placeholder="Task title"
          />
          {errors.title && (
            <div className="text-red-500 text-sm mt-1">{errors.title}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Assignee</label>
          <input
            type="text"
            name="assignee"
            value={taskDetails.assignee}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded-lg border-none focus:ring-0"
            placeholder="Assign to"
          />
          {errors.assignee && (
            <div className="text-red-500 text-sm mt-1">{errors.assignee}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={taskDetails.dueDate}
            onChange={handleChange}
            className={`w-full p-2 bg-gray-700 rounded-lg border-none focus:ring-0 ${
              errors.dueDate ? 'border-red-500' : ''
            }`}
          />
          {errors.dueDate && (
            <div className="text-red-500 text-sm mt-1">{errors.dueDate}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={taskDetails.status}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded-lg border-none focus:ring-0"
          >
            <option value="todo">To-Do</option>
            <option value="in-progress">In-Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          {errors.status && (
            <div className="text-red-500 text-sm mt-1">{errors.status}</div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}
