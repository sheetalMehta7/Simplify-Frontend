import { Drawer } from 'flowbite-react'
import { MdClose } from 'react-icons/md'

interface Task {
  id: number
  title: string
  date: Date
  description?: string
  assignee?: string
  priority?: string
  status?: string
}

interface CalendarDrawerProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export function CalendarDrawer({ task, isOpen, onClose }: CalendarDrawerProps) {
  return (
    <>
      <Drawer
        open={isOpen}
        onClose={onClose}
        position="right"
        className="bg-slate-800"
      >
        <div className="relative w-full h-full">
          <button
            className="absolute top-2 right-2 text-white text-2xl hover:bg-slate-700 rounded-full p-1"
            onClick={onClose}
          >
            <MdClose />
          </button>
          <Drawer.Items>
            {task ? (
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
                <p className="mb-2">
                  <strong>Date:</strong> {task.date.toDateString()}
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
        </div>
      </Drawer>
    </>
  )
}
