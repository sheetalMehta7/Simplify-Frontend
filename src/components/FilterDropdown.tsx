import React from 'react'

interface FilterDropdownProps {
  isOpen: boolean
  closeDropdown: () => void
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  closeDropdown,
}) => {
  if (!isOpen) return null

  return (
    <div className="absolute right-80 top-3 mt-2 bg-slate-800 text-white border border-gray-300 rounded-md shadow-md p-4 z-10">
      <button
        className="absolute top-2 right-2 text-white text-2xl"
        onClick={closeDropdown}
      >
        &times;
      </button>
      <div className="mb-4">
        <label className="block text-sm font-medium">Filter by Date</label>
        <input
          type="date"
          className="mt-1 block w-full bg-slate-600 border border-gray-300 rounded-md shadow-sm text-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Filter by Assignee</label>
        <input
          type="text"
          placeholder="Enter assignee name"
          className="mt-1 block w-full bg-slate-600 border border-gray-300 rounded-md shadow-sm text-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Filter by Status</label>
        <select className="mt-1 block w-full bg-slate-600 border border-gray-300 rounded-md shadow-sm text-white">
          <option value="">Select status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  )
}
