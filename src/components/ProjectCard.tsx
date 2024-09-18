import React, { useState, useRef, useEffect } from 'react'
import { FaEllipsisV, FaEdit, FaTrash, FaProjectDiagram } from 'react-icons/fa'
import { Button, Modal, TextInput } from 'flowbite-react'
import { Project } from '../redux/features/projects/projectSlice'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(project.title)
  const [editDescription, setEditDescription] = useState(
    project.description || '',
  )
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const openEditModal = () => {
    setIsEditModalOpen(true)
    setMenuOpen(false)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleSaveEdit = () => {
    onEdit({
      ...project,
      title: editTitle,
      description: editDescription,
    })
    closeEditModal()
  }

  const handleDelete = () => {
    setIsDeleteAlertOpen(true)
    setMenuOpen(false)
  }

  const confirmDelete = () => {
    onDelete(project.id)
    setIsDeleteAlertOpen(false)
  }

  const cancelDelete = () => {
    setIsDeleteAlertOpen(false)
  }

  const truncateTitle = (title: string) => {
    return title.length > 50 ? title.substring(0, 50) + '...' : title
  }

  return (
    <div className="relative p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md text-gray-900 dark:text-white">
      {/* Project Icon in the top-left corner */}
      <div className="absolute top-4 left-4">
        <FaProjectDiagram className="text-blue-500" size={28} />
      </div>

      {/* Three-dot Menu */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
        >
          <FaEllipsisV className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
            <ul className="py-1">
              <li>
                <button
                  onClick={openEditModal}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Content with proper padding */}
      <div className="ml-12 mt-8">
        <h2 className="text-xl font-semibold mb-2">
          {truncateTitle(project.title)}
        </h2>
        <p className="text-gray-500 dark:text-gray-300 mb-1">
          {project.description || 'No description'}
        </p>
        <p className="text-sm text-gray-400 mb-1">
          Status: {project.status || 'No status'}
        </p>
        {project.team && (
          <p className="text-sm text-gray-400">Team: {project.team.name}</p>
        )}
      </div>

      {/* Edit Modal */}
      <Modal show={isEditModalOpen} onClose={closeEditModal} size="lg">
        <Modal.Header>Edit Project</Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder="Project Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="mb-4"
          />
          <TextInput
            placeholder="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="purpleToBlue" onClick={handleSaveEdit}>
            Save Changes
          </Button>
          <Button color="gray" onClick={closeEditModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      {isDeleteAlertOpen && (
        <Modal show={isDeleteAlertOpen} onClose={cancelDelete} size="md">
          <Modal.Header>Confirm Deletion</Modal.Header>
          <Modal.Body>
            <p className="text-gray-900 dark:text-white">
              Are you sure you want to delete this project?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="red" onClick={confirmDelete}>
              Yes, Delete
            </Button>
            <Button color="gray" onClick={cancelDelete}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  )
}

export default ProjectCard
