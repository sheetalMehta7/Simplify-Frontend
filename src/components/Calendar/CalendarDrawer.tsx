import React from 'react'
import { Drawer } from 'flowbite-react'
import { MdClose } from 'react-icons/md'
import { Task } from '../../interfaces/Task' // Importing the updated Task type

interface CalendarDrawerProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export const CalendarDrawer: React.FC<CalendarDrawerProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  return (
    <Drawer open={isOpen} onClose={onClose} position="right" className="z-50">
      <Drawer.Header>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Task Details</h2>
          <button
            className="text-white text-2xl hover:bg-slate-700 rounded-full p-1"
            onClick={onClose}
          >
            <MdClose />
          </button>
        </div>
      </Drawer.Header>
      <Drawer.Items>
        {task ? (
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
            <p className="mb-2">
              <strong>Date:</strong> {task.dueDate.toDateString()}
            </p>
            <p className="mb-2">
              <strong>Description:</strong>{' '}
              {task.description || 'No description available'}
            </p>
            <p className="mb-2">
              <strong>Assignee:</strong> {task.assignee || 'Unassigned'}
            </p>
            <p className="mb-2">
              <strong>Priority:</strong> {task.priority || 'Normal'}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {task.status || 'Not Started'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 p-6">
            No task selected.
          </p>
        )}
      </Drawer.Items>
    </Drawer>
  )
}

export default CalendarDrawer
