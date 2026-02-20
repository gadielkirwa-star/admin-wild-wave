import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import Packages from './pages/Packages'
import SafariPackages from './pages/SafariPackages'
import Customers from './pages/Customers'
import Payments from './pages/Payments'
import GuidesVehicles from './pages/GuidesVehicles'
import AdminManagement from './pages/AdminManagement'
import Settings from './pages/Settings'
import Blog from './pages/Blog'
import ContactSettings from './pages/ContactSettings'
import Enquiries from './pages/Enquiries'
import Promotions from './pages/Promotions'
import Support from './pages/Support'
import Login from './pages/Login'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  const { sidebarCollapsed, isAuthenticated } = useStore()

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-safari-charcoal">
        <Sidebar />
        <Header />
        <main
          style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
          className="pt-24 px-8 pb-8 transition-all duration-300"
        >
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
            <Route path="/enquiries" element={<ProtectedRoute><Enquiries /></ProtectedRoute>} />
            <Route path="/destinations" element={<ProtectedRoute><Packages /></ProtectedRoute>} />
            <Route path="/packages" element={<ProtectedRoute><SafariPackages /></ProtectedRoute>} />
            <Route path="/safari-packages" element={<Navigate to="/packages" replace />} />
            <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
            <Route path="/contact-settings" element={<ProtectedRoute><ContactSettings /></ProtectedRoute>} />
            <Route path="/promotions" element={<ProtectedRoute><Promotions /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><GuidesVehicles /></ProtectedRoute>} />
            <Route path="/admins" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
