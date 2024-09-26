import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { Modal, Button, TextInput, Select, Label } from 'flowbite-react'
import { MdPerson, MdDateRange, MdLabel, MdGroup } from 'react-icons/md'

interface FilterDropdownProps {
  isOpen: boolean
  onClose: () => void
  filters: { date: string; assignee: string; status: string; teamId: string }
  onApply: (filters: {
    date: string
    assignee: string
    status: string
    teamId: string
  }) => void
  onClearAll: () => void
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onClearAll,
}) => {
  const [animationClass, setAnimationClass] = useState('modal-fade-in')

  useEffect(() => {
    if (!isOpen) {
      setAnimationClass('modal-fade-out')
      const timer = setTimeout(() => {
        onClose()
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setAnimationClass('modal-fade-in')
    }
  }, [isOpen, onClose])

  const [showValidationMessage, setShowValidationMessage] = useState(false)

  const formik = useFormik({
    initialValues: {
      date: filters.date || '',
      assignee: filters.assignee || '',
      status: filters.status || '',
      teamId: filters.teamId || '',
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
      teamId: Yup.string().optional(),
    }),
    onSubmit: (values) => {
      const hasActiveFilters =
        !!values.date || !!values.assignee || !!values.status || !!values.teamId

      if (!hasActiveFilters) {
        setShowValidationMessage(true)
      } else {
        setShowValidationMessage(false)
        onApply(values)
      }
    },
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    formik.handleChange(e)
    setShowValidationMessage(false)
  }

  const hasActiveFilters =
    !!formik.values.date ||
    !!formik.values.assignee ||
    !!formik.values.status ||
    !!formik.values.teamId

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <div className={animationClass}>
        <Modal.Header className="bg-white dark:bg-gray-700 rounded-md">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
              Filter Options
            </h2>
          </div>
        </Modal.Header>
        <Modal.Body className="bg-white dark:bg-gray-700 rounded-md">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                color={
                  formik.touched.date && formik.errors.date ? 'failure' : ''
                }
                className="dark:bg-gray-700"
              />
              {formik.touched.date && formik.errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.date}
                </p>
              )}
            </div>

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
                onChange={handleInputChange}
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

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
                onChange={handleInputChange}
                className="dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select status</option>
                <option value="todo">To-Do</option>
                <option value="in-progress">In-Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </Select>
            </div>

            {!formik.values.teamId ||
              (formik.values.teamId === '' && (
                <div>
                  <Label
                    htmlFor="teamId"
                    value="Team"
                    className="text-gray-900 dark:text-gray-200"
                  />

                  <TextInput
                    id="teamId"
                    name="teamId"
                    icon={MdGroup}
                    value={formik.values.teamId}
                    onChange={handleInputChange}
                    placeholder="Enter team ID"
                    className="dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              ))}

            {showValidationMessage && (
              <div className="text-red-500 text-sm mt-2">
                Please select at least one filter before applying.
              </div>
            )}

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
                <Button gradientDuoTone="purpleToBlue" type="submit">
                  Apply Filters
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default FilterDropdown
