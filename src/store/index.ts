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
  unreadBookingsCount: number
  unreadEnquiriesCount: number
  pollNotifications: () => Promise<void>
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
      const message = error instanceof Error ? error.message : ''
      if (
        message.toLowerCase().includes('invalid credentials') ||
        message.includes('401')
      ) {
        return false
      }
      throw error
    }
  },
  logout: () => {
    api.setAuthToken(null)
    localStorage.removeItem('user')
    set({ isAuthenticated: false, user: null, unreadBookingsCount: 0, unreadEnquiriesCount: 0 })
  },
  unreadBookingsCount: 0,
  unreadEnquiriesCount: 0,
  pollNotifications: async () => {
    if (localStorage.getItem('authToken') === null) return
    try {
      const [bookings, enquiries] = await Promise.all([
        api.getBookings(),
        api.getEnquiries()
      ])
      
      const readBookings = new Set(JSON.parse(localStorage.getItem('ww_read_bookings') || '[]'))
      const readEnquiries = new Set(JSON.parse(localStorage.getItem('ww_read_enquiries') || '[]'))

      const unreadB = bookings.filter((b: any) => !readBookings.has(b.id)).length
      const unreadE = enquiries.filter((e: any) => !readEnquiries.has(e.id)).length

      set({ unreadBookingsCount: unreadB, unreadEnquiriesCount: unreadE })
    } catch (err) {
      // fail silently on background poll
    }
  }
}))
