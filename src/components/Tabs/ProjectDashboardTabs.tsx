import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllProjects,
  deleteProject,
} from '../../redux/features/projects/projectSlice'
import { Button } from 'flowbite-react'
import { MdCreate, MdFilterList } from 'react-icons/md'
import ProjectCard from '../ProjectCard'
import FilterModal from '../Modals/FilterModal'
import ProjectModal from '../Modals/ProjectModal'
import { AppDispatch } from '../../redux/store'

const ProjectDashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Active Projects')
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [filters, setFilters] = useState<{ teamId: string; status: string }>({
    teamId: '',
    status: '',
  })

  const dispatch = useDispatch<AppDispatch>() // Use AppDispatch to type the dispatch
  const { projects, loading } = useSelector((state: any) => state.projects)

  useEffect(() => {
    dispatch(fetchAllProjects()) // Fetch all projects on component mount
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

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Tabs, Filter, and Create Project Buttons */}
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
          <div className="flex justify-between items-center">
            {/* Tab Buttons */}
            <TabButtons activeTab={activeTab} onTabClick={handleTabClick} />

            {/* Action Buttons: Filter and Create Project */}
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

          {/* Filter Modal */}
          {isFilterOpen && (
            <FilterModal
              isOpen={isFilterOpen}
              onClose={toggleFilter}
              onApply={applyFilters}
              filters={filters}
              onClearAll={clearFilters}
            />
          )}

          {/* Create/Update Project Modal */}
          <ProjectModal
            isOpen={isModalOpen}
            onClose={closeModal}
            mode={modalMode}
            projectData={currentProject} // Pre-fill the form for edit
          />
        </div>
      </div>

      {/* Display Projects based on active tab */}
      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <p className="text-gray-900 dark:text-gray-200 text-lg mb-4">
                No projects available. Please create a new project.
              </p>
              <Button
                onClick={openModal}
                gradientDuoTone="purpleToBlue"
                className="flex items-center justify-center h-10 text-sm font-medium px-4 py-2"
              >
                <MdCreate className="mr-2" /> Create New Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects
                .filter((project: any) => {
                  if (filters.teamId && project.teamId !== filters.teamId)
                    return false
                  if (filters.status && project.status !== filters.status)
                    return false
                  return true
                })
                .map((project: any) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={openEditModal}
                    onDelete={handleDelete} // Delete handler
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDashboardTabs

// TabButtons Component for switching tabs between Active and Archived Projects
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
