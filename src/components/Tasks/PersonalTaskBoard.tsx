import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { Table, Button } from 'flowbite-react'
import TaskCard from './TaskCard'
import TaskDetailsDrawer from '../Tasks/TaskDetailsDrawer'
import CreateTaskModal from '../Modals/CreateTaskModal'
import {
  fetchTasks,
  updateTaskThunk,
  createNewTask,
  moveTaskLocally,
} from '../../redux/features/tasks/tasksSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { Task } from '../../redux/features/tasks/tasksSlice'
import Loader from '../Loader'

interface PersonalTaskBoardProps {
  filters?: { date: string; assignee: string; status: string } // Optional filters
}

const PersonalTaskBoard: React.FC<PersonalTaskBoardProps> = ({
  filters = { date: '', assignee: '', status: '' }, // Default values for filters
}) => {
  const dispatch: AppDispatch = useDispatch()
  const personalTasks = useSelector(
    (state: RootState) => state.tasks.personalTasks,
  ) // Fetching only personal tasks
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
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

  // Apply filters to tasks
  const applyFilters = (tasks: { [key: string]: Task[] }) => {
    const filteredTasks = Object.entries(tasks).reduce(
      (acc: { [key: string]: Task[] }, [status, tasksArray]) => {
        acc[status] = tasksArray.filter((task) => {
          const matchesDate =
            !filters?.date || task.dueDate.startsWith(filters.date) // Gracefully handle undefined filters
          const matchesAssignee =
            !filters?.assignee || task.assignee === filters.assignee
          const matchesStatus =
            !filters?.status || task.status === filters.status
          return matchesDate && matchesAssignee && matchesStatus
        })
        return acc
      },
      { todo: [], 'in-progress': [], review: [], done: [] },
    )
    return filteredTasks
  }

  const filteredTasks = applyFilters(personalTasks)

  // Handle drag-and-drop event
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const taskId = filteredTasks[source.droppableId][source.index].id
    const newStatus = destination.droppableId

    const draggedTask = personalTasks[source.droppableId].find(
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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDrawerOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsDrawerOpen(true)
  }

  const areAllTasksEmpty = Object.values(personalTasks).every(
    (taskList) => taskList.length === 0,
  )
  const areFilteredTasksEmpty = Object.values(filteredTasks).every(
    (taskList) => taskList.length === 0,
  )

  return (
    <>
      <div className="relative p-4 h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader message="Loading tasks..." />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex-1 overflow-x-auto min-h-screen">
              {areAllTasksEmpty && areFilteredTasksEmpty ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-500 dark:text-gray-300 mb-4">
                    No tasks available. You can create a new task to get
                    started.
                  </p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    color="blue"
                  >
                    Create Task
                  </Button>
                </div>
              ) : areFilteredTasksEmpty ? (
                <div className="text-center text-gray-500 dark:text-gray-300 p-4">
                  No tasks found for the applied filters.
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
        )}
      </div>

      <TaskDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        task={selectedTask}
      />

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(task) => dispatch(createNewTask(task))}
        userId="1"
        userName="John Doe"
      />
    </>
  )
}

const TaskBoardTable: React.FC<{
  tasks: { [key: string]: Task[] }
  onTaskClick: (task: Task) => void
  onEdit: (task: Task) => void
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
                            <TaskCard
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

export default PersonalTaskBoard
