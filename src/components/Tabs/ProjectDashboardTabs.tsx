import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllProjects,
  updateProject,
  deleteProject,
} from '../../redux/features/projects/projectSlice'
import { Button } from 'flowbite-react'
import { MdCreate, MdFilterList } from 'react-icons/md'
import ProjectCard from '../Projects/ProjectCard'
import FilterModal from '../Modals/FilterModal'
import ProjectModal from '../Modals/ProjectModal'
import SkeletonCard from '../Loader/SkeletonCard'
import { AppDispatch } from '../../redux/store'

const ProjectDashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Active Projects')
  const [loading, setLoading] = useState<boolean>(false)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [filters, setFilters] = useState<{ teamId: string; status: string }>({
    teamId: '',
    status: '',
  })

  const dispatch = useDispatch<AppDispatch>()
  const { projects } = useSelector((state: any) => state.projects)

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      await dispatch(fetchAllProjects())
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
    loadTasks()
  }, [dispatch])

  const handleTabClick = (tabName: string) => setActiveTab(tabName)

  const openModal = () => {
    setModalMode('create')
    setCurrentProject(null)
    setIsModalOpen(true)
  }

  const openEditModal = (project: any) => {
    setModalMode('edit')
    setCurrentProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)
  const toggleFilter = () => setIsFilterOpen((prev) => !prev)

  const applyFilters = (filterValues: { teamId: string; status: string }) => {
    setFilters(filterValues)
  }

  const clearFilters = () => {
    setFilters({ teamId: '', status: '' })
  }

  const handleDelete = async (projectId: string) => {
    try {
      await dispatch(deleteProject(projectId)).unwrap()
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleArchive = async (
    projectId: string,
    currentArchivedStatus: boolean,
  ) => {
    try {
      await dispatch(
        updateProject({
          projectId,
          projectData: { archived: !currentArchivedStatus },
        }),
      ).unwrap()
    } catch (error) {
      console.error(
        `Failed to ${currentArchivedStatus ? 'unarchive' : 'archive'} project`,
        error,
      )
    }
  }

  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))
  }

  // Apply Filters to Projects
  const filteredProjects = projects.filter((project: any) => {
    // Filter based on activeTab
    if (activeTab === 'Active Projects' && project.archived) return false
    if (activeTab === 'Archived Projects' && !project.archived) return false

    // Apply additional filters
    if (filters.teamId && project.teamId !== filters.teamId) return false
    if (filters.status && project.status !== filters.status) return false

    return true
  })

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
          <div className="flex justify-between items-center">
            <TabButtons activeTab={activeTab} onTabClick={handleTabClick} />

            <div className="flex space-x-2 items-center">
              <Button
                onClick={toggleFilter}
                color="gray"
                className="flex items-center justify-center h-10 text-sm font-medium px-4 py-2"
              >
                <MdFilterList className="mr-2 mt-0.5" /> Filter
              </Button>
              <Button
                onClick={openModal}
                gradientDuoTone="purpleToBlue"
                className="flex items-center justify-center h-10 text-sm font-medium px-4 py-2"
              >
                <MdCreate className="mr-2 mt-0.5" /> Create Project
              </Button>
            </div>
          </div>

          {isFilterOpen && (
            <FilterModal
              isOpen={isFilterOpen}
              onClose={toggleFilter}
              onApply={applyFilters}
              filters={filters}
              onClearAll={clearFilters}
            />
          )}

          <ProjectModal
            isOpen={isModalOpen}
            onClose={closeModal}
            mode={modalMode}
            projectData={currentProject}
          />
        </div>
      </div>

      {/* Projects Section */}
      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {/* Display Project Count */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              {activeTab} ({filteredProjects.length})
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderSkeletons(filteredProjects.length)}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProjects.map((project: any) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onArchive={() => handleArchive(project.id, project.archived)}
                  onUnarchive={() =>
                    handleArchive(project.id, project.archived)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No projects found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDashboardTabs

// TabButtons Component
const TabButtons: React.FC<{
  activeTab: string
  onTabClick: (tabName: string) => void
}> = ({ activeTab, onTabClick }) => {
  const tabs = ['Active Projects', 'Archived Projects']

  return (
    <div className="flex space-x-2 md:space-x-4 items-center">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`flex items-center justify-center w-40 h-10 rounded-md transition-all duration-300 text-sm font-medium ${
            tab === activeTab
              ? 'text-white bg-blue-500'
              : 'text-gray-900 dark:text-gray-200 hover:bg-blue-500 hover:text-white'
          }`}
          onClick={() => onTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
