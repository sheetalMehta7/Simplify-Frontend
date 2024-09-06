import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { Modal, Button, TextInput, Select, Label } from 'flowbite-react'
import { MdPerson, MdDateRange, MdLabel } from 'react-icons/md'

interface FilterDropdownProps {
  isOpen: boolean
  onClose: () => void
  filters: { date: string; assignee: string; status: string }
  onApply: (filters: { date: string; assignee: string; status: string }) => void
  onClearAll: () => void
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onClearAll,
}) => {
  const [showValidationMessage, setShowValidationMessage] = useState(false)

  const formik = useFormik({
    initialValues: {
      date: filters.date || '',
      assignee: filters.assignee || '',
      status: filters.status || '',
    },
    validationSchema: Yup.object({
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
    }),
    onSubmit: (values) => {
      const hasActiveFilters =
        !!values.date || !!values.assignee || !!values.status

      if (!hasActiveFilters) {
        setShowValidationMessage(true)
      } else {
        setShowValidationMessage(false)
        onApply(values) // Apply the filters
      }
    },
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    formik.handleChange(e)
    setShowValidationMessage(false) // Remove validation error when any input changes
  }

  const hasActiveFilters =
    !!formik.values.date || !!formik.values.assignee || !!formik.values.status

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header className="bg-white dark:bg-gray-700">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
            Filter Options
          </h2>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-white dark:bg-gray-700">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Date Filter */}
          <div>
            <Label
              htmlFor="date"
              value="Date"
              className="text-gray-900 dark:text-gray-200"
            />
            <TextInput
              id="date"
              name="date"
              type="date"
              icon={MdDateRange}
              value={formik.values.date}
              onChange={handleInputChange}
              color={formik.touched.date && formik.errors.date ? 'failure' : ''}
              placeholder="Select a date"
              className="dark:bg-gray-700  "
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.date}</p>
            )}
          </div>

          {/* Assignee Filter */}
          <div>
            <Label
              htmlFor="assignee"
              value="Assignee"
              className="text-gray-900 dark:text-gray-200"
            />
            <TextInput
              id="assignee"
              name="assignee"
              icon={MdPerson}
              value={formik.values.assignee}
              onChange={handleInputChange} // Handle change with validation reset
              placeholder="Enter assignee"
              className="dark:bg-gray-700 dark:text-gray-100 "
            />
          </div>

          {/* Status Filter */}
          <div>
            <Label
              htmlFor="status"
              value="Status"
              className="text-gray-900 dark:text-gray-200"
            />
            <Select
              id="status"
              name="status"
              icon={MdLabel}
              value={formik.values.status}
              onChange={handleInputChange} // Handle change with validation reset
              className="dark:bg-gray-700 dark:text-gray-100 "
            >
              <option value="">Select status</option>
              <option value="todo">To-Do</option>
              <option value="in-progress">In-Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </Select>
          </div>

          {/* Validation Message */}
          {showValidationMessage && (
            <div className="text-red-500 text-sm mt-2">
              Please select at least one filter before applying.
            </div>
          )}

          {/* Button Group */}
          <div className="flex justify-between space-x-4 mt-4">
            {hasActiveFilters && (
              <Button color="red" onClick={onClearAll}>
                Clear All Filters
              </Button>
            )}
            <div className="flex space-x-4 ml-auto">
              <Button color="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button color="blue" type="submit">
                Apply Filters
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default FilterDropdown
