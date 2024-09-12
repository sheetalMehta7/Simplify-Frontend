import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createNewTask,
  fetchTasks,
  moveTaskLocally,
  Task,
} from '../../redux/features/tasks/tasksSlice'
import { AppDispatch, RootState } from '../../redux/store'
import CreateTaskModal from '../Modals/CreateTaskModal'
import TaskBoardCommon from './TaskBoardCommon'
import { DropResult } from 'react-beautiful-dnd'

interface TeamTaskBoardProps {
  teamId: string
}

// Define the correct structure for the task board columns
interface TaskBoardColumns {
  todo: Task[]
  'in-progress': Task[]
  review: Task[]
  done: Task[]
}

const TeamTaskBoard: React.FC<TeamTaskBoardProps> = ({ teamId }) => {
  const dispatch: AppDispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.profile)

  // Fetch tasks specifically for the given teamId
  const tasks: TaskBoardColumns = useSelector(
    (state: RootState) =>
      state.tasks.teamTasks?.[teamId] ?? {
        todo: [],
        'in-progress': [],
        review: [],
        done: [],
      },
  )

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Convert tasks to match { [key: string]: Task[] }
  const taskMap: { [key: string]: Task[] } = {
    ...tasks,
  }

  // Fetch team tasks when the component mounts or when teamId changes
  useEffect(() => {
    if (teamId) {
      dispatch(fetchTasks(teamId)) // Fetch tasks by teamId
    }
  }, [dispatch, teamId])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const sourceStatus = source.droppableId as keyof TaskBoardColumns
    const destinationStatus = destination.droppableId as keyof TaskBoardColumns

    const taskId = taskMap[sourceStatus]?.[source.index]?.id
    if (!taskId) return

    const draggedTask = taskMap[sourceStatus]?.find(
      (task) => task.id === taskId,
    )
    if (!draggedTask) return

    // Optimistically update the task locally
    dispatch(
      moveTaskLocally({
        taskId,
        oldStatus: sourceStatus,
        newStatus: destinationStatus,
      }),
    )
  }

  const handleCreateTask = (task: Partial<Task>) => {
    const newTask = { ...task, teamId } as Task
    dispatch(createNewTask(newTask)) // Dispatch a new task creation specific to the team
    setIsCreateModalOpen(false)
  }

  return (
    <>
      {/* Task Board */}
      <TaskBoardCommon
        tasks={taskMap} // Now the tasks have the correct { [key: string]: Task[] } type
        onCreateTask={() => setIsCreateModalOpen(true)}
        onTaskClick={() => {}}
        onEditTask={() => {}}
        onDragEnd={onDragEnd}
      />

      {/* Create Task Modal */}
      {user && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateTask}
          userId={user.id}
          userName={user.name}
          teamId={teamId} // Pass teamId for team task creation
        />
      )}
    </>
  )
}

export default TeamTaskBoard
