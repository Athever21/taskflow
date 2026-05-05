import { client } from './client'
import type { Task, Comment, TaskStatus, TaskPriority } from './types'

export const tasksApi = {
  list: async (projectId: number): Promise<Task[]> => {
    const res = await client.get(`/projects/${projectId}/tasks`)
    return res.data.data
  },

  create: async (projectId: number, data: {
    title: string
    description?: string
    priority?: TaskPriority
    due_date?: string
    status?: TaskStatus
  }): Promise<Task> => {
    const res = await client.post(`/projects/${projectId}/tasks`, data)
    return res.data.data
  },

  update: async (taskId: number, data: Partial<{
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    due_date: string | null
  }>): Promise<Task> => {
    const res = await client.patch(`/tasks/${taskId}`, data)
    return res.data.data
  },

  reorder: async (taskId: number, status: TaskStatus, position: number): Promise<void> => {
    await client.patch(`/tasks/${taskId}/reorder`, { status, position })
  },

  delete: async (taskId: number): Promise<void> => {
    await client.delete(`/tasks/${taskId}`)
  },

  listComments: async (taskId: number): Promise<Comment[]> => {
    const res = await client.get(`/tasks/${taskId}/comments`)
    return res.data.data
  },

  addComment: async (taskId: number, body: string): Promise<Comment> => {
    const res = await client.post(`/tasks/${taskId}/comments`, { body })
    return res.data.data
  },
}