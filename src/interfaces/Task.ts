export interface TeamTaskFromApi {
  id: string
  title: string
  dueDate: string
  description?: string
  assigneeIds: string[]
  priority?: string
  status?: string
  teamId: string
}

export interface TeamTask {
  id: string
  title: string
  dueDate: Date
  description?: string
  assigneeIds: string[]
  priority?: string
  status?: string
  teamId: string
}

export interface Team {
  id: string
  name: string
  description?: string
}
