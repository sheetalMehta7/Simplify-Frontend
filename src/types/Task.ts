// src/types/Task.ts
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface TeamTask {
  id: string
  title: string
  description?: string
  dueDate: Date // This should be a Date type
  status: TaskStatus // Enforced enum for status
  priority: TaskPriority // Enforced enum for priority
  assigneeIds?: string[]
  teamId?: string
}

export interface TeamTaskFromApi {
  id: string
  title: string
  description?: string
  dueDate: string // This comes from the API as a string
  status: string
  priority: string
  assigneeIds?: string[]
  teamId?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate: Date
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  assigneeIds?: string[]
  teamId?: string
}
