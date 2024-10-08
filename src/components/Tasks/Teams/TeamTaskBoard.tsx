// TeamTaskBoard.tsx

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { Table, Button } from 'flowbite-react'
import TeamTaskCard from './TeamTaskCard'
import TaskDetailsDrawer from './TeamTaskDetailsDrawer'
import CreateTaskModal from '../../Modals/CreateTaskModal'
import {
  fetchTeamTasks,
  updateTeamTaskThunk,
  createTeamTaskThunk,
  moveTeamTaskLocally,
} from '../../../redux/features/teams/teamTaskSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import Loader from '../../Loader/Loader'
import { TeamTask } from '../../../types/Task'

interface TeamTaskBoardProps {
  teamId: string
  filters?: { date: string; assignee: string; status: string } // Optional filters
}

const TeamTaskBoard: React.FC<TeamTaskBoardProps> = ({
  teamId,
  filters = { date: '', assignee: '', status: '' },
}) => {
  const dispatch: AppDispatch = useDispatch()

  // Select teamTasks and teamMembers from Redux store
  const teamTasks = useSelector((state: RootState) => state.teamTask.tasks) // Directly use tasks without teamId
  const teamMembers =
    useSelector((state: RootState) => state.teams.teamMembers) || [] // Ensure it's always an array
  const [selectedTask, setSelectedTask] = useState<TeamTask | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch team tasks on component mount or when teamId changes
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      await dispatch(fetchTeamTasks(teamId))
      setLoading(false)
    }
    loadTasks()
  }, [dispatch, teamId])

  // Handle when there are no tasks or the data isn't ready yet
  if (loading || !teamTasks) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader message="Loading tasks..." />
      </div>
    )
  }

  // Apply filters if needed
  const applyFilters = (tasks: { [key: string]: TeamTask[] }) => {
    const filteredTasks = Object.entries(tasks).reduce(
      (acc: { [key: string]: TeamTask[] }, [status, tasksArray]) => {
        acc[status] = tasksArray.filter((task) => {
          const matchesDate =
            !filters.date || task.dueDate.toISOString().startsWith(filters.date) // Convert dueDate to string
          const matchesAssignee =
            !filters.assignee || task.assigneeIds?.includes(filters.assignee)
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

  const filteredTasks = applyFilters(teamTasks)

  // Check if all tasks are empty
  const areAllTasksEmpty = Object.values(filteredTasks).every(
    (taskList) => taskList.length === 0,
  )

  // Handle drag-and-drop event
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const taskId = filteredTasks[source.droppableId][source.index].id
    const newStatus = destination.droppableId

    const draggedTask = teamTasks?.[source.droppableId]?.find(
      (task) => task.id === taskId,
    )

    if (!draggedTask) return

    // Optimistically update the UI
    dispatch(
      moveTeamTaskLocally({
        taskId,
        oldStatus: source.droppableId,
        newStatus,
      }),
    )

    // Update the task status in the backend
    await dispatch(
      updateTeamTaskThunk({ teamId, taskId, data: { status: newStatus } }),
    )
  }

  // Handle task card click to open details drawer
  const handleTaskClick = (task: TeamTask) => {
    setSelectedTask(task)
    setIsDrawerOpen(true)
  }

  // Handle task edit to open details drawer
  const handleEditTask = (task: TeamTask) => {
    setSelectedTask(task)
    setIsDrawerOpen(true)
  }

  return (
    <>
      <div className="relative p-4 h-screen">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto min-h-screen">
            {areAllTasksEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-500 dark:text-gray-300 mb-4">
                  No tasks available for this team. You can create a new task to
                  get started.
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  gradientDuoTone="purpleToBlue"
                >
                  Create Task
                </Button>
              </div>
            ) : (
              <TaskBoardTable
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                onEdit={handleEditTask}
              />
            )}
          </div>
        </DragDropContext>
      </div>

      {/* Task Details Drawer */}
      <TaskDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        task={selectedTask}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(task) =>
          dispatch(createTeamTaskThunk({ teamId, data: { ...task } }))
        }
        teamId={teamId}
        teamName="" // You can pass the team name here if available
        teamMembers={teamMembers} // Pass the team members from Redux
      />
    </>
  )
}

const TaskBoardTable: React.FC<{
  tasks: { [key: string]: TeamTask[] }
  onTaskClick: (task: TeamTask) => void
  onEdit: (task: TeamTask) => void
}> = ({ tasks, onTaskClick, onEdit }) => {
  const columns = ['todo', 'in-progress', 'review', 'done']

  return (
    <Table className="min-w-full table-auto h-full">
      <Table.Head className="text-center">
        {['To-Do', 'In-Progress', 'Review', 'Done'].map((header) => (
          <Table.HeadCell key={header} className="w-1/4 p-2 text-xs md:text-sm">
            {header}
          </Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body className="h-full divide-y">
        <Table.Row className="h-full">
          {columns.map((columnId) => (
            <Table.Cell
              key={columnId}
              className="h-full p-2 align-top border dark:border-white border-black rounded-md"
            >
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver
                        ? 'bg-slate-300'
                        : 'bg-transparent'
                    }`}
                    style={{ minHeight: 'calc(100vh - 120px)' }}
                  >
                    {tasks[columnId]?.map((task, index) => (
                      <Draggable
                        key={task.id.toString()}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mb-2 shadow-sm hover:shadow-md transition-transform ${
                              snapshot.isDragging ? 'transform scale-105' : ''
                            }`}
                            onClick={() => onTaskClick(task)}
                          >
                            <TeamTaskCard
                              task={task}
                              onEdit={onEdit}
                              onTaskClick={onTaskClick}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Table.Cell>
          ))}
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

export default TeamTaskBoard
