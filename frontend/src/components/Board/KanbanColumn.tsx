import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import clsx from 'clsx'
import { TaskCard } from './TaskCard'
import type { Task, TaskStatus } from '../../api/types'

const columnConfig: Record<TaskStatus, { label: string; accent: string }> = {
  todo:        { label: 'To Do',       accent: 'text-gray-400 bg-gray-800 border-gray-700' },
  in_progress: { label: 'In Progress', accent: 'text-blue-400 bg-blue-950 border-blue-900' },
  done:        { label: 'Done',        accent: 'text-emerald-400 bg-emerald-950 border-emerald-900' },
  cancelled:   { label: 'Cancelled',   accent: 'text-gray-600 bg-gray-800 border-gray-700' },
}

interface Props {
  status: TaskStatus
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus, title: string) => void
}

export function KanbanColumn({ status, tasks, onTaskClick, onAddTask }: Props) {
  const { label, accent } = columnConfig[status]
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const { setNodeRef, isOver } = useDroppable({ id: status })

  const handleAdd = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    onAddTask(status, newTitle.trim())
    setNewTitle('')
    setIsAdding(false)
  }

  const sortedTasks = [...tasks].sort((a, b) => a.position - b.position)

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      <div className="flex items-center gap-2 mb-3">
        <span className={clsx('text-xs font-semibold px-2 py-1 rounded-full border', accent)}>
          {label}
        </span>
        <span className="text-xs text-gray-600">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 rounded-xl p-2 min-h-24 transition-colors',
          isOver ? 'bg-indigo-950 ring-1 ring-indigo-700' : 'bg-gray-900'
        )}
      >
        <SortableContext
          items={sortedTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))}
          </div>
        </SortableContext>

        {isAdding ? (
          <form onSubmit={handleAdd} className="mt-2">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setIsAdding(false)}
              placeholder="Task title..."
              className="w-full text-sm bg-gray-800 border border-gray-600 text-gray-100 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600"
            />
            <div className="flex gap-2 mt-1.5">
              <button type="submit" className="flex-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 transition-colors">
                Add
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg py-1.5 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 w-full text-left text-xs text-gray-700 hover:text-gray-400 px-2 py-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          >
            + Add task
          </button>
        )}
      </div>
    </div>
  )
}