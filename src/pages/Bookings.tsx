import { useState, useEffect, useCallback } from 'react'
import {
  Search, Filter, Download, FileText, X, Phone, Mail,
  Users, Calendar, DollarSign, Package, MessageSquare,
  CheckCircle2, Clock, XCircle, AlertCircle, ChevronRight,
} from 'lucide-react'
import * as api from '../lib/api'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Booking } from '../lib/types'

// ─── helpers ──────────────────────────────────────────────────────────────────

const READ_KEY = 'ww_read_bookings'

const getReadSet = (): Set<number> => {
  try {
    const raw = localStorage.getItem(READ_KEY)
    return raw ? new Set<number>(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

const markRead = (id: number, readSet: Set<number>): Set<number> => {
  const next = new Set(readSet)
  next.add(id)
  localStorage.setItem(READ_KEY, JSON.stringify([...next]))
  return next
}

const STATUS_MAP: Record<string, { badge: string; select: string; icon: React.ReactNode; label: string }> = {
  pending: {
    badge: 'bg-sky-100 text-sky-700 border border-sky-200',
    select: 'bg-sky-500 text-white border-sky-400',
    icon: <Clock size={14} />, label: 'Pending',
  },
  new: {
    badge: 'bg-sky-100 text-sky-700 border border-sky-200',
    select: 'bg-sky-500 text-white border-sky-400',
    icon: <Clock size={14} />, label: 'New',
  },
  confirmed: {
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    select: 'bg-amber-500 text-white border-amber-400',
    icon: <CheckCircle2 size={14} />, label: 'Confirmed',
  },
  in_progress: {
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    select: 'bg-amber-500 text-white border-amber-400',
    icon: <CheckCircle2 size={14} />, label: 'In Progress',
  },
  completed: {
    badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    select: 'bg-emerald-500 text-white border-emerald-400',
    icon: <CheckCircle2 size={14} />, label: 'Completed',
  },
  cancelled: {
    badge: 'bg-rose-100 text-rose-700 border border-rose-200',
    select: 'bg-rose-500 text-white border-rose-400',
    icon: <XCircle size={14} />, label: 'Cancelled',
  },
  failed: {
    badge: 'bg-rose-100 text-rose-700 border border-rose-200',
    select: 'bg-rose-500 text-white border-rose-400',
    icon: <XCircle size={14} />, label: 'Failed',
  },
}

const getStatus = (status: string) =>
  STATUS_MAP[String(status || '').toLowerCase()] ?? {
    badge: 'bg-gray-100 text-gray-600 border border-gray-200',
    select: 'bg-gray-500 text-white border-gray-400',
    icon: <AlertCircle size={14} />, label: status,
  }

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  booking,
  onClose,
  onStatusChange,
}: {
  booking: Booking
  onClose: () => void
  onStatusChange: (id: number, status: string) => void
}) {
  const s = getStatus(booking.status)
  const initials = booking.customer_name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#1a1a2e] shadow-2xl z-50 flex flex-col animate-slide-in-right overflow-hidden">

        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#D4A574] to-[#b8874f] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-base leading-tight">{booking.customer_name}</p>
              <p className="text-white/70 text-xs">Booking #{booking.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status Badge */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
              {s.icon} {booking.status}
            </span>
            <select
              value={booking.status}
              onChange={(e) => onStatusChange(booking.id, e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-safari-gold/50 cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* Contact Info */}
          <Section title="Contact">
            <InfoRow icon={<Mail size={15} className="text-safari-gold" />} label="Email">
              <a href={`mailto:${booking.email}`} className="text-sky-600 hover:underline text-sm">{booking.email}</a>
            </InfoRow>
            {booking.phone && (
              <InfoRow icon={<Phone size={15} className="text-safari-gold" />} label="Phone">
                <a href={`tel:${booking.phone}`} className="text-sky-600 hover:underline text-sm">{booking.phone}</a>
              </InfoRow>
            )}
          </Section>

          {/* Safari Details */}
          <Section title="Safari Details">
            <InfoRow icon={<Package size={15} className="text-safari-gold" />} label="Package">
              <span className="text-sm font-medium dark:text-white">{booking.safari_type || '—'}</span>
            </InfoRow>
            <InfoRow icon={<Users size={15} className="text-safari-gold" />} label="People">
              <span className="text-sm dark:text-white">{booking.number_of_people ?? '—'}</span>
            </InfoRow>
            <InfoRow icon={<Calendar size={15} className="text-safari-gold" />} label="Start Date">
              <span className="text-sm dark:text-white">
                {booking.start_date ? formatDate(booking.start_date) : 'TBD'}
              </span>
            </InfoRow>
            <InfoRow icon={<DollarSign size={15} className="text-safari-gold" />} label="Total Amount">
              <span className="text-sm font-bold text-emerald-600">{formatCurrency(booking.total_price || 0)}</span>
            </InfoRow>
          </Section>

          {/* Special Requests */}
          {booking.special_requests && (
            <Section title="Special Requests">
              <div className="flex gap-2">
                <MessageSquare size={15} className="text-safari-gold mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed whitespace-pre-wrap">
                  {booking.special_requests}
                </p>
              </div>
            </Section>
          )}

          {/* Timestamps */}
          <Section title="Timestamps">
            <InfoRow icon={<Clock size={15} className="text-safari-gold" />} label="Submitted">
              <span className="text-sm dark:text-white">{formatDate(booking.created_at)}</span>
            </InfoRow>
          </Section>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 shrink-0 flex gap-3">
          <a
            href={`mailto:${booking.email}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-safari-gold text-white text-sm font-semibold hover:opacity-90 transition"
          >
            <Mail size={15} /> Email Customer
          </a>
          {booking.phone && (
            <a
              href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition"
            >
              <MessageSquare size={15} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-white/40 mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function InfoRow({
  icon, label, children,
}: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 flex items-start justify-between gap-2">
        <span className="text-xs text-gray-400 dark:text-white/40 shrink-0 pt-0.5">{label}</span>
        <div className="text-right">{children}</div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Booking | null>(null)
  const [readSet, setReadSet] = useState<Set<number>>(getReadSet)

  useEffect(() => { loadBookings() }, [])

  // Close panel on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.getBookings()
      setBookings(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load bookings'
      setError(message)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = useCallback((booking: Booking) => {
    setSelected(booking)
    setReadSet((prev) => markRead(booking.id, prev))
  }, [])

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.updateBookingStatus(id, status)
      // Optimistically update both list + detail panel
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b))
      setSelected((prev) => prev?.id === id ? { ...prev, status } : prev)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const exportToCSV = () => {
    const headers = ['Reference', 'Customer', 'Email', 'Phone', 'Package', 'People', 'Start Date', 'Amount', 'Status', 'Date']
    const rows = bookings.map((b) => [
      `#${b.id}`, b.customer_name, b.email, b.phone || '',
      b.safari_type || '', b.number_of_people || 0,
      b.start_date || '', b.total_price || 0, b.status, b.created_at,
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const exportToPDF = () => {
    const pw = window.open('', '', 'width=800,height=600')
    if (!pw) return
    pw.document.write(`<!DOCTYPE html><html><head><title>Bookings Report</title>
      <style>body{font-family:Arial,sans-serif;padding:20px}h1{color:#D4A574;text-align:center}
      table{width:100%;border-collapse:collapse;margin-top:20px}
      th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}
      th{background:#D4A574;color:white}tr:nth-child(even){background:#f9f9f9}</style></head>
      <body><h1>WildWave Safaris – Bookings Report</h1>
      <p style="text-align:center;color:#666">Generated: ${new Date().toLocaleDateString()}</p>
      <table><thead><tr><th>Ref</th><th>Customer</th><th>Package</th><th>People</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>${bookings.map((b) => `<tr><td>#${b.id}</td><td>${b.customer_name}</td><td>${b.safari_type || ''}</td><td>${b.number_of_people || 0}</td><td>${formatCurrency(b.total_price || 0)}</td><td>${b.status}</td><td>${formatDate(b.created_at)}</td></tr>`).join('')}</tbody></table></body></html>`)
    pw.document.close()
    setTimeout(() => { pw.print(); pw.close() }, 250)
  }

  const filteredBookings = bookings.filter((b) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      String(b.id).includes(q) ||
      b.customer_name.toLowerCase().includes(q) ||
      (b.email || '').toLowerCase().includes(q) ||
      (b.safari_type || '').toLowerCase().includes(q)
    )
  })

  const unreadCount = filteredBookings.filter((b) => !readSet.has(b.id)).length

  return (
    <>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.28s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">
              Bookings Management
            </h1>
            <p className="text-gray-600 dark:text-safari-cream/60 mt-1">
              Manage all safari bookings and reservations
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500 text-white">
                  {unreadCount} new
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 safari-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download size={18} /> Export CSV
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 border border-safari-gold text-safari-gold rounded-xl font-medium hover:bg-safari-gold hover:text-white transition-all flex items-center gap-2"
            >
              <FileText size={18} /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
          {/* Search */}
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
              <Filter size={18} /> Filter
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              Error loading bookings: {error}
            </div>
          )}
          {loading && (
            <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
              Loading bookings...
            </div>
          )}
          {!loading && !error && filteredBookings.length === 0 && (
            <div className="mb-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-safari-brown/10 dark:text-safari-cream/70">
              No bookings found.
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-safari-brown/20">
                  <th className="text-left py-3 px-4 text-sm font-semibold">Reference</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Package</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">People</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Start Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const isUnread = !readSet.has(booking.id)
                  const isSelected = selected?.id === booking.id
                  const s = getStatus(booking.status)
                  return (
                    <tr
                      key={booking.id}
                      onClick={() => handleRowClick(booking)}
                      className={`
                        border-b border-gray-100 dark:border-safari-brown/10
                        cursor-pointer transition-all duration-150
                        ${isSelected
                          ? 'bg-safari-gold/10 dark:bg-safari-gold/10'
                          : isUnread
                          ? 'bg-sky-50/60 dark:bg-sky-900/10 hover:bg-sky-100/60 dark:hover:bg-sky-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-safari-brown/10'}
                      `}
                    >
                      {/* Reference */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 animate-pulse" />
                          )}
                          <span className={`font-mono text-sm ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-safari-cream/70'}`}>
                            #{booking.id}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <p className={`text-sm ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium'}`}>
                          {booking.customer_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-safari-cream/60">{booking.email}</p>
                      </td>

                      {/* Package */}
                      <td className={`py-4 px-4 text-sm ${isUnread ? 'font-semibold dark:text-white' : ''}`}>
                        {booking.safari_type || '—'}
                      </td>

                      {/* People */}
                      <td className="py-4 px-4 text-sm">{booking.number_of_people ?? '—'}</td>

                      {/* Start Date */}
                      <td className="py-4 px-4 text-sm">
                        {booking.start_date ? formatDate(booking.start_date) : 'TBD'}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-semibold text-sm">
                        {formatCurrency(booking.total_price || 0)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
                          {s.icon} {booking.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-safari-cream/60">
                        {formatDate(booking.created_at)}
                      </td>

                      {/* Arrow */}
                      <td className="py-4 px-2">
                        <ChevronRight size={16} className={`transition-transform ${isSelected ? 'text-safari-gold rotate-90' : 'text-gray-300'}`} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <DetailPanel
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  )
}
