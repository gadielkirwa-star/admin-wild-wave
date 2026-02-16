import { create } from 'zustand'
import * as api from '../lib/api'

interface AppState {
  darkMode: boolean
  sidebarCollapsed: boolean
  isAuthenticated: boolean
  user: { name: string; email: string } | null
  toggleDarkMode: () => void
  toggleSidebar: () => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useStore = create<AppState>((set) => ({
  darkMode: false,
  sidebarCollapsed: false,
  isAuthenticated: localStorage.getItem('authToken') !== null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode
    document.documentElement.classList.toggle('dark', newMode)
    return { darkMode: newMode }
  }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  login: async (email: string, password: string) => {
    try {
      const data = await api.login(email, password)
      const user = { name: data.user.name || 'Admin User', email: data.user.email }
      localStorage.setItem('user', JSON.stringify(user))
      set({ isAuthenticated: true, user })
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  },
  logout: () => {
    api.setAuthToken(null)
    localStorage.removeItem('user')
    set({ isAuthenticated: false, user: null })
  }
}))
