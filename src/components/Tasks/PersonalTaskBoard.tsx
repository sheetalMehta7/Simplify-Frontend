import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTasks,
  updateTaskThunk,
  moveTaskLocally,
  Task,
  createNewTask,
} from '../../redux/features/tasks/tasksSlice'
import { AppDispatch, RootState } from '../../redux/store'
import Loader from '../Loader'
import TaskBoardCommon from './TaskBoardCommon'
import { DropResult } from 'react-beautiful-dnd'
import CreateTaskModal from '../Modals/CreateTaskModal'

interface TaskBoardProps {
  filters: { date: string; assignee: string; status: string }
}

const PersonalTaskBoard: React.FC<TaskBoardProps> = ({ filters }) => {
  const dispatch: AppDispatch = useDispatch()
  const personalTasks = useSelector(
    (state: RootState) => state.tasks.personalTasks,
  )
  const user = useSelector((state: RootState) => state.user.profile)
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Log the personalTasks to inspect the structure
  useEffect(() => {
    console.log('Personal Tasks:', personalTasks)
  }, [personalTasks])

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      await dispatch(fetchTasks()) // Fetch tasks without teamId to get only personal tasks
      setLoading(false)
    }
    loadTasks()
  }, [dispatch])

  const applyFilters = (tasks: { [key: string]: Task[] }) => {
    const filteredTasks = Object.entries(tasks).reduce(
      (acc: { [key: string]: Task[] }, [status, tasksArray]) => {
        acc[status] = tasksArray.filter((task) => {
          const matchesDate =
            !filters.date || task.dueDate.startsWith(filters.date)
          const matchesAssignee =
            !filters.assignee || task.assignee === filters.assignee
          const matchesStatus =
            !filters.status || task.status === filters.status
          return matchesDate && matchesAssignee && matchesStatus
        })
        return acc
      },
      { todo: [], 'in-progress': [], review: [], done: [] },
    )
    return filteredTasks
  }

  const filteredTasks = applyFilters(personalTasks)

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const taskId = filteredTasks[source.droppableId][source.index].id
    const newStatus = destination.droppableId

    // Optimistically update the task locally
    dispatch(
      moveTaskLocally({
        taskId,
        oldStatus: source.droppableId,
        newStatus,
      }),
    )

    const draggedTask = personalTasks[source.droppableId].find(
      (task) => task.id === taskId,
    )
    if (!draggedTask) return

    await dispatch(updateTaskThunk({ ...draggedTask, status: newStatus }))
  }

  const handleCreateTask = (newTask: Partial<Task>) => {
    dispatch(
      createNewTask({
        ...newTask,
        teamId: undefined, // Ensure it's personal
      }),
    )
    setIsCreateModalOpen(false)
  }

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader message="Loading tasks..." />
        </div>
      ) : (
        <>
          <TaskBoardCommon
            tasks={filteredTasks}
            onCreateTask={() => setIsCreateModalOpen(true)}
            onTaskClick={(task) => console.log('Task clicked:', task)}
            onEditTask={(task) => console.log('Edit task:', task)}
            onDragEnd={onDragEnd}
          />
          {/* Create Task Modal */}
          {user && (
            <CreateTaskModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSave={handleCreateTask}
              userId={user.id}
              userName={user.name} // Pass userName from Redux store
            />
          )}
        </>
      )}
    </>
  )
}

export default PersonalTaskBoard
