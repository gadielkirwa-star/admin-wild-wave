import { useState, useEffect, useCallback } from 'react'
import {
  Mail, Phone, User, Calendar, MessageSquare,
  X, CheckCircle2, Clock, XCircle, AlertCircle,
  ChevronRight, Search, Tag,
} from 'lucide-react'
import * as api from '../lib/api'
import { formatDate } from '../lib/utils'
import type { Enquiry } from '../lib/types'

// ─── Read/Unread helpers ──────────────────────────────────────────────────────

const READ_KEY = 'ww_read_enquiries'

const getReadSet = (): Set<number> => {
  try {
    const raw = localStorage.getItem(READ_KEY)
    return raw ? new Set<number>(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

const markRead = (id: number, prev: Set<number>): Set<number> => {
  const next = new Set(prev)
  next.add(id)
  localStorage.setItem(READ_KEY, JSON.stringify([...next]))
  return next
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { badge: string; icon: React.ReactNode; label: string }> = {
  new: {
    badge: 'bg-sky-100 text-sky-700 border border-sky-200',
    icon: <Clock size={13} />, label: 'New',
  },
  pending: {
    badge: 'bg-sky-100 text-sky-700 border border-sky-200',
    icon: <Clock size={13} />, label: 'Pending',
  },
  contacted: {
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: <CheckCircle2 size={13} />, label: 'Contacted',
  },
  in_progress: {
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    icon: <CheckCircle2 size={13} />, label: 'In Progress',
  },
  resolved: {
    badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    icon: <CheckCircle2 size={13} />, label: 'Resolved',
  },
  solved: {
    badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    icon: <CheckCircle2 size={13} />, label: 'Solved',
  },
  completed: {
    badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    icon: <CheckCircle2 size={13} />, label: 'Completed',
  },
  cancelled: {
    badge: 'bg-rose-100 text-rose-700 border border-rose-200',
    icon: <XCircle size={13} />, label: 'Cancelled',
  },
  closed: {
    badge: 'bg-rose-100 text-rose-700 border border-rose-200',
    icon: <XCircle size={13} />, label: 'Closed',
  },
}

const getStatus = (status: string) =>
  STATUS_MAP[String(status || '').toLowerCase()] ?? {
    badge: 'bg-gray-100 text-gray-600 border border-gray-200',
    icon: <AlertCircle size={13} />, label: status,
  }

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  enquiry,
  onClose,
  onStatusChange,
}: {
  enquiry: Enquiry
  onClose: () => void
  onStatusChange: (id: number, status: string) => void
}) {
  const s = getStatus(enquiry.status)
  const initials = enquiry.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const replySubject = enquiry.subject
    ? `Re: ${enquiry.subject}`
    : 'Re: Your Enquiry – WildWave Safaris'

  const replyBody = `\n\n\n---\nOriginal message from ${enquiry.name}:\n${enquiry.message}`

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#1a1a2e] shadow-2xl z-50 flex flex-col animate-slide-in-right overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#D4A574] to-[#b8874f] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-base leading-tight">{enquiry.name}</p>
              <p className="text-white/70 text-xs">Enquiry #{enquiry.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status bar */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
            {s.icon} {enquiry.status}
          </span>
          <select
            value={enquiry.status}
            onChange={(e) => onStatusChange(enquiry.id, e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-safari-gold/50 cursor-pointer"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* Contact Info */}
          <Section title="Contact">
            <InfoRow icon={<User size={15} className="text-safari-gold" />} label="Name">
              <span className="text-sm font-medium dark:text-white">{enquiry.name}</span>
            </InfoRow>
            <InfoRow icon={<Mail size={15} className="text-safari-gold" />} label="Email">
              <a href={`mailto:${enquiry.email}`} className="text-sky-600 hover:underline text-sm">
                {enquiry.email}
              </a>
            </InfoRow>
            {enquiry.phone && (
              <InfoRow icon={<Phone size={15} className="text-safari-gold" />} label="Phone">
                <a href={`tel:${enquiry.phone}`} className="text-sky-600 hover:underline text-sm">
                  {enquiry.phone}
                </a>
              </InfoRow>
            )}
            <InfoRow icon={<Calendar size={15} className="text-safari-gold" />} label="Received">
              <span className="text-sm dark:text-white">{formatDate(enquiry.created_at)}</span>
            </InfoRow>
          </Section>

          {/* Subject */}
          {enquiry.subject && (
            <Section title="Subject">
              <div className="flex gap-2">
                <Tag size={15} className="text-safari-gold mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-gray-800 dark:text-white">{enquiry.subject}</p>
              </div>
            </Section>
          )}

          {/* Message — styled like a chat bubble */}
          <Section title="Message">
            <div className="relative">
              {/* Decorative quote mark */}
              <span className="absolute -top-1 -left-1 text-4xl text-safari-gold/20 font-serif leading-none select-none">"</span>
              <div className="bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm ml-2">
                <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed whitespace-pre-wrap">
                  {enquiry.message}
                </p>
              </div>
            </div>
          </Section>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 shrink-0 flex gap-3">
          <a
            href={`mailto:${enquiry.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-safari-gold text-white text-sm font-semibold hover:opacity-90 transition"
          >
            <Mail size={15} /> Reply by Email
          </a>
          {enquiry.phone && (
            <a
              href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${enquiry.name}, thank you for reaching out to WildWave Safaris!`)}`}
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

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
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

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [readSet, setReadSet] = useState<Set<number>>(getReadSet)

  useEffect(() => { loadEnquiries() }, [])

  // Escape key closes panel
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  const loadEnquiries = async () => {
    try {
      const data = await api.getEnquiries()
      setEnquiries(Array.isArray(data) ? data : [])
      setError('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = useCallback((enquiry: Enquiry) => {
    setSelected(enquiry)
    setReadSet((prev) => markRead(enquiry.id, prev))
  }, [])

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.updateEnquiryStatus(id, status)
      setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e))
      setSelected((prev) => prev?.id === id ? { ...prev, status } : prev)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const filtered = enquiries.filter((e) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.subject || '').toLowerCase().includes(q) ||
      (e.phone || '').toLowerCase().includes(q)
    )
  })

  const unreadCount = filtered.filter((e) => !readSet.has(e.id)).length

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
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">
            Enquiries
          </h1>
          <p className="text-gray-600 dark:text-safari-cream/60 mt-1">
            Manage customer inquiries and messages
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500 text-white">
                {unreadCount} new
              </span>
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, subject or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-safari-brown/20 bg-gray-50 dark:bg-safari-brown/10 focus:outline-none focus:ring-2 focus:ring-safari-gold/50 text-sm"
            />
          </div>

          {loading && (
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 mb-4">
              Loading enquiries…
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 mb-4">
              Error: {error}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-gray-500 dark:text-safari-cream/60 py-12">No enquiries found.</p>
          )}

          {/* Enquiry Rows */}
          <div className="space-y-3">
            {filtered.map((enquiry) => {
              const isUnread = !readSet.has(enquiry.id)
              const isSelected = selected?.id === enquiry.id
              const s = getStatus(enquiry.status)
              const preview = enquiry.message?.slice(0, 100).replace(/\n/g, ' ')

              return (
                <div
                  key={enquiry.id}
                  onClick={() => handleRowClick(enquiry)}
                  className={`
                    flex items-start gap-4 p-4 rounded-xl border cursor-pointer
                    transition-all duration-150 group
                    ${isSelected
                      ? 'border-safari-gold/40 bg-safari-gold/5 dark:bg-safari-gold/10 shadow-sm'
                      : isUnread
                      ? 'border-sky-200 dark:border-sky-800/50 bg-sky-50/70 dark:bg-sky-900/10 hover:bg-sky-100/70 dark:hover:bg-sky-900/20'
                      : 'border-gray-100 dark:border-safari-brown/20 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-safari-brown/10'}
                  `}
                >
                  {/* Avatar */}
                  <div className={`
                    w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-bold text-sm
                    ${isUnread
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 dark:bg-safari-brown/30 text-gray-600 dark:text-safari-cream/70'}
                  `}>
                    {enquiry.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 animate-pulse" />
                        )}
                        <p className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-800 dark:text-safari-cream'}`}>
                          {enquiry.name}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-safari-cream/40 shrink-0">
                        {formatDate(enquiry.created_at)}
                      </span>
                    </div>

                    {enquiry.subject && (
                      <p className={`text-xs mb-0.5 truncate ${isUnread ? 'text-gray-700 dark:text-white/80 font-semibold' : 'text-gray-600 dark:text-safari-cream/60'}`}>
                        {enquiry.subject}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 dark:text-safari-cream/40 truncate">
                      {preview}{enquiry.message?.length > 100 ? '…' : ''}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.badge}`}>
                      {s.icon} {enquiry.status}
                    </span>
                    <ChevronRight
                      size={15}
                      className={`transition-transform text-gray-300 group-hover:text-gray-400 ${isSelected ? 'text-safari-gold rotate-90' : ''}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <DetailPanel
          enquiry={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  )
}
