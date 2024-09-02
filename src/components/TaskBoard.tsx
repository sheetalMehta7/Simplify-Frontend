import React, { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { Table } from 'flowbite-react'
import TaskCard from './TaskCard'
import TaskDetailsDrawer from '../components/TaskDetailsDrawer'

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

const initialTasks: TaskColumns = {
  todo: [
    {
      id: 'task-1',
      content: 'Design the new landing page',
      assignee: 'John Doe',
      dueDate: '2024-09-01',
      status: 'todo',
    },
    {
      id: 'task-2',
      content: 'Implement user authentication',
      assignee: 'Jane Doe',
      dueDate: '2024-09-05',
      status: 'todo',
    },
  ],
  'in-progress': [
    {
      id: 'task-3',
      content: 'Develop the API endpoints',
      assignee: 'John Doe',
      dueDate: '2024-09-10',
      status: 'in-progress',
    },
    {
      id: 'task-4',
      content: 'Write unit tests for components',
      assignee: 'Emily Smith',
      dueDate: '2024-09-12',
      status: 'in-progress',
    },
  ],
  review: [
    {
      id: 'task-5',
      content: 'Code review for authentication module',
      assignee: 'Alice Johnson',
      dueDate: '2024-09-15',
      status: 'review',
    },
  ],
  done: [
    {
      id: 'task-6',
      content: 'Setup project repository',
      assignee: 'Michael Brown',
      dueDate: '2024-08-25',
      status: 'done',
    },
    {
      id: 'task-7',
      content: 'Configure build pipeline',
      assignee: 'Sophia Davis',
      dueDate: '2024-08-28',
      status: 'done',
    },
  ],
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskColumns>(initialTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const sourceColumn = source.droppableId
    const destinationColumn = destination.droppableId
    const sourceTasks = Array.from(tasks[sourceColumn])
    const [movedTask] = sourceTasks.splice(source.index, 1)

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
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDrawerOpen(true)
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
