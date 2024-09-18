import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  createProject,
  updateProject,
} from '../../redux/features/projects/projectSlice'
import { Modal, TextInput, Button } from 'flowbite-react'
import { AppDispatch } from '../../redux/store'
import * as yup from 'yup'

// Validation schema using Yup
const projectSchema = yup.object().shape({
  title: yup.string().trim().required('Title is required'),
  description: yup.string().trim().required('Description is required'),
})

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  projectData?: {
    id?: string
    title: string
    description: string
  } // Optional project data for edit mode
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  mode,
  projectData,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{
    title?: string
    description?: string
  }>({})

  const [originalTitle, setOriginalTitle] = useState('')
  const [originalDescription, setOriginalDescription] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const ownerId = user?.id

  // Reset form values when the modal opens
  useEffect(() => {
    if (mode === 'edit' && projectData) {
      setTitle(projectData.title)
      setDescription(projectData.description)
      setOriginalTitle(projectData.title)
      setOriginalDescription(projectData.description)
    } else {
      setTitle('')
      setDescription('')
      setOriginalTitle('')
      setOriginalDescription('')
    }

    // Clear validation errors when the modal is closed or opened
    setErrors({})
  }, [mode, projectData, isOpen])

  // Handle form submission
  const handleSaveProject = async () => {
    try {
      await projectSchema.validate(
        { title, description },
        { abortEarly: false },
      )
      setErrors({})

      // Check if no changes were made in edit mode
      if (
        mode === 'edit' &&
        title === originalTitle &&
        description === originalDescription
      ) {
        console.log('No changes were made.')
        onClose()
        return
      }

      if (!ownerId) {
        console.error('User is not logged in or ownerId is missing')
        return
      }

      if (mode === 'create') {
        await dispatch(createProject({ title, description, ownerId })).unwrap()
      } else if (mode === 'edit' && projectData?.id) {
        await dispatch(
          updateProject({
            projectId: projectData.id,
            projectData: { title, description },
          }),
        ).unwrap()
      }
      onClose()
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const validationErrors = validationError.inner.reduce(
          (acc, curr) => {
            acc[curr.path as keyof typeof errors] = curr.message
            return acc
          },
          {} as typeof errors,
        )
        setErrors(validationErrors)
      }
    }
  }

  // Submit form on Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSaveProject()
    }
  }

  // Clear individual field errors when typing
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (errors.title) {
      setErrors((prevErrors) => ({ ...prevErrors, title: '' }))
    }
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    if (errors.description) {
      setErrors((prevErrors) => ({ ...prevErrors, description: '' }))
    }
  }

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        {mode === 'create' ? 'Create New Project' : 'Edit Project'}
      </Modal.Header>
      <Modal.Body onKeyDown={handleKeyDown}>
        <TextInput
          placeholder="Project Title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="mb-2"
          color={errors.title ? 'failure' : undefined}
          helperText={
            errors.title && <span className="text-red-500">{errors.title}</span>
          }
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className="mb-2"
          color={errors.description ? 'failure' : undefined}
          helperText={
            errors.description && (
              <span className="text-red-500">{errors.description}</span>
            )
          }
        />
      </Modal.Body>
      <Modal.Footer>
        <Button gradientDuoTone="purpleToBlue" onClick={handleSaveProject}>
          {mode === 'create' ? 'Create' : 'Save Changes'}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProjectModal
