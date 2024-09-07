export interface TaskFromApi {
  id: string
  title: string
  dueDate: string
  description?: string
  assignee?: string
  priority?: string
  status?: string
}

export interface Task {
  id: string
  title: string
  dueDate: Date
  description?: string
  assignee?: string
  priority?: string
  status?: string
}
