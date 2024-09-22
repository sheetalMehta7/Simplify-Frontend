import React from 'react'
import ProjectCard from './ProjectCard'

const ArchivedProjects: React.FC<{
  projects: any[]
  onEdit: (project: any) => void
  onUnarchive: (projectId: string) => void
}> = ({ projects, onEdit, onUnarchive }) => {
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-300 text-lg">
          No archived projects available.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={() => {}}
          onUnarchive={() => onUnarchive(project.id)}
        />
      ))}
    </div>
  )
}

export default ArchivedProjects
