import React, { useState } from 'react'
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
  isPast,
  isToday,
} from 'date-fns'
import {
  MdArrowDropDown,
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdToday,
} from 'react-icons/md'
import { Button } from 'flowbite-react'
import { CalendarDrawer } from './CalendarDrawer'
import CreateTaskModal from '../Modals/CreateTaskModal'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { Task, TaskFromApi } from '../../interfaces/Task'
import { createNewTask } from '../../redux/features/tasks/tasksSlice'

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

const CalendarComponent: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false)

  // Correctly typed dispatch function
  const dispatch: AppDispatch = useDispatch()

  // Fetch tasks from Redux store, grouped by status (e.g., { todo: [], 'in-progress': [], review: [], done: [] })
  const tasksFromRedux = useSelector((state: RootState) => state.tasks.tasks)

  // Convert TaskFromApi (string dates) to Task (Date objects) and flatten the tasks object
  const tasks: Task[] = Object.values(tasksFromRedux)
    .flat()
    .map((task: TaskFromApi) => ({
      ...task,
      dueDate: new Date(task.dueDate), // Convert string to Date object
    }))

  // Handle date change and open drawer if a task exists on the selected date
  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    const task = tasks.find(
      (task) => task.dueDate.toDateString() === date.toDateString(),
    )
    if (task) {
      setSelectedTask(task)
      setDrawerOpen(true)
    }
  }

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const handleMonthJump = (monthIndex: number) => {
    setCurrentDate(setMonth(currentDate, monthIndex))
    setDropdownOpen(false)
  }

  const handleAddTask = (newTask: Partial<Task>) => {
    const taskToDispatch = {
      ...newTask,
      dueDate: newTask.dueDate ? newTask.dueDate.toISOString() : undefined, // Convert Date to string
    }

    // Dispatch the new task to Redux
    dispatch(createNewTask(taskToDispatch))

    setCreateTaskModalOpen(false)
  }

  const handleTodayClick = () => {
    setCurrentDate(new Date())
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  })

  const getTaskTitle = (date: Date) => {
    const task = tasks.find(
      (task) => task.dueDate.toDateString() === date.toDateString(),
    )
    return task ? task.title : ''
  }

  return (
    <div className="w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-md relative pb-4">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <MdArrowCircleLeft size={30} />
            <span className="sr-only">Previous month</span>
          </button>

          <Button
            onClick={handleTodayClick}
            className="ml-4"
            color={'gray'}
            outline
          >
            <MdToday className="mr-1 mt-1" />
            Today
          </Button>
        </div>

        <h2 className="text-lg font-bold text-center flex-grow">
          {format(currentDate, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center space-x-2 sm:space-x-4 ml-auto mr-4">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            >
              Months <MdArrowDropDown className="ml-1" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg shadow-lg z-10">
                {monthsList.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthJump(index)}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setCreateTaskModalOpen(true)} // Show the Create Task modal
            className="p-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Add Event
          </button>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <MdArrowCircleRight size={30} />
          <span className="sr-only">Next month</span>
        </button>
      </header>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4 text-center text-xs sm:text-sm font-medium mt-4 mx-2 sm:mx-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
          <div key={day} className="py-2 text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isSelected = selectedDate?.toDateString() === day.toDateString()
          const taskTitle = getTaskTitle(day)
          const isPastTask = isPast(day)

          return (
            <button
              key={day.toString()}
              onClick={() => handleDateChange(day)}
              className={`relative flex items-center justify-center text-lg ${
                isCurrentMonth
                  ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'text-gray-400 dark:text-gray-500'
              } ${
                isSelected
                  ? 'border-2 border-blue-500 dark:border-blue-400'
                  : ''
              } rounded-lg transition-all duration-200 ease-in-out`}
              style={{ minHeight: '100px' }}
            >
              <span>{format(day, 'd')}</span>
              {taskTitle && (
                <div
                  className={`absolute bottom-2 left-2 right-2 text-xs font-medium rounded-lg p-1 truncate ${
                    isPastTask && !isToday(day)
                      ? 'bg-blue-500 text-white border border-blue-500 bg-[repeating-linear-gradient(45deg,_transparent,_transparent_5px,_rgba(255,255,255,0.3)_5px,_rgba(255,255,255,0.3)_12px)]'
                      : 'bg-blue-500 text-white'
                  }`}
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
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onSave={handleAddTask}
      />
    </div>
  )
}

export default CalendarComponent
