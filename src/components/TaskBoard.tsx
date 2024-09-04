import React, { useState, useEffect } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { Table } from 'flowbite-react'
import TaskCard from './TaskCard'
import TaskDetailsDrawer from '../components/TaskDetailsDrawer'
import { getAllTasks, createTask, updateTask, deleteTask } from '../api/taskApi'

export interface Task {
  id: string
  content: string
  assignee: string
  dueDate: string
  status: string
}

interface TaskColumns {
  [key: string]: Task[]
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskColumns>({
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    // Fetch tasks from the API on component mount
    const fetchTasks = async () => {
      const tasks = await getAllTasks()
      const tasksByStatus: TaskColumns = {
        todo: [],
        'in-progress': [],
        review: [],
        done: [],
      }

      tasks.forEach((task) => {
        tasksByStatus[task.status].push(task)
      })

      setTasks(tasksByStatus)
    }

    fetchTasks()
  }, [])

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const sourceColumn = source.droppableId
    const destinationColumn = destination.droppableId
    const sourceTasks = Array.from(tasks[sourceColumn])
    const [movedTask] = sourceTasks.splice(source.index, 1)

    movedTask.status = destinationColumn // Update task status

    if (sourceColumn === destinationColumn) {
      sourceTasks.splice(destination.index, 0, movedTask)
      setTasks((prev) => ({ ...prev, [sourceColumn]: sourceTasks }))
    } else {
      const destinationTasks = Array.from(tasks[destinationColumn])
      destinationTasks.splice(destination.index, 0, movedTask)
      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: sourceTasks,
        [destinationColumn]: destinationTasks,
      }))
    }

    // Update the task status in the backend
    await updateTask(movedTask.id, { status: destinationColumn })
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDrawerOpen(true)
  }

  const handleTaskCreate = async (task: Partial<Task>) => {
    const newTask = await createTask(task)
    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, newTask], // Add new task to the "todo" column
    }))
  }

  const handleTaskDelete = async (taskId: string) => {
    await deleteTask(taskId)
    setTasks((prev) => {
      const newTasks = { ...prev }
      Object.keys(newTasks).forEach((columnId) => {
        newTasks[columnId] = newTasks[columnId].filter(
          (task) => task.id !== taskId,
        )
      })
      return newTasks
    })
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto p-4">
          <Table className="min-w-full table-auto h-full">
            <Table.Head className="text-center">
              {['To-Do', 'In-Progress', 'Review', 'Done'].map((header) => (
                <Table.HeadCell
                  key={header}
                  className="w-1/4 p-2 text-xs md:text-sm"
                >
                  {header}
                </Table.HeadCell>
              ))}
            </Table.Head>
            <Table.Body className="h-full divide-y">
              <Table.Row className="h-full">
                {['todo', 'in-progress', 'review', 'done'].map((columnId) => (
                  <Table.Cell
                    key={columnId}
                    className="h-full border border-slate-700 rounded-md p-2 align-top"
                  >
                    <Droppable droppableId={columnId}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[400px] md:min-h-[500px] p-2 rounded-lg transition-colors duration-200 ease-in-out flex flex-col h-full ${
                            snapshot.isDraggingOver
                              ? 'bg-slate-300 dark:bg-slate-600'
                              : 'bg-transparent'
                          }`}
                        >
                          {tasks[columnId].map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-lg mb-2 transition-transform duration-200 ease-in-out ${
                                    snapshot.isDragging
                                      ? 'transform scale-105'
                                      : ''
                                  }`}
                                  onClick={() => handleTaskClick(task)}
                                >
                                  <TaskCard
                                    title={task.content}
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
        </div>
      </DragDropContext>

      <TaskDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        task={selectedTask}
      />
    </>
  )
}

export default TaskBoard
