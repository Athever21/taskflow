import { useState } from 'react'
import clsx from 'clsx'
import { useProjects, useCreateProject, useDeleteProject } from '../../hooks/useProjects'
import type { Project } from '../../api/types'

interface Props {
  activeProjectId: number | null
  onSelectProject: (id: number) => void
}

export function Sidebar({ activeProjectId, onSelectProject }: Props) {
  const { data: projects = [], isLoading } = useProjects()
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')

  const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return
    await createProject.mutateAsync({ name, color })
    setName('')
    setShowForm(false)
  }

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white tracking-tight">TaskFlow</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Projects
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-gray-600 hover:text-gray-300 text-xl leading-none transition-colors"
          >
            +
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-3 p-2.5 bg-gray-800 rounded-lg border border-gray-700">
            <input
              autoFocus
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded px-2 py-1.5 mb-2 outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-500"
            />
            <div className="flex items-center gap-2 mb-2.5">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs text-gray-500">Color</span>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createProject.isPending}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 rounded transition-colors"
              >
                {createProject.isPending ? '...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1.5 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-0.5">
            {projects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                isActive={project.id === activeProjectId}
                onSelect={() => onSelectProject(project.id)}
                onDelete={() => deleteProject.mutate(project.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}

function ProjectItem({ project, isActive, onSelect, onDelete }: {
  project: Project
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <li
      className={clsx(
        'flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm transition-colors',
        isActive
          ? 'bg-gray-700 text-gray-100'
          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
      )}
      onClick={onSelect}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: project.color }}
      />
      <span className="flex-1 truncate">{project.name}</span>
      <span className="text-xs text-gray-600">{project.tasks_count}</span>
      {showDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="text-gray-600 hover:text-red-400 text-xs transition-colors"
        >
          ✕
        </button>
      )}
    </li>
  )
}