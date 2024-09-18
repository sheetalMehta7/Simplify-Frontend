import React, { useState } from 'react'
import { FaSearch, FaPlus, FaCalendarAlt, FaUserCircle } from 'react-icons/fa'

interface Project {
  id: number
  title: string
  status: string
  dueDate: string
  teamMembers: string[] // Could be an array of URLs or IDs to represent avatars
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Marketing Campaign Launch',
    status: 'In Progress',
    dueDate: '2024-09-30',
    teamMembers: [
      'https://via.placeholder.com/40',
      'https://via.placeholder.com/40',
    ],
  },
  {
    id: 2,
    title: 'Website Redesign Project',
    status: 'Completed',
    dueDate: '2024-08-20',
    teamMembers: ['https://via.placeholder.com/40'],
  },
  {
    id: 3,
    title: 'App Development Sprint 3',
    status: 'Overdue',
    dueDate: '2024-09-10',
    teamMembers: [
      'https://via.placeholder.com/40',
      'https://via.placeholder.com/40',
    ],
  },
]

const ProjectSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-green-100 text-green-700'
      case 'Completed':
        return 'bg-blue-100 text-blue-700'
      case 'Overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Projects
        </h1>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" />
          </div>
          {/* New Project Button */}
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">
            <FaPlus className="mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            {/* Top Section: Project Title */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.title.length > 50
                  ? `${project.title.slice(0, 50)}...`
                  : project.title}
              </h3>
              {/* Status Badge */}
              <span
                className={`px-2 py-1 text-sm font-bold rounded-full ${getStatusColor(
                  project.status,
                )}`}
              >
                {project.status}
              </span>
            </div>

            {/* Middle Section: Due Date */}
            <div className="flex justify-between items-center text-gray-500 dark:text-gray-300 mb-4">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>{new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Bottom Section: Team Members */}
            <div className="flex -space-x-2">
              {project.teamMembers.map((member, index) => (
                <img
                  key={index}
                  src={member}
                  alt={`Team member ${index + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow"
                />
              ))}
              {project.teamMembers.length > 5 && (
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 shadow">
                  +{project.teamMembers.length - 5}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectSection
