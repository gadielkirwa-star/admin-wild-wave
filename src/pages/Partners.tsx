import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import * as api from '../lib/api'
import type { Partner, PartnerPayload } from '../lib/types'

const EMPTY: PartnerPayload = { name: '', logo_url: '', is_active: true, display_order: 0 }

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [form, setForm] = useState<PartnerPayload>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const data = await api.getPartners()
      setPartners(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load partners')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY, display_order: partners.length })
    setShowModal(true)
  }

  const openEdit = (p: Partner) => {
    setEditing(p)
    setForm({ name: p.name, logo_url: p.logo_url, is_active: p.is_active, display_order: p.display_order })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.logo_url.trim()) {
      alert('Name and Logo URL are required.')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const updated = await api.updatePartner(editing.id, form)
        setPartners(prev => prev.map(p => p.id === editing.id ? updated : p))
      } else {
        const created = await api.createPartner(form)
        setPartners(prev => [...prev, created])
      }
      setShowModal(false)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (p: Partner) => {
    try {
      const updated = await api.togglePartner(p.id)
      setPartners(prev => prev.map(x => x.id === p.id ? updated : x))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to toggle')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.deletePartner(id)
      setPartners(prev => prev.filter(p => p.id !== id))
      setDeleteConfirm(null)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">Partners</h1>
          <p className="text-gray-500 dark:text-safari-cream/60 mt-1">Manage logos displayed in the footer's "Trusted By Leading Partners" section.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 safari-gradient text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus size={18} /> Add Partner
        </button>
      </div>

      {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-64 text-safari-gold">Loading partners...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {partners.length === 0 && (
            <div className="col-span-full text-center text-gray-400 dark:text-safari-cream/40 py-16">
              <p className="text-lg">No partners yet.</p>
              <p className="text-sm mt-1">Click "Add Partner" to add your first trusted partner.</p>
            </div>
          )}
          {partners.map(p => (
            <div
              key={p.id}
              className={`bg-white dark:bg-safari-charcoal rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${p.is_active ? 'border-gray-100 dark:border-safari-brown/20' : 'border-dashed border-gray-300 dark:border-safari-brown/40 opacity-60'}`}
            >
              {/* Logo Preview */}
              <div className="bg-[#1A1208] h-28 flex items-center justify-center p-4">
                <img
                  src={p.logo_url}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain filter brightness-0 invert opacity-80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><rect fill="%23333" width="100" height="50"/><text x="50" y="30" text-anchor="middle" fill="%23999" font-size="12">No Image</text></svg>'
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-safari-cream">{p.name}</h3>
                    <p className="text-xs text-gray-400 dark:text-safari-cream/40 mt-0.5">Order: {p.display_order}</p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {p.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-safari-gold/10 hover:bg-safari-gold/20 text-safari-gold rounded-lg text-sm font-medium transition-colors">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => handleToggle(p)} title={p.is_active ? 'Hide' : 'Show'} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-safari-brown/20 text-gray-500 dark:text-safari-cream/50 transition-colors">
                    {p.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-safari-cream mb-6">
              {editing ? 'Edit Partner' : 'Add Partner'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-safari-cream/80 mb-1">Partner Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Kenya Wildlife Service"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-safari-brown/30 rounded-xl bg-white dark:bg-safari-charcoal/50 text-gray-900 dark:text-safari-cream focus:outline-none focus:ring-2 focus:ring-safari-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-safari-cream/80 mb-1">Logo URL *</label>
                <input
                  type="url"
                  value={form.logo_url}
                  onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))}
                  placeholder="https://example.com/logo.svg"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-safari-brown/30 rounded-xl bg-white dark:bg-safari-charcoal/50 text-gray-900 dark:text-safari-cream focus:outline-none focus:ring-2 focus:ring-safari-gold/50"
                />
              </div>
              {form.logo_url && (
                <div className="bg-[#1A1208] rounded-xl h-20 flex items-center justify-center p-4">
                  <img src={form.logo_url} alt="Preview" className="max-h-full max-w-full object-contain filter brightness-0 invert opacity-80" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-safari-cream/80 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))}
                    min={0}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-safari-brown/30 rounded-xl bg-white dark:bg-safari-charcoal/50 text-gray-900 dark:text-safari-cream focus:outline-none focus:ring-2 focus:ring-safari-gold/50"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                      className="w-4 h-4 accent-safari-gold"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-safari-cream/80">Show on site</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-safari-brown/30 rounded-xl text-gray-600 dark:text-safari-cream/70 hover:bg-gray-50 dark:hover:bg-safari-brown/20 transition-colors font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 safari-gradient text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Partner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-safari-cream mb-2">Delete Partner?</h3>
            <p className="text-gray-500 dark:text-safari-cream/60 text-sm mb-6">This will permanently remove the partner logo from the footer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-safari-brown/30 rounded-xl text-gray-600 dark:text-safari-cream/70 hover:bg-gray-50 dark:hover:bg-safari-brown/20 transition-colors font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
