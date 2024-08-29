import { useState } from 'react'
import { MdClose } from 'react-icons/md'

interface Task {
  id: number
  title: string
  date: Date
  description: string
  assignee: string
  priority: string
  status: string
}

interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
  selectedDate: Date
}

const AddEventModal = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
}: AddEventModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState('Low')
  const [status, setStatus] = useState('Pending')

  const handleSave = () => {
    const newTask: Task = {
      id: Date.now(),
      title,
      date: selectedDate,
      description,
      assignee,
      priority,
      status,
    }
    onSave(newTask)
    onClose() // Close modal after saving
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg max-w-lg w-full animate-modal">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add New Event</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full p-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Assignee</label>
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Priority</label>
          <select
            className="w-full p-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Status</label>
          <select
            className="w-full p-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Done</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="flex items-center p-2 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700"
          >
            <span className="ml-2">Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="p-2 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEventModal
