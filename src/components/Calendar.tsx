import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from 'date-fns'
import { MdArrowBack, MdArrowForward, MdAdd } from 'react-icons/md'
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

const sampleTasks: Task[] = [
  {
    id: 1,
    title: 'Team Meeting',
    date: new Date(2024, 7, 14),
    description: 'Monthly review meeting with the team.',
    assignee: 'John Doe',
    priority: 'High',
    status: 'Scheduled',
  },
  {
    id: 2,
    title: 'Project Deadline',
    date: new Date(2024, 7, 22),
    description: 'Final deadline for the project submission.',
    assignee: 'Jane Smith',
    priority: 'Medium',
    status: 'Due Soon',
  },
  {
    id: 3,
    title: 'Annual Review',
    date: new Date(2024, 7, 27),
    description: 'Annual performance review meeting.',
    assignee: 'Alice Johnson',
    priority: 'Low',
    status: 'Pending',
  },
]

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    const task = sampleTasks.find(
      (task) => task.date.toDateString() === date.toDateString(),
    )
    if (task) {
      setSelectedTask(task)
      setDrawerOpen(true)
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  })

  const getTaskTitle = (date: Date) => {
    const task = sampleTasks.find(
      (t) => t.date.toDateString() === date.toDateString(),
    )
    return task ? task.title : ''
  }

  return (
    <div className="w-full bg-gray-900 text-gray-100 border border-slate-400 rounded-md">
      <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-gray-300 hover:text-gray-100"
        >
          <MdArrowBack size={24} />
          <span className="sr-only">Previous month</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-100">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        <button
          onClick={handleNextMonth}
          className="p-2 text-gray-300 hover:text-gray-100"
        >
          <MdArrowForward size={24} />
          <span className="sr-only">Next month</span>
        </button>
      </header>
      <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center text-sm font-medium mt-4 mx-2 sm:mx-4">
        <div className="py-2 text-gray-300">S</div>
        <div className="py-2 text-gray-300">M</div>
        <div className="py-2 text-gray-300">T</div>
        <div className="py-2 text-gray-300">W</div>
        <div className="py-2 text-gray-300">T</div>
        <div className="py-2 text-gray-300">F</div>
        <div className="py-2 text-gray-300">S</div>
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isSelected = selectedDate?.toDateString() === day.toDateString()
          const taskTitle = getTaskTitle(day)

          return (
            <button
              key={day.toString()}
              onClick={() => handleDateChange(day)}
              className={`relative flex items-center justify-center text-lg ${isCurrentMonth ? 'bg-gray-800 text-gray-100' : 'text-gray-400'} ${isSelected ? 'border-4 border-blue-500' : ''} rounded-lg ${isCurrentMonth ? 'w-16 h-16 sm:w-24 sm:h-24' : 'w-12 h-12 sm:w-16 sm:h-16'}`}
              style={{ minHeight: '64px', minWidth: '64px' }}
            >
              <span className="block">{format(day, 'd')}</span>
              {taskTitle && (
                <div
                  className="absolute bottom-2 left-2 right-2 bg-red-500 text-white text-xs font-medium rounded-lg p-1 truncate"
                  title={taskTitle}
                >
                  {taskTitle.length > 10
                    ? `${taskTitle.slice(0, 10)}...`
                    : taskTitle}
                </div>
              )}
              {day.toDateString() === new Date().toDateString() && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-500 rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
      >
        <MdAdd size={24} />
        <span className="sr-only">Add Event</span>
      </button>
      <CalendarDrawer
        task={selectedTask || null}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}

export default CalendarComponent
