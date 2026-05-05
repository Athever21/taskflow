import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../api/tasks'
import type { Task, TaskStatus } from '../api/types'

export const taskKeys = {
  all: (projectId: number) => ['tasks', projectId] as const,
}

export function useTasks(projectId: number) {
  return useQuery({
    queryKey: taskKeys.all(projectId),
    queryFn: () => tasksApi.list(projectId),
    enabled: !!projectId, // don't run if no project is selected
  })
}

export function useCreateTask(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof tasksApi.create>[1]) =>
      tasksApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) })
    },
  })
}

export function useUpdateTask(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }: {
      taskId: number
      data: Parameters<typeof tasksApi.update>[1]
    }) => tasksApi.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) })
    },
  })
}

export function useDeleteTask(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tasksApi.delete,
    // Optimistic delete — remove from UI immediately, rollback if server fails
    onMutate: async (taskId: number) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all(projectId) })
      const previous = queryClient.getQueryData<Task[]>(taskKeys.all(projectId))

      queryClient.setQueryData<Task[]>(taskKeys.all(projectId), (old) =>
        old?.filter((t) => t.id !== taskId) ?? []
      )

      return { previous }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(taskKeys.all(projectId), context?.previous)
    },
  })
}

export function useReorderTask(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, status, position }: {
      taskId: number
      status: TaskStatus
      position: number
    }) => tasksApi.reorder(taskId, status, position),

    // Optimistic update — this is what makes drag-and-drop feel instant.
    // Update the cache immediately, then sync with server.
    // If server fails, roll back to previous state.
    onMutate: async ({ taskId, status, position }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all(projectId) })
      const previous = queryClient.getQueryData<Task[]>(taskKeys.all(projectId))

      queryClient.setQueryData<Task[]>(taskKeys.all(projectId), (old) =>
        old?.map((t) => t.id === taskId ? { ...t, status, position } : t) ?? []
      )

      return { previous }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(taskKeys.all(projectId), context?.previous)
    },
  })
}