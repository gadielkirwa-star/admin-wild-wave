import { create } from 'zustand'

interface AppState {
  darkMode: boolean
  sidebarCollapsed: boolean
  isAuthenticated: boolean
  user: { name: string; email: string } | null
  toggleDarkMode: () => void
  toggleSidebar: () => void
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useStore = create<AppState>((set) => ({
  darkMode: false,
  sidebarCollapsed: false,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode
    document.documentElement.classList.toggle('dark', newMode)
    return { darkMode: newMode }
  }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  login: (email: string, password: string) => {
    if (email === 'admin@wildwave.com' && password === 'admin123') {
      const user = { name: 'Admin User', email }
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user))
      set({ isAuthenticated: true, user })
      return true
    }
    return false
  },
  logout: () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    set({ isAuthenticated: false, user: null })
  }
}))
