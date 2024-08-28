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
  setMonth,
} from 'date-fns'
import {
  MdArrowDropDown,
  MdArrowCircleLeft,
  MdArrowCircleRight,
} from 'react-icons/md'
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

const monthsList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDropdownOpen, setDropdownOpen] = useState(false)

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

  const handleMonthJump = (monthIndex: number) => {
    setCurrentDate(setMonth(currentDate, monthIndex))
    setDropdownOpen(false)
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
    <div className="w-full text-gray-100 border border-slate-500 rounded-md relative pb-2">
      <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 relative">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-gray-300 hover:text-gray-100"
        >
          <MdArrowCircleLeft size={30} />
          <span className="sr-only">Previous month</span>
        </button>

        <h2 className="text-lg font-bold text-center flex-grow">
          {format(currentDate, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center space-x-4 ml-auto">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
            >
              Months <MdArrowDropDown className="ml-1" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg z-10">
                {monthsList.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthJump(index)}
                    className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600"
          >
            Add Event
          </button>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 text-gray-300 hover:text-gray-100"
        >
          <MdArrowCircleRight size={30} />
          <span className="sr-only">Next month</span>
        </button>
      </header>

      <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center text-sm font-medium mt-4 mx-2 sm:mx-4 pl-10">
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
              className={`relative flex items-center justify-center text-lg ${
                isCurrentMonth ? 'bg-gray-800 text-gray-100' : 'text-gray-400'
              } ${isSelected ? 'border-4 border-blue-500' : ''} rounded-lg ${
                isCurrentMonth
                  ? 'w-16 h-16 sm:w-24 sm:h-24'
                  : 'w-12 h-12 sm:w-16 sm:h-16'
              }`}
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

      <CalendarDrawer
        task={selectedTask || null}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}

export default CalendarComponent
