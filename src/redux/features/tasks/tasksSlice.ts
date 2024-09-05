import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../../api/taskApi'

export interface Task {
  id: string
  title: string
  assignee: string // Assignee field
  dueDate: string
  status: string
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

// Thunk to create a new task, automatically assigning the current user as the assignee
export const createNewTask = createAsyncThunk(
  'tasks/createTask',
  async (newTask: Partial<Task>, { getState }) => {
    const state = getState() as RootState
    const currentUser = state.auth.user

    if (!currentUser) {
      throw new Error('User is not logged in.')
    }

    // Set the assignee to the current user's name or ID
    const taskWithAssignee = {
      ...newTask,
      assignee: currentUser.name, // Set the assignee to the current user's name
      userId: currentUser.id, // Optionally store the user ID as well
    }

    const task = await createTask(taskWithAssignee)
    return task
  },
)

// Thunk to update a task's status
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }: { taskId: string; status: string }) => {
    await updateTask(taskId, { status })
    return { taskId, status }
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

// Task slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
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
        state.error = action.error.message || 'Error fetching tasks'
      })
      .addCase(createNewTask.fulfilled, (state, action) => {
        const newTask = action.payload
        const status = newTask.status || 'todo' // Default to "todo" if status is undefined

        if (!state.tasks[status]) {
          state.tasks[status] = [] // Ensure the status array exists
        }

        state.tasks[status].push(newTask) // Add the task to the appropriate column based on its status
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, status } = action.payload
        let task: Task | undefined

        // Find the task across all statuses
        for (const [key, taskList] of Object.entries(state.tasks)) {
          task = taskList.find((t) => t.id === taskId)
          if (task) {
            // Remove from old status
            state.tasks[key] = taskList.filter((t) => t.id !== taskId)
            break
          }
        }

        if (task) {
          // Update the task's status and move it to the new status
          task.status = status
          state.tasks[status].push(task)
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

export default tasksSlice.reducer
