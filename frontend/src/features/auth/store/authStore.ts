import { create } from 'zustand'
import type { AuthUser } from '@/features/auth/types'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialLoading: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<AuthUser>
  register: (data: {
    fullName: string
    email: string
    phone: string
    password: string
    role: string
  }) => Promise<AuthUser>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

export type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set) => ({
  // ─── State ────────────────────────────────────────
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialLoading: true,

  // ─── Actions ──────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed')
      }

      const user: AuthUser = data.user
      set({ user, isAuthenticated: true })
      return user
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (payload) => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed')
      }

      const user: AuthUser = data.user
      set({ user, isAuthenticated: true })
      return user
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  checkSession: async () => {
    set({ isInitialLoading: true })
    try {
      const res = await fetch('/api/auth/me')

      if (!res.ok) {
        set({ user: null, isAuthenticated: false })
        return
      }

      const data = await res.json()
      if (data.success && data.user) {
        set({ user: data.user, isAuthenticated: true })
      } else {
        set({ user: null, isAuthenticated: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isInitialLoading: false })
    }
  },
}))
