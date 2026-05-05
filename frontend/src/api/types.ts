// These mirror exactly what the Laravel Resources return.
// Keeping them in one file means if the API shape changes,
// you fix it in one place and TypeScript will tell you everywhere it breaks.

export interface User {
  id: number
  name: string
  email: string
}

export interface Project {
  id: number
  name: string
  description: string | null
  color: string
  tasks_count: number
  created_at: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  position: number
  due_date: string | null
  is_overdue: boolean
  comments_count: number
  project_id: number
  created_at: string
}

export interface Comment {
  id: number
  body: string
  created_at: string
  user: {
    id: number
    name: string
  }
}

// API response wrappers — Laravel Resources wrap collections in { data: [] }
export interface PaginatedResponse<T> {
  data: T[]
}