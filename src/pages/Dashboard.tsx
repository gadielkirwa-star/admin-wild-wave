import { Package, DollarSign, Users, TrendingUp, Calendar } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { formatCurrency, formatDate } from '../lib/utils'
import * as api from '../lib/api'

const COLORS = ['#D4A574', '#C17855', '#6B7F5C', '#4A5D3F', '#6B4E3D']

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboardStats()
      setStats(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-safari-gold text-lg">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
        Error loading dashboard: {error}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-safari-cream/60">
          Welcome back! Here's what's happening with your safari business today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings || 0}
          change={stats.bookingGrowth}
          icon={Package}
          color="bg-gradient-to-br from-safari-gold to-safari-terracotta"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue || 0)}
          change={stats.revenueGrowth}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard
          title="Active Tours"
          value={stats.activeTours || 0}
          icon={Calendar}
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers || 0}
          icon={Users}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-safari-cream mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC4" opacity={0.2} />
              <XAxis dataKey="month" stroke="#6B4E3D" />
              <YAxis stroke="#6B4E3D" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2D2D2D',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#F5F1E8'
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#D4A574" strokeWidth={3} dot={{ fill: '#D4A574', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-safari-cream mb-6">Bookings by Destination</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.countryData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ country, percentage }) => `${country} ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="bookings"
              >
                {(stats.countryData || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-safari-cream">Recent Bookings</h2>
          <button className="px-4 py-2 text-sm font-medium text-safari-gold hover:text-safari-terracotta transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-safari-brown/20">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-safari-cream/60">Reference</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-safari-cream/60">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-safari-cream/60">Package</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-safari-cream/60">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-safari-cream/60">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-safari-cream/60">Date</th>
              </tr>
            </thead>
            <tbody>
              {(stats.recentBookings || []).map((booking: any) => (
                <tr key={booking.id} className="border-b border-gray-100 dark:border-safari-brown/10 hover:bg-gray-50 dark:hover:bg-safari-brown/10 transition-colors">
                  <td className="py-4 px-4 text-sm font-mono text-gray-900 dark:text-safari-cream">{booking.ref || booking.id}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-safari-cream">{booking.customer || booking.customer_name}</p>
                      <p className="text-xs text-gray-500 dark:text-safari-cream/60">{booking.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-safari-cream">{booking.package || booking.safari_type}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900 dark:text-safari-cream">{formatCurrency(booking.amount || booking.total_price)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-safari-cream/60">{formatDate(booking.date || booking.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
