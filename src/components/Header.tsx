import { useStore } from '../store'
import { Moon, Sun, Bell, LogOut, Clock, AlertTriangle } from 'lucide-react'
import { useAutoLogout } from '../hooks/useAutoLogout'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const { darkMode, toggleDarkMode, sidebarCollapsed, logout, user } = useStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const { showWarning, countdown, stayLoggedIn } = useAutoLogout(handleLogout)

  const confirmLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      handleLogout()
    }
  }

  return (
    <>
      <header
        style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        className="fixed top-0 right-0 h-16 bg-white dark:bg-safari-charcoal border-b border-gray-200 dark:border-safari-brown/20 z-30 transition-all duration-300"
      >
        <div className="flex items-center justify-between h-full px-6">

          {/* Left — greeting */}
          <div className="hidden sm:flex flex-col">
            <span className="text-xs text-gray-400 dark:text-safari-cream/40">Welcome back,</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-safari-cream truncate max-w-[180px]">
              {user?.name || 'Admin User'}
            </span>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              title="Toggle dark mode"
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-safari-brown/20 transition-colors"
            >
              {darkMode
                ? <Sun size={18} className="text-safari-gold" />
                : <Moon size={18} className="text-gray-500" />}
            </button>

            {/* Notifications */}
            <button
              title="Notifications"
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-safari-brown/20 transition-colors"
            >
              <Bell size={18} className="text-gray-500 dark:text-safari-cream/70" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 dark:bg-safari-brown/30 mx-1" />

            {/* Logout button — always visible */}
            <button
              onClick={confirmLogout}
              title="Log out"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-200 group"
            >
              <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Auto-logout warning modal ── */}
      <AnimatePresence>
        {showWarning && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="fixed z-[9999] inset-0 flex items-center justify-center px-4"
            >
              <div className="bg-white dark:bg-safari-charcoal rounded-2xl shadow-2xl border border-gray-200 dark:border-safari-brown/30 w-full max-w-sm p-8 text-center">

                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-safari-cream mb-2">
                  Still there?
                </h2>
                <p className="text-sm text-gray-500 dark:text-safari-cream/60 mb-6 leading-relaxed">
                  You've been inactive for a while. For security, you'll be automatically logged out in:
                </p>

                {/* Countdown ring */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="100"
                      strokeDashoffset={100 - (countdown / 60) * 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-500 mb-0.5" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-safari-cream leading-none">
                      {countdown}
                    </span>
                    <span className="text-[10px] text-gray-400">sec</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-safari-brown/30 text-sm font-medium text-gray-600 dark:text-safari-cream/70 hover:bg-gray-50 dark:hover:bg-safari-brown/20 transition-colors"
                  >
                    Log out now
                  </button>
                  <button
                    onClick={stayLoggedIn}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                    style={{ background: 'linear-gradient(135deg, #D4A843, #C17B2E)' }}
                  >
                    Stay logged in
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
