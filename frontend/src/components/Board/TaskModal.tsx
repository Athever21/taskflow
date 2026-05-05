import { useState, useEffect } from 'react'
import clsx from 'clsx'
import type { Task, TaskStatus, TaskPriority, Comment } from '../../api/types'
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks'
import { tasksApi } from '../../api/tasks'

interface Props {
  task: Task
  projectId: number
  onClose: () => void
}

export function TaskModal({ task, projectId, onClose }: Props) {
  const updateTask = useUpdateTask(projectId)
  const deleteTask = useDeleteTask(projectId)

  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [dueDate, setDueDate] = useState(task.due_date || '')
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(true)

  useEffect(() => {
    tasksApi.listComments(task.id).then((data) => {
      setComments(data)
      setLoadingComments(false)
    })
  }, [task.id])

  const handleSave = async () => {
    await updateTask.mutateAsync({
      taskId: task.id,
      data: { title, description, status, priority, due_date: dueDate || null },
    })
    onClose()
  }

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return
    await deleteTask.mutateAsync(task.id)
    onClose()
  }

  const handleAddComment = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newComment.trim()) return
    const comment = await tasksApi.addComment(task.id, newComment)
    setComments((prev) => [comment, ...prev])
    setNewComment('')
  }

  const selectClass = "w-full text-sm bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-gray-900 border-l border-gray-800 h-full flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <span className={clsx(
            'text-xs font-medium px-2 py-1 rounded border',
            task.is_overdue
              ? 'bg-red-950 text-red-400 border-red-900'
              : 'bg-gray-800 text-gray-500 border-gray-700'
          )}>
            {task.is_overdue ? '⏰ Overdue' : task.created_at}
          </span>
          <div className="flex items-center gap-3">
            <button onClick={handleDelete} className="text-xs text-gray-600 hover:text-red-400 transition-colors">
              Delete
            </button>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-300 text-lg transition-colors">
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-semibold text-gray-100 bg-transparent outline-none border-b border-transparent focus:border-gray-700 pb-1 transition-colors"
          />

          {/* Status + Priority + Due date */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={selectClass}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={selectClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={selectClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Add a description..."
              className="w-full text-sm bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 resize-none placeholder-gray-600"
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={updateTask.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            {updateTask.isPending ? 'Saving...' : 'Save changes'}
          </button>

          {/* Comments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Comments</h3>

            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                placeholder="Write a comment..."
                className="w-full text-sm bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 resize-none placeholder-gray-600"
              />
              <button type="submit" className="mt-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                Comment
              </button>
            </form>

            {loadingComments ? (
              <div className="space-y-2">
                {[1, 2].map((i) => <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />)}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-xs text-gray-600">No comments yet.</p>
            ) : (
              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-300">{c.user.name}</span>
                      <span className="text-xs text-gray-600">{c.created_at}</span>
                    </div>
                    <p className="text-sm text-gray-400">{c.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}