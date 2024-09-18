import axiosInstance from '../helpers/axiosInstance'

// Define types for task payloads and structure
export interface TaskPayload {
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'normal' | 'high'
  dueDate?: string // Date in ISO format
  assigneeIds?: string[] // List of user IDs assigned to the task
  teamId?: string // Optional team ID for team tasks
}

// Define task response type matching backend
export interface Task extends TaskPayload {
  id: string
  createdAt: string
  updatedAt: string
}

// Fetch all tasks for a user or team
export const getAllTasks = async (teamId?: string): Promise<Task[]> => {
  const params = teamId ? { teamId } : {}
  const response = await axiosInstance.get('/tasks', { params })
  return response.data
}

// Create a new task, either for personal use or team-based
export const createTask = async (task: Partial<TaskPayload>): Promise<Task> => {
  const response = await axiosInstance.post('/tasks', task)
  return response.data
}

// Update an existing task, allowing changes to assignees or team
export const updateTask = async (
  taskId: string,
  task: Partial<TaskPayload>,
): Promise<Task> => {
  const response = await axiosInstance.put(`/tasks/${taskId}`, task)
  return response.data
}

// Delete an existing task by task ID
export const deleteTask = async (taskId: string): Promise<void> => {
  await axiosInstance.delete(`/tasks/${taskId}`)
}
