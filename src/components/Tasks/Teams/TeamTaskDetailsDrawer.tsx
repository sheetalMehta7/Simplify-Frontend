import React, { useState, useEffect } from 'react'
import { Drawer, Button, TextInput, Select } from 'flowbite-react'
import { FaTimes, FaTasks, FaFlag, FaArrowLeft } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import {
  updateTeamTaskThunk,
  deleteTeamTaskThunk,
  moveTeamTaskLocally,
} from '../../../redux/features/teams/teamTaskSlice'
import { TeamTask } from '../../../types/Task'
import { AppDispatch } from '../../../redux/store'

interface TeamTaskDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  task: TeamTask | null
}

const TeamTaskDetailsDrawer: React.FC<TeamTaskDetailsDrawerProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const dispatch: AppDispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<TeamTask | null>(task)

  useEffect(() => {
    if (task) {
      setEditedTask(task)
    }
  }, [task])

  if (!task || !editedTask) return null

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setEditedTask({
      ...editedTask,
      [name]: value,
    })
  }

  const handleEditToggle = async () => {
    if (isEditing && editedTask) {
      if (task.status !== editedTask.status) {
        dispatch(
          moveTeamTaskLocally({
            taskId: editedTask.id,
            oldStatus: task.status || 'todo', // Default to 'todo' if status is undefined
            newStatus: editedTask.status || 'todo', // Default to 'todo'
          }),
        )
      }
      await dispatch(
        updateTeamTaskThunk({
          teamId: task.teamId,
          taskId: task.id,
          data: {
            title: editedTask.title,
            description: editedTask.description,
            dueDate: editedTask.dueDate,
            status: editedTask.status,
            priority: editedTask.priority,
            assigneeIds: editedTask.assigneeIds,
          },
        }),
      )
    }
    setIsEditing(!isEditing)
  }

  const handleDelete = async () => {
    await dispatch(
      deleteTeamTaskThunk({ teamId: editedTask.teamId, taskId: editedTask.id }),
    )
    onClose()
  }

  const statusColors: { [key: string]: string } = {
    todo: 'text-yellow-500',
    'in-progress': 'text-blue-500',
    review: 'text-red-500',
    done: 'text-green-500',
  }

  return (
    <Drawer
      position="right"
      open={isOpen}
      onClose={onClose}
      className="z-50 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full sm:w-1/2 lg:w-1/3"
    >
      <Drawer.Header className="p-4 md:p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center justify-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white p-2"
            >
              <FaArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <FaTasks className="text-blue-600" size={24} />
          )}
          <h2 className="text-lg md:text-base font-bold text-gray-900 dark:text-gray-200">
            Team Task Details
          </h2>
        </div>
        <Button
          color="gray"
          size="sm"
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8"
        >
          <FaTimes />
        </Button>
      </Drawer.Header>

      <Drawer.Items className="p-6 md:p-4 space-y-6">
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

          {/* Task Assignees */}
          <div className="space-y-2">
            <h3 className="text-lg md:text-base font-semibold text-gray-900 dark:text-gray-200">
              Assignees
            </h3>
            {isEditing ? (
              <TextInput
                name="assigneeIds"
                value={editedTask.assigneeIds?.join(', ') || ''}
                onChange={handleInputChange}
                placeholder="Assign users"
                className="dark:bg-gray-700"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-sm">
                {task.assigneeIds?.join(', ') || 'Unassigned'}
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
                value={new Date(editedTask.dueDate).toISOString().split('T')[0]}
                onChange={handleInputChange}
                className="dark:bg-gray-700"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-sm">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Task Status */}
          <div className="space-y-2">
            <h3 className="text-lg md:text-base font-semibold text-gray-900 dark:text-gray-200">
              Status
            </h3>
            {isEditing ? (
              <Select
                name="status"
                value={editedTask.status || 'todo'}
                onChange={handleInputChange}
                className="dark:bg-gray-700"
              >
                <option value="todo">To-Do</option>
                <option value="in-progress">In-Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </Select>
            ) : (
              <div className="flex items-center space-x-2">
                <FaFlag
                  className={`${
                    statusColors[task.status || 'todo'] || 'text-gray-500'
                  } w-5 h-5`}
                />
                <span className="text-base md:text-sm">
                  {task.status
                    ? task.status.charAt(0).toUpperCase() + task.status.slice(1)
                    : 'Todo'}
                </span>
              </div>
            )}
          </div>

          {/* Task Priority */}
          <div className="space-y-2">
            <h3 className="text-lg md:text-base font-semibold text-gray-900 dark:text-gray-200">
              Priority
            </h3>
            {isEditing ? (
              <Select
                name="priority"
                value={editedTask.priority || 'low'}
                onChange={handleInputChange}
                className="dark:bg-gray-700"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            ) : (
              <span className="text-base md:text-sm">
                {editedTask.priority
                  ? editedTask.priority.charAt(0).toUpperCase() +
                    editedTask.priority.slice(1)
                  : 'Low'}
              </span>
            )}
          </div>

          {/* Actions: Edit, Cancel, Delete */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              color={isEditing ? 'success' : 'gray'}
              onClick={handleEditToggle}
              className="w-24 text-xs py-1 sm:text-sm sm:py-1 transition-colors"
            >
              {isEditing ? 'Submit' : 'Edit Task'}
            </Button>
            {isEditing && (
              <Button
                color="gray"
                onClick={() => setIsEditing(false)}
                className="w-24 text-xs py-1 sm:text-sm sm:py-1 transition-colors"
              >
                Cancel
              </Button>
            )}
            <Button
              color="failure"
              onClick={handleDelete}
              className="w-24 text-xs py-1 sm:text-sm sm:py-1 transition-colors"
            >
              Delete
            </Button>
          </div>
        </>
      </Drawer.Items>
    </Drawer>
  )
}

export default TeamTaskDetailsDrawer
