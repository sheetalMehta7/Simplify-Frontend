import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { MdClose } from 'react-icons/md'

interface FilterDropdownProps {
  isOpen: boolean
  closeDropdown: () => void
  filterButtonRef: React.RefObject<HTMLButtonElement>
}

const validationSchema = Yup.object({
  date: Yup.date()
    .nullable()
    .typeError('Invalid date')
    .test('not-in-past', 'Date cannot be in the past', (value) => {
      if (value) {
        return moment(value).isSameOrAfter(moment(), 'day')
      }
      return true
    }),
  assignee: Yup.string().optional(),
  status: Yup.string().optional(),
})

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  closeDropdown,
  filterButtonRef,
}) => {
  if (!isOpen || !filterButtonRef.current) return null

  const formik = useFormik({
    initialValues: {
      date: '',
      assignee: '',
      status: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Filter Values:', values)
      closeDropdown() // Close dropdown after filtering
    },
  })

  return (
    <div className="fixed bg-slate-800 text-white border border-gray-300 rounded-md shadow-md p-4 z-10">
      <button
        className="absolute top-2 right-2 text-white text-2xl"
        onClick={closeDropdown}
      >
        <MdClose />
      </button>
      <h2 className="text-xl font-bold mb-4">Filter Options</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium">Filter by Date</label>
          <input
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`mt-1 block w-full bg-slate-600 border border-gray-300 rounded-md shadow-sm text-white ${
              formik.touched.date && formik.errors.date ? 'border-red-500' : ''
            }`}
          />
          {formik.touched.date && formik.errors.date && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.date}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">
            Filter by Assignee
          </label>
          <input
            type="text"
            name="assignee"
            value={formik.values.assignee}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter assignee name"
            className="mt-1 block w-full bg-slate-600 border border-gray-300 rounded-md shadow-sm text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Filter by Status</label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full bg-slate-600 border border-gray-300 rounded-md shadow-sm text-white"
          >
            <option value="">Select status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  )
}
