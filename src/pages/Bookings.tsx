import { useState } from 'react'
import { Search, Filter, Download, FileText } from 'lucide-react'
import { db, updateBookingStatus, assignGuide } from '../lib/db'
import { formatCurrency, formatDate } from '../lib/utils'

export default function Bookings() {
  const [bookings, setBookings] = useState(db.recentBookings)
  const [search, setSearch] = useState('')

  const handleStatusChange = (id: string, status: string) => {
    updateBookingStatus(id, status)
    setBookings([...db.recentBookings])
  }

  const exportToCSV = () => {
    const headers = ['Reference', 'Customer', 'Email', 'Package', 'People', 'Amount', 'Guide', 'Status', 'Date']
    const rows = bookings.map(b => [
      b.ref,
      b.customer,
      b.email,
      b.package,
      b.people,
      b.amount,
      b.guide,
      b.status,
      b.date
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bookings Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #D4A574; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #D4A574; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .header { text-align: center; margin-bottom: 20px; }
          .date { text-align: center; color: #666; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>WildWave Safaris - Bookings Report</h1>
          <div class="date">Generated: ${new Date().toLocaleDateString()}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Customer</th>
              <th>Package</th>
              <th>People</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map(b => `
              <tr>
                <td>${b.ref}</td>
                <td>${b.customer}</td>
                <td>${b.package}</td>
                <td>${b.people}</td>
                <td>${formatCurrency(b.amount)}</td>
                <td>${b.status}</td>
                <td>${formatDate(b.date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `
    
    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">Bookings Management</h1>
          <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage all safari bookings and reservations</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 safari-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 border border-safari-gold text-safari-gold rounded-xl font-medium hover:bg-safari-gold hover:text-white transition-all flex items-center gap-2"
          >
            <FileText size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by reference, customer, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-safari-brown/20 bg-gray-50 dark:bg-safari-brown/10 focus:outline-none focus:ring-2 focus:ring-safari-gold/50"
            />
          </div>
          <button className="px-4 py-2 border border-gray-200 dark:border-safari-brown/20 rounded-xl hover:bg-gray-50 dark:hover:bg-safari-brown/10 transition-colors flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-safari-brown/20">
                <th className="text-left py-3 px-4 text-sm font-semibold">Reference</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Package</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">People</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Guide</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 dark:border-safari-brown/10 hover:bg-gray-50 dark:hover:bg-safari-brown/10">
                  <td className="py-4 px-4 font-mono text-sm">{booking.ref}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-sm">{booking.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-safari-cream/60">{booking.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">{booking.package}</td>
                  <td className="py-4 px-4 text-sm">{booking.people}</td>
                  <td className="py-4 px-4 font-semibold text-sm">{formatCurrency(booking.amount)}</td>
                  <td className="py-4 px-4 text-sm">{booking.guide}</td>
                  <td className="py-4 px-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="px-3 py-1 rounded-lg border border-gray-200 dark:border-safari-brown/20 bg-white dark:bg-safari-brown/10 text-sm focus:outline-none focus:ring-2 focus:ring-safari-gold/50"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-safari-cream/60">{formatDate(booking.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
