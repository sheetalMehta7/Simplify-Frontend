import axiosInstance from '../helpers/axiosInstance'
import { Task } from '../redux/features/tasks/tasksSlice'

// Fetch all tasks for a user, with optional team filtering
export const getAllTasks = async (teamId?: string): Promise<Task[]> => {
  const params = teamId ? { teamId } : {} // Pass teamId as a query parameter if provided
  const response = await axiosInstance.get('/tasks', { params })
  return response.data
}

// Create a new task, including teamId and assignees
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response = await axiosInstance.post('/tasks', task)
  return response.data
}

// Update a task, allowing changes to assignee and team
export const updateTask = async (
  taskId: string,
  task: Partial<Task>,
): Promise<Task> => {
  const response = await axiosInstance.put(`/tasks/${taskId}`, task)
  return response.data
}

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  await axiosInstance.delete(`/tasks/${taskId}`)
}
