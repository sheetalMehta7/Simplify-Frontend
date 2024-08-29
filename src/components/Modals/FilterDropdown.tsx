import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { Modal, Button, TextInput, Select, Label } from 'flowbite-react'
import { MdPerson, MdDateRange, MdLabel } from 'react-icons/md'

interface FilterDropdownProps {
  isOpen: boolean
  onClose: () => void
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ isOpen, onClose }) => {
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
      console.log('Filter Values:', values)
      onClose()
    },
  })

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

          <div className="flex justify-end space-x-4 mt-4">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue" type="submit">
              Apply Filters
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default FilterDropdown
