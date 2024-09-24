import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as projectApi from '../../../api/projectApi'

// Export the Project interface
export interface Project {
  archived: any
  team: any
  id: string
  title: string
  description?: string
  ownerId: string
  teamId?: string
  status?: string
}

// Define the shape of the state for projects
interface ProjectState {
  projects: Project[]
  project: Project | null
  loading: boolean
  error: string | null
}

const initialState: ProjectState = {
  projects: [],
  project: null,
  loading: false,
  error: null,
}

// Thunks for async actions

// Fetch all projects
export const fetchAllProjects = createAsyncThunk(
  'projects/fetchAll',
  async () => {
    const response = await projectApi.getAllProjects()
    return response
  },
)

// Fetch a project by ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (projectId: string) => {
    const response = await projectApi.getProjectById(projectId)
    return response
  },
)

// Create a new project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData: {
    title: string
    description?: string
    ownerId: string
    teamId?: string
  }) => {
    const response = await projectApi.createProject(projectData)
    return response
  },
)

// Update a project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({
    projectId,
    projectData,
  }: {
    projectId: string
    projectData: Partial<{
      title: string
      description?: string
      status?: string
      archived?: boolean // Add support for updating the archived field
    }>
  }) => {
    const response = await projectApi.updateProject(projectId, projectData)
    return response
  },
)

// Delete a project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (projectId: string) => {
    const response = await projectApi.deleteProject(projectId)
    return response
  },
)

// Project Slice
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.projects = action.payload
        state.loading = false
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch projects'
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.project = action.payload
        state.loading = false
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch project'
      })
      .addCase(createProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload)
        state.loading = false
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to create project'
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id,
        )
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        state.loading = false
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to update project'
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.meta.arg,
        )
        state.loading = false
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to delete project'
      })
  },
})

export default projectSlice.reducer
