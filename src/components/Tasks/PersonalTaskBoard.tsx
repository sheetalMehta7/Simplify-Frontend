import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTasks,
  updateTaskThunk,
  createNewTask,
  moveTaskLocally,
  Task,
} from '../../redux/features/tasks/tasksSlice'
import { AppDispatch, RootState } from '../../redux/store'
import Loader from '../Loader'
import CreateTaskModal from '../Modals/CreateTaskModal'
import TaskBoardCommon from './TaskBoardCommon'
import { DropResult } from 'react-beautiful-dnd'

interface TaskBoardProps {
  filters: { date: string; assignee: string; status: string; teamId: string }
}

const PersonalTaskBoard: React.FC<TaskBoardProps> = ({ filters }) => {
  const dispatch: AppDispatch = useDispatch()
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const user = useSelector((state: RootState) => state.user.profile)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      await dispatch(fetchTasks())
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
          const matchesTeam = !filters.teamId || task.teamId === filters.teamId
          return matchesDate && matchesAssignee && matchesStatus && matchesTeam
        })
        return acc
      },
      { todo: [], 'in-progress': [], review: [], done: [] },
    )
    return filteredTasks
  }

  const filteredTasks = applyFilters(tasks)

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const taskId = filteredTasks[source.droppableId][source.index].id
    const newStatus = destination.droppableId

    const draggedTask = tasks[source.droppableId].find(
      (task) => task.id === taskId,
    )

    if (!draggedTask) return

    dispatch(
      moveTaskLocally({
        taskId,
        oldStatus: source.droppableId,
        newStatus,
      }),
    )

    await dispatch(updateTaskThunk({ ...draggedTask, status: newStatus }))
  }

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader message="Loading tasks..." />
        </div>
      ) : (
        <TaskBoardCommon
          tasks={filteredTasks}
          onCreateTask={() => setIsCreateModalOpen(true)}
          onTaskClick={() => {}}
          onEditTask={() => {}}
          onDragEnd={onDragEnd}
        />
      )}

      {user && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={(task) =>
            dispatch(createNewTask({ ...task, userId: user.id }))
          }
          userId={user.id}
          userName={user.name}
        />
      )}
    </>
  )
}

export default PersonalTaskBoard
