import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  createProject,
  updateProject,
} from '../../redux/features/projects/projectSlice'
import { Modal, TextInput, Button } from 'flowbite-react'
import { AppDispatch } from '../../redux/store'

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
  const [errors, setErrors] = useState({ title: '', description: '' })

  // Retrieve the user object from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const ownerId = user?.id

  useEffect(() => {
    if (mode === 'edit' && projectData) {
      setTitle(projectData.title)
      setDescription(projectData.description)
    } else if (mode === 'create') {
      // Clear form on create mode
      setTitle('')
      setDescription('')
    }
  }, [mode, projectData])

  const validateForm = () => {
    const newErrors = { title: '', description: '' }

    if (!title.trim()) newErrors.title = 'Title is required'
    if (!description.trim()) newErrors.description = 'Description is required'

    setErrors(newErrors)

    return !newErrors.title && !newErrors.description
  }

  const handleSaveProject = async () => {
    if (!validateForm()) return

    if (!ownerId) {
      console.error('User is not logged in or ownerId is missing')
      return
    }

    try {
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
      onClose() // Close the modal after successful creation or update
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  // Submit form on Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSaveProject()
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
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
          color={errors.title ? 'failure' : undefined}
          helperText={
            errors.title && <span className="text-red-500">{errors.title}</span>
          }
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProjectModal
