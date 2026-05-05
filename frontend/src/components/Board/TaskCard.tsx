import clsx from 'clsx'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../api/types'

const priorityStyles = {
  low:    'bg-gray-800 text-gray-400 border border-gray-700',
  medium: 'bg-amber-950 text-amber-400 border border-amber-900',
  high:   'bg-red-950 text-red-400 border border-red-900',
}

interface Props {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={clsx(
        'bg-gray-800 rounded-lg p-3 border border-gray-700',
        'cursor-grab active:cursor-grabbing select-none',
        'hover:border-gray-600 hover:bg-gray-750 transition-colors',
        isDragging && 'opacity-40 scale-105'
      )}
    >
      <p className="text-sm font-medium text-gray-200 mb-2 leading-snug">
        {task.title}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={clsx('text-xs px-1.5 py-0.5 rounded font-medium', priorityStyles[task.priority])}>
          {task.priority}
        </span>

        {task.is_overdue && (
          <span className="text-xs text-red-400 font-medium">⏰ overdue</span>
        )}

        {task.due_date && !task.is_overdue && (
          <span className="text-xs text-gray-600">
            {new Date(task.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        )}

        {task.comments_count > 0 && (
          <span className="text-xs text-gray-600 ml-auto">💬 {task.comments_count}</span>
        )}
      </div>
    </div>
  )
}