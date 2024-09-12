import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createNewTask,
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

const TeamTaskBoard: React.FC<TeamTaskBoardProps> = ({ teamId }) => {
  const dispatch: AppDispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.profile)

  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const taskId = tasks[source.droppableId][source.index].id
    const newStatus = destination.droppableId

    const draggedTask = tasks[source.droppableId].find(
      (task) => task.id === taskId,
    )

    if (!draggedTask) return

    setTasks((prevTasks) => ({
      ...prevTasks,
      [source.droppableId]: prevTasks[source.droppableId].filter(
        (task) => task.id !== taskId,
      ),
      [newStatus]: [
        ...prevTasks[newStatus],
        { ...draggedTask, status: newStatus },
      ],
    }))

    dispatch(
      moveTaskLocally({
        taskId,
        oldStatus: source.droppableId,
        newStatus,
      }),
    )
  }

  const handleCreateTask = (task: Partial<Task>) => {
    const newTask = { ...task, teamId } as Task

    setTasks((prevTasks) => ({
      ...prevTasks,
      todo: [...prevTasks.todo, newTask],
    }))

    dispatch(createNewTask(newTask))
  }

  const openCreateTaskModal = () => {
    setIsCreateModalOpen(true)
  }

  return (
    <>
      <TaskBoardCommon
        tasks={tasks}
        onCreateTask={openCreateTaskModal}
        onTaskClick={() => {}}
        onEditTask={() => {}}
        onDragEnd={onDragEnd}
      />

      {user && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateTask}
          userId={user.id}
          userName={user.name}
          teamId={teamId}
        />
      )}
    </>
  )
}

export default TeamTaskBoard
