import React, { useState, useRef, useEffect } from 'react'
import { FaEllipsisV, FaEdit, FaTrash, FaProjectDiagram } from 'react-icons/fa'
import { MdOutlineUnarchive, MdOutlineArchive } from 'react-icons/md'
import { Button, Modal } from 'flowbite-react'
import { Project } from '../../redux/features/projects/projectSlice'
import ProjectModal from '../Modals/ProjectModal'

interface ProjectCardProps {
  project: Project
  onDelete: (projectId: string) => void
  onEdit: (updatedProject: Project) => void
  onArchive: () => void
  onUnarchive: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onDelete,
  onArchive,
  onUnarchive,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Retrieve logged-in user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const loggedInUserId = user?.id

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
      <div className="absolute top-4 left-4">
        {project.archived ? (
          <MdOutlineUnarchive className="text-blue-500" size={24} />
        ) : (
          <FaProjectDiagram className="text-blue-500" size={24} />
        )}
      </div>

      {/* Three-dot menu is visible to all users */}
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
              {/* Show Edit and Delete options only for the owner */}
              {project.ownerId === loggedInUserId && (
                <>
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
                </>
              )}
              {project.archived ? (
                <li>
                  <button
                    onClick={onUnarchive}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MdOutlineUnarchive className="mr-2" />
                    Unarchive
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={onArchive}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MdOutlineArchive className="mr-2" />
                    Archive
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="ml-12 mt-8">
        <h2 className="text-lg font-semibold mb-2">
          {truncateTitle(project.title)}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
          {project.description ?? 'No description'}
        </p>
        <p className="text-xs text-gray-400 mb-1">
          Status: {project.status ?? 'No status'}
        </p>
        {project.team && (
          <p className="text-xs text-gray-400">Team: {project.team.name}</p>
        )}
      </div>

      {isEditModalOpen && (
        <ProjectModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          mode="edit"
          projectData={{
            id: project.id,
            title: project.title,
            description: project.description ?? '',
          }}
        />
      )}

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
