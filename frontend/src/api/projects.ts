import { client } from './client'
import type { Project } from './types'

export const projectsApi = {
  list: async (): Promise<Project[]> => {
    const res = await client.get('/projects')
    return res.data.data
  },

  create: async (data: { name: string; description?: string; color?: string }): Promise<Project> => {
    const res = await client.post('/projects', data)
    return res.data.data
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/projects/${id}`)
  },
}