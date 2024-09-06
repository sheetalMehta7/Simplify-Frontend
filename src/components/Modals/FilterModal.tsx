import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { Modal, Button, TextInput, Select, Label } from 'flowbite-react'
import { MdPerson, MdDateRange, MdLabel, MdCancel } from 'react-icons/md'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: { date: string; assignee: string; status: string }) => void
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [activeFilters, setActiveFilters] = useState<{
    date: string
    assignee: string
    status: string
  }>({
    date: '',
    assignee: '',
    status: '',
  })

  const formik = useFormik({
    initialValues: {
      date: '',
      assignee: '',
      status: '',
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
      setActiveFilters(values)
      onApply(values) // Pass filter values back to parent
      onClose()
    },
  })

  const hasActiveFilters =
    activeFilters.date || activeFilters.assignee || activeFilters.status

  const removeFilter = (filterKey: keyof typeof activeFilters) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: '',
    }))
    formik.setFieldValue(filterKey, '') // Clear the corresponding formik field
  }

  const clearAllFilters = () => {
    setActiveFilters({
      date: '',
      assignee: '',
      status: '',
    })
    formik.resetForm() // Clear all fields
  }

  return (
    <Modal show={isOpen} onClose={onClose} size="lg" className="dark">
      <Modal.Header>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold">Filter Options</h2>
        </div>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date" value="Date" />
            <TextInput
              id="date"
              name="date"
              type="date"
              icon={MdDateRange}
              value={formik.values.date}
              onChange={formik.handleChange}
              color={formik.touched.date && formik.errors.date ? 'failure' : ''}
              placeholder="Select a date"
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.date}</p>
            )}
          </div>

          <div>
            <Label htmlFor="assignee" value="Assignee" />
            <TextInput
              id="assignee"
              name="assignee"
              icon={MdPerson}
              value={formik.values.assignee}
              onChange={formik.handleChange}
              placeholder="Enter assignee"
            />
          </div>

          <div>
            <Label htmlFor="status" value="Status" />
            <Select
              id="status"
              name="status"
              icon={MdLabel}
              value={formik.values.status}
              onChange={formik.handleChange}
            >
              <option value="">Select status</option>
              <option value="todo">To-Do</option>
              <option value="in-progress">In-Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </Select>
          </div>

          {/* Display active filters as tags */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap space-x-2">
              {activeFilters.date && (
                <FilterTag
                  label={`Date: ${activeFilters.date}`}
                  onRemove={() => removeFilter('date')}
                />
              )}
              {activeFilters.assignee && (
                <FilterTag
                  label={`Assignee: ${activeFilters.assignee}`}
                  onRemove={() => removeFilter('assignee')}
                />
              )}
              {activeFilters.status && (
                <FilterTag
                  label={`Status: ${activeFilters.status}`}
                  onRemove={() => removeFilter('status')}
                />
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-4">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>

            {hasActiveFilters ? (
              <Button color="red" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            ) : (
              <Button color="blue" type="submit">
                Apply Filters
              </Button>
            )}
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default FilterModal

// FilterTag Component for displaying active filters
const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({
  label,
  onRemove,
}) => (
  <div className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full m-1">
    <span className="mr-2">{label}</span>
    <button onClick={onRemove} className="text-red-500 hover:text-red-700">
      <MdCancel size={18} />
    </button>
  </div>
)
