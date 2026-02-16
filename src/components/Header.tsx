import { useStore } from '../store'
import { Moon, Sun, Bell, Search } from 'lucide-react'

export default function Header() {
  const { darkMode, toggleDarkMode, sidebarCollapsed } = useStore()

  return (
    <header
      style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
      className="fixed top-0 right-0 h-16 bg-white dark:bg-safari-charcoal border-b border-gray-200 dark:border-safari-brown/20 z-30 transition-all duration-300"
    >
      <div className="flex items-center justify-between h-full px-8">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search bookings, customers, packages..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-safari-brown/20 bg-gray-50 dark:bg-safari-brown/10 focus:outline-none focus:ring-2 focus:ring-safari-gold/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-safari-brown/20 transition-colors"
          >
            {darkMode ? <Sun size={20} className="text-safari-gold" /> : <Moon size={20} />}
          </button>

          <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-safari-brown/20 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
