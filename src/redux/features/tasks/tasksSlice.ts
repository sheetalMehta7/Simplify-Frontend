import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../../api/taskApi'

// Task interface
export interface Task {
  assignee: string
  id: string
  title: string
  assigneeIds: string[]
  description: string
  dueDate: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'normal' | 'high'
  userId: string
  teamId?: string
}

// TasksState interface
interface TasksState {
  personalTasks: { [key: string]: Task[] }
  teamTasks: { [key: string]: Task[] }
  loading: boolean
  error: string | null
}

const initialState: TasksState = {
  personalTasks: {
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  },
  teamTasks: {
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  },
  loading: false,
  error: null,
}

// Thunk to fetch tasks (both personal and team)
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const tasks = await getAllTasks()
  const tasksByStatus: TasksState = {
    personalTasks: {
      todo: [],
      'in-progress': [],
      review: [],
      done: [],
    },
    teamTasks: {
      todo: [],
      'in-progress': [],
      review: [],
      done: [],
    },
    loading: false,
    error: null,
  }

  tasks.forEach((task: Task) => {
    const taskStatus = task.status.toLowerCase()
    if (task.teamId) {
      if (tasksByStatus.teamTasks[taskStatus]) {
        tasksByStatus.teamTasks[taskStatus].push(task)
      } else {
        tasksByStatus.teamTasks['todo'].push(task) // Fallback to 'todo'
      }
    } else {
      if (tasksByStatus.personalTasks[taskStatus]) {
        tasksByStatus.personalTasks[taskStatus].push(task)
      } else {
        tasksByStatus.personalTasks['todo'].push(task) // Fallback to 'todo'
      }
    }
  })

  return tasksByStatus
})

// Thunk to create a new task (for personal or team tasks)
export const createNewTask = createAsyncThunk(
  'tasks/createTask',
  async (newTask: Partial<Task>) => {
    const task = await createTask(newTask)
    return task
  },
)

// Thunk to update an existing task
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
      const { taskId, oldStatus, newStatus, teamId } = action.payload
      const taskCategory = teamId ? state.teamTasks : state.personalTasks

      const taskToMove = taskCategory[oldStatus]?.find(
        (task) => task.id === taskId,
      )

      if (taskToMove) {
        // Remove from the old status
        taskCategory[oldStatus] = taskCategory[oldStatus].filter(
          (task) => task.id !== taskId,
        )

        // Ensure new status exists in taskCategory, otherwise fallback to 'todo'
        const statusToPush = taskCategory[newStatus] || taskCategory['todo']
        statusToPush.push({ ...taskToMove, status: newStatus })
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
        state.personalTasks = action.payload.personalTasks
        state.teamTasks = action.payload.teamTasks
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Error fetching tasks'
      })

      .addCase(createNewTask.fulfilled, (state, action) => {
        const newTask = action.payload
        const status = newTask.status.toLowerCase() || 'todo'

        if (newTask.teamId) {
          if (state.teamTasks[status]) {
            state.teamTasks[status].push(newTask)
          } else {
            state.teamTasks['todo'].push(newTask) // Fallback
          }
        } else {
          if (state.personalTasks[status]) {
            state.personalTasks[status].push(newTask)
          } else {
            state.personalTasks['todo'].push(newTask) // Fallback
          }
        }
      })

      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const updatedTask = action.payload
        const oldStatus = updatedTask.status.toLowerCase()
        const newStatus = updatedTask.status.toLowerCase()
        const taskCategory = updatedTask.teamId
          ? state.teamTasks
          : state.personalTasks

        for (const [status, taskList] of Object.entries(taskCategory)) {
          const taskIndex = taskList.findIndex((t) => t.id === updatedTask.id)

          if (taskIndex !== -1) {
            if (oldStatus !== newStatus) {
              taskCategory[status] = taskList.filter(
                (t) => t.id !== updatedTask.id,
              )
              if (taskCategory[newStatus]) {
                taskCategory[newStatus].push(updatedTask)
              } else {
                taskCategory['todo'].push(updatedTask) // Fallback to 'todo'
              }
            } else {
              taskCategory[status][taskIndex] = updatedTask
            }
            break
          }
        }
      })

      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        const taskId = action.payload

        Object.keys(state.personalTasks).forEach((status) => {
          state.personalTasks[status] = state.personalTasks[status].filter(
            (task) => task.id !== taskId,
          )
        })

        Object.keys(state.teamTasks).forEach((status) => {
          state.teamTasks[status] = state.teamTasks[status].filter(
            (task) => task.id !== taskId,
          )
        })
      })
  },
})

export const { moveTaskLocally } = tasksSlice.actions
export default tasksSlice.reducer
