import { create } from 'zustand'
import type { User } from '../api/types'
import { authApi } from '../api/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean   // true while we're checking /me on page load

  init: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,  // assume loading until init() resolves

  // Called once on app mount — checks if an existing session cookie is valid.
  // This is how the user stays logged in across page refreshes without localStorage.
  // If the cookie is valid, Laravel returns the user. If not, it returns 401
  // and the interceptor redirects to /login.
  init: async () => {
    console.log('dsadsa')
    try {
      const user = await authApi.me()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch(e: any) {
      console.log({e})
      // 401 = no valid session, that's fine — just not logged in
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  login: async (email, password) => {
    const user = await authApi.login(email, password)
    set({ user, isAuthenticated: true })
  },

  register: async (name, email, password) => {
    const user = await authApi.register(name, email, password)
    set({ user, isAuthenticated: true })
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // clear local state regardless
    }
    set({ user: null, isAuthenticated: false })
  },
}))