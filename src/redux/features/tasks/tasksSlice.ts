import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../../api/taskApi'

export interface Task {
  id: string
  title: string
  assignee: string
  description: string
  dueDate: string
  status: string
  priority: string // Added priority field
  userId: number
}

interface TasksState {
  tasks: { [key: string]: Task[] }
  loading: boolean
  error: string | null
}

const initialState: TasksState = {
  tasks: {
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  },
  loading: false,
  error: null,
}

// Thunk to fetch all tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const tasks = await getAllTasks()
  const tasksByStatus: TasksState['tasks'] = {
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  }

  tasks.forEach((task: Task) => {
    tasksByStatus[task.status].push(task)
  })

  return tasksByStatus
})

// Thunk to create a new task
export const createNewTask = createAsyncThunk(
  'tasks/createTask',
  async (newTask: Partial<Task>) => {
    const task = await createTask(newTask) // No userId in request
    return task
  },
)

// Thunk to update a task (including priority)
export const updateTaskThunk = createAsyncThunk(
  'tasks/updateTask',
  async (taskData: Partial<Task>) => {
    const { id: taskId, ...updatedFields } = taskData
    const updatedTask = await updateTask(taskId!, updatedFields)
    return updatedTask
  },
)

// Thunk to delete a task
export const deleteTaskThunk = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    await deleteTask(taskId)
    return taskId
  },
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    moveTaskLocally: (state, action) => {
      const { taskId, oldStatus, newStatus } = action.payload

      const taskToMove = state.tasks[oldStatus].find(
        (task) => task.id === taskId,
      )
      if (taskToMove) {
        // Remove task from old status
        state.tasks[oldStatus] = state.tasks[oldStatus].filter(
          (task) => task.id !== taskId,
        )
        // Add task to new status and preserve the priority field
        state.tasks[newStatus].push({ ...taskToMove, status: newStatus })
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Error fetching tasks'
      })
      .addCase(createNewTask.fulfilled, (state, action) => {
        const newTask = action.payload
        const status = newTask.status || 'todo'

        if (!state.tasks[status]) {
          state.tasks[status] = []
        }

        state.tasks[status].push(newTask)
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const updatedTask = action.payload
        const oldStatus = updatedTask.status
        const newStatus = updatedTask.status

        // Find and update the task across all statuses
        for (const [key, taskList] of Object.entries(state.tasks)) {
          const taskIndex = taskList.findIndex((t) => t.id === updatedTask.id)
          if (taskIndex !== -1) {
            // If the task's status has changed, move it to the new status array
            if (oldStatus !== newStatus) {
              state.tasks[key] = taskList.filter((t) => t.id !== updatedTask.id)
              state.tasks[newStatus].push(updatedTask)
            } else {
              // Otherwise, just update the task's fields including priority
              state.tasks[key][taskIndex] = updatedTask
            }
            break
          }
        }
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        const taskId = action.payload
        Object.keys(state.tasks).forEach((status) => {
          state.tasks[status] = state.tasks[status].filter(
            (task) => task.id !== taskId,
          )
        })
      })
  },
})

export const { moveTaskLocally } = tasksSlice.actions
export default tasksSlice.reducer
