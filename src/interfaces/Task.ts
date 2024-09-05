// src/types/Task.ts
export interface TaskFromApi {
  id: string
  title: string
  dueDate: string // Task from API will have date as a string
  description?: string
  assignee?: string
  priority?: string
  status?: string
}

export interface Task {
  id: string
  title: string
  dueDate: Date // In the UI, we want this as a Date object
  description?: string
  assignee?: string
  priority?: string
  status?: string
}
