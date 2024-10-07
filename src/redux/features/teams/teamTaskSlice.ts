import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getTeamTasks,
  createTeamTask,
  updateTeamTask,
  deleteTeamTask,
} from '../../../api/teamTaskApi'
import {
  TeamTaskFromApi,
  TeamTask,
  TaskStatus,
  TaskPriority,
} from '../../../types/Task'

// TeamTaskState interface
interface TeamTaskState {
  tasks: { [key in TaskStatus]: TeamTask[] } // Grouped by status: todo, in-progress, etc.
  loading: boolean
  error: string | null
}

const initialState: TeamTaskState = {
  tasks: {
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  },
  loading: false,
  error: null,
}

// Helper function to map TeamTaskFromApi to TeamTask
const mapApiToTeamTask = (task: TeamTaskFromApi): TeamTask => ({
  ...task,
  dueDate: new Date(task.dueDate), // Convert dueDate to Date object
  status: task.status as TaskStatus, // Ensure correct status type
  priority: task.priority as TaskPriority, // Ensure correct priority type
})

// Thunk to fetch team tasks by teamId
export const fetchTeamTasks = createAsyncThunk(
  'teamTasks/fetchTeamTasks',
  async (teamId: string) => {
    const tasks = await getTeamTasks(teamId)
    return tasks.map(mapApiToTeamTask) // Convert tasks from API format
  },
)

// Thunk to create a new team task
export const createTeamTaskThunk = createAsyncThunk(
  'teamTasks/createTeamTask',
  async ({ teamId, data }: { teamId: string; data: Partial<TeamTask> }) => {
    // Ensure that required fields (title, status, priority) are defined
    if (!data.title || !data.status || !data.priority) {
      throw new Error('Missing required fields: title, status, or priority')
    }

    // Convert dueDate to ISO string if present
    const taskData = {
      title: data.title,
      status: data.status,
      priority: data.priority,
      description: data.description || '', // Provide a default description if not present
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
      assigneeIds: data.assigneeIds || [],
    }

    const task = await createTeamTask(teamId, taskData)
    return mapApiToTeamTask(task) // Convert task from API format
  },
)

// Thunk to update a team task
export const updateTeamTaskThunk = createAsyncThunk(
  'teamTasks/updateTeamTask',
  async (params: {
    teamId: string
    taskId: string
    data: Partial<TeamTask>
  }) => {
    const { teamId, taskId, data } = params

    // Ensure that required fields (title, status, priority) are handled
    if (
      data.title === undefined ||
      data.status === undefined ||
      data.priority === undefined
    ) {
      throw new Error('Cannot update task: missing title, status, or priority')
    }

    // Convert dueDate to ISO string if present
    const taskData = {
      title: data.title,
      status: data.status,
      priority: data.priority,
      description: data.description || '', // Provide default value
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
      assigneeIds: data.assigneeIds || [],
    }

    const updatedTask = await updateTeamTask(teamId, taskId, taskData)
    return mapApiToTeamTask(updatedTask) // Convert updated task from API format
  },
)

// Thunk to delete a team task
export const deleteTeamTaskThunk = createAsyncThunk(
  'teamTasks/deleteTeamTask',
  async ({ teamId, taskId }: { teamId: string; taskId: string }) => {
    await deleteTeamTask(teamId, taskId)
    return taskId
  },
)

const teamTaskSlice = createSlice({
  name: 'teamTasks',
  initialState,
  reducers: {
    // Move task locally within the team
    moveTeamTaskLocally: (state, action) => {
      const { taskId, oldStatus, newStatus } = action.payload

      // Ensure the status keys are valid TaskStatus enums
      const taskToMove = state.tasks[oldStatus as TaskStatus].find(
        (task) => task.id === taskId,
      )

      if (taskToMove) {
        // Remove from the old status
        state.tasks[oldStatus as TaskStatus] = state.tasks[
          oldStatus as TaskStatus
        ].filter((task) => task.id !== taskId)

        // Add to the new status
        state.tasks[newStatus as TaskStatus].push({
          ...taskToMove,
          status: newStatus,
        })
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching team tasks
      .addCase(fetchTeamTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeamTasks.fulfilled, (state, action) => {
        const tasksByStatus: { [key in TaskStatus]: TeamTask[] } = {
          todo: [],
          'in-progress': [],
          review: [],
          done: [],
        }

        // Group tasks by status
        action.payload.forEach((task: TeamTask) => {
          tasksByStatus[task.status].push(task)
        })

        state.tasks = tasksByStatus
        state.loading = false
      })
      .addCase(fetchTeamTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error fetching team tasks'
      })

      // Handle creating a new team task
      .addCase(createTeamTaskThunk.fulfilled, (state, action) => {
        const newTask = action.payload
        state.tasks[newTask.status].push(newTask)
      })

      // Handle updating a team task
      .addCase(updateTeamTaskThunk.fulfilled, (state, action) => {
        const updatedTask = action.payload
        const oldStatus = updatedTask.status
        const newStatus = updatedTask.status

        for (const [status, taskList] of Object.entries(state.tasks)) {
          const taskIndex = taskList.findIndex(
            (task) => task.id === updatedTask.id,
          )

          if (taskIndex !== -1) {
            if (oldStatus !== newStatus) {
              state.tasks[status as TaskStatus] = taskList.filter(
                (task) => task.id !== updatedTask.id,
              )
              state.tasks[newStatus].push(updatedTask)
            } else {
              state.tasks[status as TaskStatus][taskIndex] = updatedTask
            }
            break
          }
        }
      })

      // Handle deleting a team task
      .addCase(deleteTeamTaskThunk.fulfilled, (state, action) => {
        const taskId = action.payload

        Object.keys(state.tasks).forEach((status) => {
          state.tasks[status as TaskStatus] = state.tasks[
            status as TaskStatus
          ].filter((task) => task.id !== taskId)
        })
      })
  },
})

export const { moveTeamTaskLocally } = teamTaskSlice.actions
export default teamTaskSlice.reducer
