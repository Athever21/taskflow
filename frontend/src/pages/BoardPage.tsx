import { useState } from 'react'
import { Sidebar } from '../components/Layout/Sidebar'
import { KanbanBoard } from '../components/Board/KanbanBoard'
import { useAuthStore } from '../stores/authStore'

export function BoardPage() {
  const { user, logout } = useAuthStore()
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-5 flex-shrink-0">
          <span className="text-sm text-gray-500">
            {activeProjectId ? '' : 'Select a project to get started'}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{user?.name}</span>
            <button
              onClick={logout}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {activeProjectId ? (
            <KanbanBoard projectId={activeProjectId} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              <div className="text-center">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-lg font-medium text-gray-400">No project selected</p>
                <p className="text-sm mt-1 text-gray-600">Pick one from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}