import axiosInstance from '../helpers/axiosInstance' // Use your custom axios instance for API calls

// Create a new project
export const createProject = async (projectData: {
  title: string
  description?: string
  ownerId: string
  teamId?: string
}) => {
  const response = await axiosInstance.post('/projects', projectData)
  return response.data
}

// Get a project by ID
export const getProjectById = async (projectId: string) => {
  const response = await axiosInstance.get(`/projects/${projectId}`)
  return response.data
}

// Get all projects
export const getAllProjects = async () => {
  const response = await axiosInstance.get('/projects')
  return response.data
}

// Update a project
export const updateProject = async (
  projectId: string,
  projectData: Partial<{
    title: string
    description?: string
    status?: string
  }>,
) => {
  const response = await axiosInstance.put(
    `/projects/${projectId}`,
    projectData,
  )
  return response.data
}

// Delete a project
export const deleteProject = async (projectId: string) => {
  const response = await axiosInstance.delete(`/projects/${projectId}`)
  return response.data
}
