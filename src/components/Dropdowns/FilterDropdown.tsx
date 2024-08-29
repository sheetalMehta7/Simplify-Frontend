import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { Modal, Button } from 'flowbite-react'
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
  anyField: Yup.string().test(
    'at-least-one',
    'Please select at least one filter option',
    function (_value, context) {
      const { date, assignee, status } = context.parent
      return date || assignee || status
    },
  ),
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
    <Modal
      show={isOpen}
      onClose={closeDropdown}
      className="z-50 bg-black bg-opacity-80"
    >
      <div className="relative p-6 bg-slate-800 text-white">
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={closeDropdown}
        >
          <MdClose />
        </button>
        <h2 className="text-xl font-bold mb-4">Filter Options</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="date" />
            <input
              type="date"
              id="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full bg-slate-700 border border-gray-600 rounded-md text-white ${
                formik.touched.date && formik.errors.date
                  ? 'border-red-500'
                  : ''
              }`}
            />
            {formik.touched.date && formik.errors.date && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.date}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="assignee" />
            <input
              type="text"
              id="assignee"
              name="assignee"
              value={formik.values.assignee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter assignee name"
              className="mt-1 block w-full bg-slate-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" />
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full bg-slate-700 border border-gray-600 rounded-md text-white"
            >
              <option value="">select status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {formik.errors.anyField && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.anyField}
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-4">
            <Button type="submit" color="blue">
              Apply Filters
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
