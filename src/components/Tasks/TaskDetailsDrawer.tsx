import React, { useState, useEffect } from 'react'
import { Drawer, Button, Badge, TextInput, Select } from 'flowbite-react'
import { FaTimes, FaTasks } from 'react-icons/fa'
import { Task } from '../../redux/features/tasks/tasksSlice'
import { useDispatch } from 'react-redux'
import {
  updateTaskStatus,
  deleteTaskThunk,
} from '../../redux/features/tasks/tasksSlice'
import { AppDispatch } from '../../redux/store'
import Loader from '../Loader' // Import the Loader component

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
  const dispatch: AppDispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task | null>(task)
  const [loading, setLoading] = useState(false) // Add loading state

  useEffect(() => {
    if (task) {
      setEditedTask(task)
    }
  }, [task])

  if (!task || !editedTask) return null

  const handleEditToggle = async () => {
    if (isEditing) {
      setLoading(true) // Show loader while updating task
      await dispatch(updateTaskStatus({ taskId: editedTask.id, ...editedTask }))
      setLoading(false) // Hide loader after update
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setEditedTask({
      ...editedTask,
      [name]: value,
    })
  }

  const handleDelete = async () => {
    setLoading(true) // Show loader while deleting task
    await dispatch(deleteTaskThunk(editedTask.id))
    setLoading(false) // Hide loader after deletion
    onClose() // Close the drawer after deletion
  }

  const statusColors: { [key: string]: string } = {
    todo: 'yellow',
    'in-progress': 'blue',
    review: 'red',
    done: 'green',
  }

  return (
    <Drawer
      position="right"
      open={isOpen}
      onClose={onClose}
      className="z-50 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full sm:w-2/3 lg:w-1/3"
    >
      <Drawer.Header className="p-4 md:p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaTasks className="text-blue-600" size={24} />
          <h2 className="text-lg md:text-base font-bold text-gray-900 dark:text-gray-200">
            Task Details
          </h2>
        </div>
        <Button
          color="gray"
          size="sm"
          onClick={onClose}
          className="flex items-center justify-center"
        >
          <FaTimes />
        </Button>
      </Drawer.Header>

      <Drawer.Items className="p-6 md:p-4 space-y-6">
        {loading ? (
          <Loader message="Processing task..." />
        ) : (
          <>
            {/* Task Title */}
            <div className="space-y-2">
              <h3 className="text-lg md:text-base font-semibold text-gray-900 dark:text-gray-200">
                Title
              </h3>
              {isEditing ? (
                <TextInput
                  name="title"
                  value={editedTask.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  className="dark:bg-gray-700"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-sm">
                  {task.title}
                </p>
              )}
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <h3 className="text-lg md:text-base font-semibold text-gray-900 dark:text-gray-200">
                Description
              </h3>
              {isEditing ? (
                <TextInput
                  name="description"
                  value={editedTask.description || ''}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  className="dark:bg-gray-700"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-sm">
                  {task.description || 'No description provided'}
                </p>
              )}
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <h3 className="text-lg md:text-base font-semibold text-gray-900 dark:text-gray-200">
                Assignee
              </h3>
              {isEditing ? (
                <TextInput
                  name="assignee"
                  value={editedTask.assignee || ''}
                  onChange={handleInputChange}
                  placeholder="Assign user"
                  className="dark:bg-gray-700"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-sm">
                  {task.assignee || 'Unassigned'}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <h3 className="text-lg md:text-base font-semibold text-gray-900 dark:text-gray-200">
                Due Date
              </h3>
              {isEditing ? (
                <TextInput
                  name="dueDate"
                  type="date"
                  value={editedTask.dueDate}
                  onChange={handleInputChange}
                  className="dark:bg-gray-700"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-sm">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h3 className="text-lg md:text-base font-semibold text-gray-900 dark:text-gray-200">
                Status
              </h3>
              {isEditing ? (
                <Select
                  name="status"
                  value={editedTask.status}
                  onChange={handleInputChange}
                  className="dark:bg-gray-700"
                >
                  <option value="todo">To-Do</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </Select>
              ) : (
                <Badge
                  color={statusColors[task.status] || 'gray'}
                  className="text-sm font-semibold py-1 px-3 md:py-1 md:px-2"
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                color={isEditing ? 'success' : 'gray'}
                onClick={handleEditToggle}
                className="flex-1 text-sm py-2 sm:text-base sm:py-2.5 transition-colors"
              >
                {isEditing ? 'Submit' : 'Edit Task'}
              </Button>
              {isEditing && (
                <Button
                  color="gray"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 text-sm py-2 sm:text-base sm:py-2.5 transition-colors"
                >
                  Cancel
                </Button>
              )}
              <Button
                color="failure"
                onClick={handleDelete}
                className="flex-1 text-sm py-2 sm:text-base sm:py-2.5 transition-colors"
              >
                Delete Task
              </Button>
            </div>
          </>
        )}
      </Drawer.Items>
    </Drawer>
  )
}

export default TaskDetailsDrawer
