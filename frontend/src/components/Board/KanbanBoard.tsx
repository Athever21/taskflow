import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { useTasks, useCreateTask, useReorderTask } from '../../hooks/useTasks'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'
import { TaskModal } from './TaskModal'
import type { Task, TaskStatus } from '../../api/types'

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done', 'cancelled']

interface Props {
  projectId: number
}

export function KanbanBoard({ projectId }: Props) {
  const { data: tasks = [], isLoading } = useTasks(projectId)
  const createTask = useCreateTask(projectId)
  const reorderTask = useReorderTask(projectId)

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status)

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null)
    if (!over) return

    const task = tasks.find((t) => t.id === active.id)
    if (!task) return

    const overStatus = STATUSES.includes(over.id as TaskStatus)
      ? (over.id as TaskStatus)
      : tasks.find((t) => t.id === over.id)?.status

    if (!overStatus) return

    const columnTasks = tasksByStatus(overStatus).filter((t) => t.id !== task.id)
    const overIndex = columnTasks.findIndex((t) => t.id === over.id)
    const newPosition = overIndex === -1 ? columnTasks.length : overIndex

    reorderTask.mutate({ taskId: task.id, status: overStatus, position: newPosition })
  }

  const handleAddTask = async (status: TaskStatus, title: string) => {
    await createTask.mutateAsync({ title, status })
  }

  if (isLoading) {
    return (
      <div className="flex gap-5 p-6">
        {STATUSES.map((s) => (
          <div key={s} className="w-72 flex-shrink-0">
            <div className="h-6 w-24 bg-gray-800 rounded-full animate-pulse mb-3" />
            <div className="bg-gray-900 rounded-xl p-2 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 p-6 overflow-x-auto h-full">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus(status)}
              onTaskClick={setSelectedTask}
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-2 opacity-90">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          projectId={projectId}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  )
}