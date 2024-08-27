import React from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { Table } from 'flowbite-react'
import TaskCard from './TaskCard'

// Define the interface for Task
interface Task {
  id: string
  content: string
  assignee: string
  dueDate: string
  status: string
}

// Define the type for TaskColumns
interface TaskColumns {
  [key: string]: Task[]
}

// Demo data for tasks
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

export const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = React.useState<TaskColumns>(initialTasks)

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="overflow-x-auto p-4">
        <Table>
          <Table.Head className="text-center">
            <Table.HeadCell>To-Do</Table.HeadCell>
            <Table.HeadCell>In-Progress</Table.HeadCell>
            <Table.HeadCell>Review</Table.HeadCell>
            <Table.HeadCell>Done</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            <Table.Row>
              {['todo', 'in-progress', 'review', 'done'].map((columnId) => (
                <Table.Cell
                  key={columnId}
                  className="border border-slate-700 rounded-md w-1/4"
                >
                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[400px] p-2 ${
                          snapshot.isDraggingOver
                            ? 'bg-slate-700'
                            : 'bg-transparent'
                        } transition-colors duration-300`}
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
                                className={`bg-gray-800 text-white p-2 rounded-lg mb-2 transition-transform duration-300 ease-in-out ${
                                  snapshot.isDragging
                                    ? 'transform scale-105'
                                    : ''
                                }`}
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
  )
}
