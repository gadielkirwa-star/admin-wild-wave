import { Plus, Edit, Trash2, X, Save, Upload, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import * as api from '../lib/api'

export default function SafariPackages() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [editForm, setEditForm] = useState({ 
    name: '', 
    duration: '', 
    price: 0, 
    tag: '', 
    type: '',
    image_url: '',
    description: '',
    itinerary: '',
    includes: '',
    excludes: '',
    published: true
  })

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      const data = await api.getPackagesAdmin()
      setPackages(data)
    } catch (error) {
      console.error('Failed to load packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (editForm.name && editForm.duration && editForm.price) {
      try {
        await api.createPackageAdmin(editForm)
        await loadPackages()
        setEditForm({ name: '', duration: '', price: 0, tag: '', type: '', image_url: '', description: '', itinerary: '', includes: '', excludes: '', published: true })
        setShowAddModal(false)
      } catch (error) {
        console.error('Failed to add package:', error)
      }
    }
  }

  const handleEdit = (pkg: any) => {
    setEditingId(pkg.id)
    setEditForm({ 
      name: pkg.name, 
      duration: pkg.duration, 
      price: pkg.price, 
      tag: pkg.tag || '',
      type: pkg.type || '',
      image_url: pkg.image_url,
      description: pkg.description || '',
      itinerary: pkg.itinerary || '',
      includes: pkg.includes || '',
      excludes: pkg.excludes || '',
      published: pkg.published !== false
    })
  }

  const handleSave = async (id: string) => {
    try {
      await api.updatePackageAdmin(id, editForm)
      await loadPackages()
      setEditingId(null)
    } catch (error) {
      console.error('Failed to update package:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        await api.deletePackageAdmin(id)
        await loadPackages()
      } catch (error) {
        console.error('Failed to delete package:', error)
      }
    }
  }

  const handleSyncDestinationImages = async () => {
    setSyncing(true)
    try {
      const result = await api.syncDestinationImagesFromPackages()
      alert(
        `Sync complete.\n` +
        `Packages checked: ${result.sourceCount}\n` +
        `Destinations updated: ${result.updatedCount}\n` +
        `No matching destination name: ${result.unmatchedCount}`
      )
    } catch (error) {
      console.error('Failed to sync destination images:', error)
      alert('Failed to sync destination images. Please try again.')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading packages...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">Safari Packages</h1>
          <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage package pricing, itineraries, and inclusions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSyncDestinationImages}
            disabled={syncing}
            className="px-4 py-2 border border-safari-gold text-safari-gold rounded-xl font-medium hover:bg-safari-gold hover:text-white transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Images to Destinations'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 safari-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Add Package
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white dark:bg-safari-charcoal rounded-2xl overflow-hidden card-shadow-lg border border-gray-100 dark:border-safari-brown/20 flex flex-col md:flex-row">
            {!editingId || editingId !== pkg.id ? (
              <div className="md:w-1/3 h-48 md:h-auto">
                <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover" />
              </div>
            ) : null}
            <div className="p-6 flex-1">
              {editingId === pkg.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Package name" className="px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                    <input type="text" value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} placeholder="Duration (e.g., 7 Days)" className="px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                    <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} placeholder="Price" className="px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                    <input type="text" value={editForm.tag} onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })} placeholder="Tag (e.g., Most Popular)" className="px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                    <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700">
                      <option value="">Select Type</option>
                      <option value="Classic">Classic</option>
                      <option value="Gorilla Trekking">Gorilla Trekking</option>
                      <option value="Balloon Safaris">Balloon Safaris</option>
                      <option value="Beach Add-Ons">Beach Add-Ons</option>
                    </select>
                    <input type="url" value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} placeholder="Image URL" className="px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  </div>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <textarea value={editForm.itinerary} onChange={(e) => setEditForm({ ...editForm, itinerary: e.target.value })} placeholder="Itinerary (separate days with |)" rows={3} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <textarea value={editForm.includes} onChange={(e) => setEditForm({ ...editForm, includes: e.target.value })} placeholder="Includes (separate with |)" rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <textarea value={editForm.excludes} onChange={(e) => setEditForm({ ...editForm, excludes: e.target.value })} placeholder="Excludes (separate with |)" rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(pkg.id)} className="flex-1 px-4 py-2 safari-gradient text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"><Save size={16} />Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><X size={16} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-safari-cream">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-safari-cream/60">{pkg.duration} • ${pkg.price} • {pkg.type}</p>
                      {pkg.tag && <span className="inline-block mt-2 px-2 py-1 bg-safari-gold text-white text-xs rounded-full">{pkg.tag}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(pkg)} className="px-4 py-2 border border-safari-gold text-safari-gold rounded-xl hover:bg-safari-gold hover:text-white transition-all flex items-center gap-2"><Edit size={16} />Edit</button>
                      <button onClick={() => handleDelete(pkg.id)} className="px-4 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-safari-cream/60 mb-2">{pkg.description}</p>
                  {pkg.itinerary && <p className="text-xs text-gray-500 dark:text-gray-400">Itinerary: {pkg.itinerary.split('|').length} days</p>}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 max-w-2xl w-full card-shadow-lg my-8">
            <h2 className="text-2xl font-bold text-safari-charcoal dark:text-safari-cream mb-4">Add New Safari Package</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Package name" className="px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                <input type="text" value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} placeholder="Duration (e.g., 7 Days)" className="px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                <input type="number" value={editForm.price || ''} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} placeholder="Price" className="px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                <input type="text" value={editForm.tag} onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })} placeholder="Tag (e.g., Most Popular)" className="px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700">
                  <option value="">Select Type</option>
                  <option value="Classic">Classic</option>
                  <option value="Gorilla Trekking">Gorilla Trekking</option>
                  <option value="Balloon Safaris">Balloon Safaris</option>
                  <option value="Beach Add-Ons">Beach Add-Ons</option>
                </select>
                <input type="url" value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} placeholder="Image URL" className="px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              </div>
              <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <textarea value={editForm.itinerary} onChange={(e) => setEditForm({ ...editForm, itinerary: e.target.value })} placeholder="Itinerary (separate days with | e.g., Day 1: Arrival|Day 2: Safari)" rows={3} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <textarea value={editForm.includes} onChange={(e) => setEditForm({ ...editForm, includes: e.target.value })} placeholder="Includes (separate with | e.g., All meals|Park fees|Guide)" rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <textarea value={editForm.excludes} onChange={(e) => setEditForm({ ...editForm, excludes: e.target.value })} placeholder="Excludes (separate with | e.g., Flights|Insurance|Tips)" rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 px-4 py-2 safari-gradient text-white rounded-lg hover:opacity-90 transition-all">Add Package</button>
              <button onClick={() => { setShowAddModal(false); setEditForm({ name: '', duration: '', price: 0, tag: '', type: '', image_url: '', description: '', itinerary: '', includes: '', excludes: '', published: true }); }} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
