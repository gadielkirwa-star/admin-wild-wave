import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store'
import { LayoutDashboard, Package, MapPin, Users, DollarSign, Car, MessageSquare, Settings, UserCog, Menu, X, FileText, Phone, Briefcase, Mail, Megaphone } from 'lucide-react'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Bookings', path: '/bookings', icon: Package },
  { name: 'Enquiries', path: '/enquiries', icon: Mail },
  { name: 'Tour Packages', path: '/packages', icon: MapPin },
  { name: 'Safari Packages', path: '/safari-packages', icon: Briefcase },
  { name: 'Blog Posts', path: '/blog', icon: FileText },
  { name: 'Contact Info', path: '/contact-settings', icon: Phone },
  { name: 'Promotions', path: '/promotions', icon: Megaphone },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Payments', path: '/payments', icon: DollarSign },
  { name: 'Guides & Vehicles', path: '/resources', icon: Car },
  { name: 'Support', path: '/support', icon: MessageSquare },
  { name: 'Admin Users', path: '/admins', icon: UserCog },
  { name: 'Settings', path: '/settings', icon: Settings }
]

export default function Sidebar() {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-screen bg-safari-charcoal dark:bg-safari-charcoal border-r border-safari-brown/20 z-40"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-safari-brown/20">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <img 
                src="https://i.pinimg.com/736x/b7/4d/e4/b74de494b7a34e81af1cb59309b42b6f.jpg" 
                alt="WildWave Logo" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <h1 className="text-2xl font-display font-bold text-safari-gold">
                WildWave
              </h1>
            </div>
          )}
          {sidebarCollapsed && (
            <img 
              src="https://i.pinimg.com/736x/b7/4d/e4/b74de494b7a34e81af1cb59309b42b6f.jpg" 
              alt="WildWave Logo" 
              className="w-10 h-10 rounded-lg object-cover mx-auto"
            />
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-safari-brown/20 text-safari-cream transition-colors"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'safari-gradient text-white shadow-lg'
                    : 'text-safari-cream/70 hover:bg-safari-brown/20 hover:text-safari-cream'
                )}
              >
                <Icon size={20} />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-safari-brown/20">
          <div className={cn(
            'flex items-center gap-3 p-3 rounded-xl bg-safari-brown/20',
            sidebarCollapsed && 'justify-center'
          )}>
            <div className="w-10 h-10 rounded-full safari-gradient flex items-center justify-center text-white font-bold">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-safari-cream">Admin User</p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to logout?')) {
                      useStore.getState().logout()
                      window.location.href = '/login'
                    }
                  }}
                  className="text-xs text-safari-cream/60 hover:text-safari-gold transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
