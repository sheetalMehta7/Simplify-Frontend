import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import moment from 'moment'
import { CalendarDrawer } from './CalendarDrawer'

interface Task {
  id: number
  title: string
  date: Date
  description?: string
  assignee?: string
  priority?: string
  status?: string
}

interface CalendarProps {
  tasks?: Task[]
}

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

const CalendarComponent: React.FC<CalendarProps> = ({ tasks = [] }) => {
  const [value, setValue] = useState<Value>(new Date())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Demo tasks
  const demoTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      date: new Date(2024, 7, 28), // August 28, 2024
      priority: 'high',
      description: 'This is a high priority task.',
    },
    {
      id: 2,
      title: 'Task 2',
      date: new Date(2024, 7, 28), // August 28, 2024
      priority: 'medium',
      description: 'This is a medium priority task.',
    },
    {
      id: 3,
      title: 'Task 3',
      date: new Date(2024, 7, 29), // August 29, 2024
      priority: 'low',
      description: 'This is a low priority task.',
    },
  ]

  // Combine provided tasks with demo tasks
  const allTasks = [...demoTasks, ...tasks]

  // Handle date changes
  const handleDateChange = (newDate: Value) => {
    setValue(newDate)
  }

  // Helper function to get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return allTasks.filter((task) =>
      moment(task.date).isSame(moment(date), 'day'),
    )
  }

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDrawerOpen(true)
  }
  // Custom tile content function
  const tileContent = ({ date }: { date: Date }) => {
    const tasksForDate = getTasksForDate(date)
    return (
      <div>
        {tasksForDate.map((task) => (
          <div
            key={task.id}
            className={`text-xs rounded-full p-1 mb-1 ${
              task.priority === 'high'
                ? 'bg-red-500 text-white'
                : task.priority === 'medium'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-green-700 text-white'
            }`}
            onClick={() => handleTaskClick(task)}
          >
            {task.title}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white p-4">
      <div className="relative w-full md:w-2/3 mx-auto bg-gray-800 shadow-md rounded-lg p-4 flex-1">
        <div className="h-full flex flex-col">
          <Calendar
            onChange={handleDateChange}
            value={value}
            className="react-calendar flex-1"
            tileContent={tileContent} // Custom tile content
          />
        </div>
      </div>

      {/* Drawer for Task Details */}
      <CalendarDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}

export default CalendarComponent
