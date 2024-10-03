import axiosInstance from '../helpers/axiosInstance'
import { TaskStatus, TaskPriority } from '../types/taskTypes'

// Fetch all tasks for a specific team
export const getTeamTasks = async (teamId: string) => {
  const response = await axiosInstance.get(`/team-tasks/${teamId}/tasks`)
  return response.data
}

// Create a new task for a specific team
export const createTeamTask = async (
  teamId: string,
  data: {
    title: string
    description?: string
    status: TaskStatus
    priority: TaskPriority
    dueDate?: string
    assigneeIds?: string[]
  },
) => {
  const response = await axiosInstance.post(`/team-tasks/${teamId}/tasks`, data)
  return response.data
}

// Update a team task by task ID
export const updateTeamTask = async (
  teamId: string,
  taskId: string,
  data: {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    dueDate?: string
    assigneeIds?: string[]
  },
) => {
  const response = await axiosInstance.put(
    `/team-tasks/${teamId}/tasks/${taskId}`,
    data,
  )
  return response.data
}

// Delete a team task by task ID
export const deleteTeamTask = async (teamId: string, taskId: string) => {
  const response = await axiosInstance.delete(
    `/team-tasks/${teamId}/tasks/${taskId}`,
  )
  return response.data
}
