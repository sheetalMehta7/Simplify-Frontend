import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css' // Import default styles
import moment from 'moment'
import { CalendarDrawer } from './CalendarDrawer' // Import the drawer component

interface Task {
  id: number
  title: string
  date: Date
  description?: string
}

interface CalendarProps {
  tasks: Task[]
}

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

const CalendarComponent: React.FC<CalendarProps> = ({ tasks }) => {
  const [value, setValue] = useState<Value>(new Date())

  // Handle date changes
  const handleDateChange = (newDate: Value) => {
    setValue(newDate)
  }

  // Helper function to get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => moment(task.date).isSame(moment(date), 'day'))
  }

  // Convert `value` to a single `Date` if it's an array
  const selectedDate = Array.isArray(value) ? value[0] : value

  return (
    <div className="flex min-h-screen bg-gray-900 text-white p-4">
      <div className="relative w-full md:w-2/3 mx-auto bg-gray-800 shadow-md rounded-lg p-4 flex-1">
        <div className="h-full flex flex-col">
          <Calendar
            onChange={handleDateChange}
            value={value}
            className="react-calendar flex-1"
          />
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Tasks for{' '}
              {selectedDate
                ? moment(selectedDate).format('MMMM D, YYYY')
                : 'Select a date'}
            </h3>
            {selectedDate && getTasksForDate(selectedDate).length > 0 ? (
              <ul>
                {getTasksForDate(selectedDate).map((task) => (
                  <li
                    key={task.id}
                    className="border p-2 mb-2 rounded-md bg-gray-700 text-white cursor-pointer hover:bg-slate-700"
                  >
                    {task.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white">No tasks for this day.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarComponent
