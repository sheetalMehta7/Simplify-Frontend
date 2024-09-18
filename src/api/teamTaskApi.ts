import axiosInstance from '../helpers/axiosInstance'
import { TaskStatus, TaskPriority } from '../types/taskTypes' // Assuming enums for status/priority are defined

// Fetch all tasks for a specific team
export const getTeamTasks = async (teamId: string) => {
  const response = await axiosInstance.get(`/teams/${teamId}/tasks`)
  return response.data
}

// Create a new task for a specific team
export const createTeamTask = async (
  teamId: string,
  data: {
    title: string
    description?: string
    status: TaskStatus // Using enum for TaskStatus
    priority: TaskPriority // Using enum for TaskPriority
    dueDate?: string
    assigneeIds?: string[] // Array of user IDs
  },
) => {
  const response = await axiosInstance.post(`/teams/${teamId}/tasks`, data)
  return response.data
}

// Update a team task by task ID
export const updateTeamTask = async (
  teamId: string,
  taskId: string,
  data: {
    title?: string
    description?: string
    status?: TaskStatus // Using enum for TaskStatus
    priority?: TaskPriority // Using enum for TaskPriority
    dueDate?: string
    assigneeIds?: string[] // Array of user IDs
  },
) => {
  const response = await axiosInstance.put(
    `/teams/${teamId}/tasks/${taskId}`,
    data,
  )
  return response.data
}

// Delete a team task by task ID
export const deleteTeamTask = async (teamId: string, taskId: string) => {
  const response = await axiosInstance.delete(
    `/teams/${teamId}/tasks/${taskId}`,
  )
  return response.data
}
