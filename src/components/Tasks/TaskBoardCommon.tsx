import React from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { Table, Button } from 'flowbite-react'
import TaskCard from './TaskCard'
import { Task } from '../../redux/features/tasks/tasksSlice'

interface TaskBoardCommonProps {
  tasks: { [key: string]: Task[] } // Define the structure for tasks
  onCreateTask: () => void
  onTaskClick: (task: Task) => void
  onEditTask: (task: Task) => void
  onDragEnd: (result: DropResult) => void
}

const TaskBoardCommon: React.FC<TaskBoardCommonProps> = ({
  tasks = { todo: [], 'in-progress': [], review: [], done: [] }, // Fallback for empty tasks
  onCreateTask,
  onTaskClick,
  onEditTask,
  onDragEnd,
}) => {
  const columns = ['todo', 'in-progress', 'review', 'done']

  // Log the tasks to check the structure
  console.log('Task Data:', tasks)

  const areAllTasksEmpty =
    tasks &&
    Object.values(tasks).every(
      (taskList) => Array.isArray(taskList) && taskList.length === 0,
    )

  // Log the result of the empty check for debugging
  console.log('Are all tasks empty?', areAllTasksEmpty)

  return (
    <div className="relative p-4 h-screen">
      {areAllTasksEmpty ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            No tasks available. You can create a new task to get started.
          </p>
          <Button onClick={onCreateTask} color="blue">
            Create Task
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
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
                                    snapshot.isDragging
                                      ? 'transform scale-105'
                                      : ''
                                  }`}
                                  onClick={() => onTaskClick(task)}
                                >
                                  <TaskCard
                                    task={task}
                                    onEdit={onEditTask}
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
        </DragDropContext>
      )}
    </div>
  )
}

export default TaskBoardCommon
