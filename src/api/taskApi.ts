import axiosInstance from '../helpers/axiosInstance'
import { Task } from '../components/TaskBoard'

// Helper function to get the token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('authToken')
}

// Fetch all tasks for a user
export const getAllTasks = async (): Promise<Task[]> => {
  const token = getToken()
  const response = await axiosInstance.get('/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

// Create a new task
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const token = getToken()
  const response = await axiosInstance.post('/tasks', task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

// Update a task
export const updateTask = async (
  taskId: string,
  task: Partial<Task>,
): Promise<Task> => {
  const token = getToken()
  const response = await axiosInstance.put(`/tasks/${taskId}`, task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  const token = getToken()
  await axiosInstance.delete(`/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
