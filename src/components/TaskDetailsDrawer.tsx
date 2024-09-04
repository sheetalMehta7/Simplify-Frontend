// src/components/TaskDetailsDrawer.tsx
import React from 'react'
import { Drawer, Button } from 'flowbite-react'
import { FaTimes, FaTasks } from 'react-icons/fa'
import { Task } from './TaskBoard'

interface TaskDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
}

const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  if (!task) return null

  return (
    <Drawer position="right" open={isOpen} onClose={onClose} className="z-50">
      <Drawer.Header>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <FaTasks className="text-blue-600" size={24} />
            <h2 className="text-lg font-semibold">Task Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
      </Drawer.Header>
      <Drawer.Items>
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-bold">Title</h3>
            <p className="text-gray-700 dark:text-gray-300">{task.content}</p>
          </div>
          <div>
            <h3 className="text-md font-bold">Assignee</h3>
            <p className="text-gray-700 dark:text-gray-300">{task.assignee}</p>
          </div>
          <div>
            <h3 className="text-md font-bold">Due Date</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="text-md font-bold">Status</h3>
            <p className="text-gray-700 dark:text-gray-300">{task.status}</p>
          </div>
          <div className="flex space-x-4">
            <Button color="purple" className="flex-1">
              Edit
            </Button>
            <Button color="yellow" className="flex-1">
              Change Priority
            </Button>
          </div>
        </div>
      </Drawer.Items>
    </Drawer>
  )
}

export default TaskDetailsDrawer
