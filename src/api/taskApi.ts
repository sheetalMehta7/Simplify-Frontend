import axiosInstance from '../helpers/axiosInstance'
import { Task } from '../redux/features/tasks/tasksSlice'

// Fetch all tasks for a user
export const getAllTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get('/tasks')
  return response.data
}

// Create a new task without userId
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response = await axiosInstance.post('/tasks', task)
  return response.data
}

// Update a task without userId
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
