import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { Modal, Button } from 'flowbite-react'

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

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <div className="flex justify-between items-center w-full">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">
            Add New Event
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assignee
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Review</option>
              <option>Done</option>
            </select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button color="purple" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddEventModal
