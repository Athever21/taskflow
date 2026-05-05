import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAuthStore } from './stores/authStore'
import { LoginPage } from './pages/LoginPage'
import { BoardPage } from './pages/BoardPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry on 401/403/404 — those are not transient errors
      retry: (failureCount, error: any) => {
        const status = error?.response?.status
        if ([401, 403, 404].includes(status)) return false
        return failureCount < 2
      },
      staleTime: 1000 * 30, // data is fresh for 30s — won't refetch on every mount
    },
  },
})

// Simple auth guard — redirect to /login if not authenticated
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const { init } = useAuthStore()

  useEffect(() => {
    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <BoardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}