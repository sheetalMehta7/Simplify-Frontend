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
  updateTaskStatus,
  deleteTaskThunk,
  createNewTask,
} from '../../redux/features/tasks/tasksSlice'
import { RootState, AppDispatch } from '../../redux/store'
import { Task } from '../../redux/features/tasks/tasksSlice'

const TaskBoard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.tasks,
  )
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Fetch tasks when the component is mounted
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  // Handle drag and drop between columns
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const taskId = tasks[source.droppableId][source.index].id
    const newStatus = destination.droppableId

    dispatch(updateTaskStatus({ taskId, status: newStatus }))
  }

  // Handle task creation and make sure it is added to the correct column
  const handleTaskCreate = (task: Partial<Task>) => {
    if (!task.status) {
      task.status = 'todo' // Default status if not provided
    }
    dispatch(createNewTask(task))
    setIsCreateModalOpen(false)
  }

  // Handle task deletion
  const handleTaskDelete = (taskId: string) => {
    dispatch(deleteTaskThunk(taskId))
  }

  const areAllTasksEmpty = Object.values(tasks).every(
    (taskList) => taskList.length === 0,
  )

  return (
    <>
      {loading && <div>Loading tasks...</div>}
      {error && <div>Error: {error}</div>}

      <div className="relative p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto">
            <TaskBoardTable tasks={tasks} onTaskClick={setSelectedTask} />
          </div>
        </DragDropContext>

        {areAllTasksEmpty && (
          <div className="absolute inset-0 flex justify-center items-center">
            <Button onClick={() => setIsCreateModalOpen(true)} color="blue">
              Create Task
            </Button>
          </div>
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
        onSave={handleTaskCreate}
        userId={1}
      />
    </>
  )
}

const TaskBoardTable: React.FC<{
  tasks: { [key: string]: Task[] }
  onTaskClick: (task: Task) => void
}> = ({ tasks, onTaskClick }) => {
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
                              title={task.title}
                              assignee={task.assignee}
                              dueDate={task.dueDate}
                              status={task.status}
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

export default TaskBoard
