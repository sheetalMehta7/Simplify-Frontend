import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getTeamTasks,
  createTeamTask,
  updateTeamTask,
  deleteTeamTask,
} from '../../../api/teamTaskApi'
import { TeamTaskFromApi, TeamTask } from '../../../interfaces/Task'

// TeamTaskState interface
interface TeamTaskState {
  tasks: { [key: string]: TeamTask[] } // Grouped by status: todo, in-progress, etc.
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
    // Convert Date to ISO string if dueDate is provided
    const taskData = {
      ...data,
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined, // Ensure ISO string format
    }

    const task = await createTeamTask(teamId, taskData)
    return mapApiToTeamTask(task) // Convert task from API format
  },
)

// Thunk to update a team task
export const updateTeamTaskThunk = createAsyncThunk(
  'teamTasks/updateTeamTask',
  async ({
    teamId,
    taskId,
    data,
  }: {
    teamId: string
    taskId: string
    data: Partial<TeamTask>
  }) => {
    // Convert Date to ISO string if dueDate is provided
    const taskData = {
      ...data,
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined, // Ensure ISO string format
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

      // Find the task in the old status
      const taskToMove = state.tasks[oldStatus].find(
        (task) => task.id === taskId,
      )

      if (taskToMove) {
        // Remove from the old status
        state.tasks[oldStatus] = state.tasks[oldStatus].filter(
          (task) => task.id !== taskId,
        )

        // Add to the new status
        state.tasks[newStatus].push({ ...taskToMove, status: newStatus })
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeamTasks.fulfilled, (state, action) => {
        const tasksByStatus: { [key: string]: TeamTask[] } = {
          todo: [],
          'in-progress': [],
          review: [],
          done: [],
        }

        // Group tasks by status
        action.payload.forEach((task: TeamTask) => {
          tasksByStatus[task.status || 'todo'].push(task)
        })

        state.tasks = tasksByStatus
        state.loading = false
      })
      .addCase(fetchTeamTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error fetching team tasks'
      })
      .addCase(createTeamTaskThunk.fulfilled, (state, action) => {
        const newTask = action.payload
        const status = newTask.status || 'todo'
        state.tasks[status].push(newTask)
      })
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
              state.tasks[status] = taskList.filter(
                (task) => task.id !== updatedTask.id,
              )
              state.tasks[newStatus].push(updatedTask)
            } else {
              state.tasks[status][taskIndex] = updatedTask
            }
            break
          }
        }
      })
      .addCase(deleteTeamTaskThunk.fulfilled, (state, action) => {
        const taskId = action.payload

        Object.keys(state.tasks).forEach((status) => {
          state.tasks[status] = state.tasks[status].filter(
            (task) => task.id !== taskId,
          )
        })
      })
  },
})

export const { moveTeamTaskLocally } = teamTaskSlice.actions
export default teamTaskSlice.reducer
