import { Plus, Edit, Trash2, X, Save, RefreshCw, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
import * as api from '../lib/api'
import type { SafariPackage, SafariPackagePayload } from '../lib/types'

export default function SafariPackages() {
  const [packages, setPackages] = useState<SafariPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [editForm, setEditForm] = useState<SafariPackagePayload>({ 
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
    published: true,
    highlights: '',
    accommodations_budget: '',
    accommodations_midrange: '',
    accommodations_luxury: '',
    addons: '',
    country: ''
  })

  const apiOrigin = api.API_URL.replace(/\/api\/?$/, '')
  const toPreviewSrc = (value?: string | null) => {
    const raw = String(value || '').trim()
    if (!raw) return null
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:') || raw.startsWith('blob:')) {
      try {
        const parsed = new URL(raw)
        if (
          parsed.protocol === 'http:' &&
          (parsed.hostname.endsWith('.onrender.com') || window.location.protocol === 'https:')
        ) {
          parsed.protocol = 'https:'
          return parsed.toString()
        }
      } catch {
        // Fall back to raw URL if parsing fails.
      }
      return raw
    }
    if (raw.startsWith('/')) {
      return `${apiOrigin}${raw}`
    }
    return `${apiOrigin}/${raw}`
  }
  const isLocalUploadRef = (value?: string | null) => {
    const raw = String(value || '').trim()
    if (!raw) return false
    if (raw.startsWith('/uploads/')) return true
    try {
      return new URL(raw).pathname.startsWith('/uploads/')
    } catch {
      return false
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const localPreview = URL.createObjectURL(file)
    setImagePreview(localPreview)
    setUploading(true)

    try {
      const uploaded = await api.uploadImage(file)
      const imageUrl = uploaded?.url || uploaded?.path || ''
      setEditForm((prev) => ({ ...prev, image_url: imageUrl }))
      setImagePreview(toPreviewSrc(imageUrl) || localPreview)
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Image upload failed. Please try again.')
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    const currentImage = String(editForm.image_url || '').trim()
    if (!currentImage) {
      setImagePreview(null)
      return
    }

    const shouldDelete = isLocalUploadRef(currentImage) && (!editingId || currentImage !== originalImageUrl)
    if (shouldDelete) {
      try {
        await api.deleteUploadedImage(currentImage)
      } catch (error) {
        console.error('Failed to remove uploaded image:', error)
      }
    }

    setEditForm((prev) => ({ ...prev, image_url: '' }))
    setImagePreview(null)
  }

  const cancelEdit = async () => {
    const currentImage = String(editForm.image_url || '').trim()
    if (currentImage && currentImage !== originalImageUrl && isLocalUploadRef(currentImage)) {
      try {
        await api.deleteUploadedImage(currentImage)
      } catch (error) {
        console.error('Failed to clean up temporary image:', error)
      }
    }
    setEditingId(null)
    setOriginalImageUrl('')
    setEditForm({ name: '', duration: '', price: 0, tag: '', type: '', image_url: '', description: '', itinerary: '', includes: '', excludes: '', published: true, highlights: '', accommodations_budget: '', accommodations_midrange: '', accommodations_luxury: '', addons: '', country: '' })
    setImagePreview(null)
  }

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
        setEditForm({ name: '', duration: '', price: 0, tag: '', type: '', image_url: '', description: '', itinerary: '', includes: '', excludes: '', published: true, highlights: '', accommodations_budget: '', accommodations_midrange: '', accommodations_luxury: '', addons: '', country: '' })
        setImagePreview(null)
        setOriginalImageUrl('')
        setShowAddModal(false)
      } catch (error) {
        console.error('Failed to add package:', error)
      }
    }
  }

  const handleEdit = (pkg: SafariPackage) => {
    setEditingId(pkg.id)
    setOriginalImageUrl(pkg.image_url || '')
    setEditForm({ 
      name: pkg.name, 
      duration: pkg.duration || '', 
      price: pkg.price || 0, 
      tag: pkg.tag || '',
      type: pkg.type || '',
      image_url: pkg.image_url || '',
      description: pkg.description || '',
      itinerary: pkg.itinerary || '',
      includes: pkg.includes || '',
      excludes: pkg.excludes || '',
      published: pkg.published !== false,
      highlights: pkg.highlights && Array.isArray(pkg.highlights) ? pkg.highlights.join('|') : '',
      accommodations_budget: pkg.accommodations && Array.isArray(pkg.accommodations) ? pkg.accommodations[0] || '' : '',
      accommodations_midrange: pkg.accommodations && Array.isArray(pkg.accommodations) ? pkg.accommodations[1] || '' : '',
      accommodations_luxury: pkg.accommodations && Array.isArray(pkg.accommodations) ? pkg.accommodations[2] || '' : '',
      addons: pkg.addons && Array.isArray(pkg.addons) ? pkg.addons.join('|') : '',
      country: pkg.country || ''
    })
    setImagePreview(toPreviewSrc(pkg.image_url) || null)
  }

  const handleSave = async (id: number) => {
    try {
      await api.updatePackageAdmin(id, editForm)
      await loadPackages()
      setEditingId(null)
      setOriginalImageUrl('')
      setImagePreview(null)
    } catch (error) {
      console.error('Failed to update package:', error)
    }
  }

  const handleDelete = async (id: number) => {
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
      const result = (await api.syncDestinationImagesFromPackages()) as { sourceCount: number, updatedCount: number, unmatchedCount: number }
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
                <img src={pkg.image_url || undefined} alt={pkg.name} className="w-full h-full object-cover" />
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
                    <select value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} className="px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700">
                      <option value="">Select Country/Flag</option>
                      <option value="Kenya">Kenya 🇰🇪</option>
                      <option value="Tanzania">Tanzania 🇹🇿</option>
                      <option value="Uganda">Uganda 🇺🇬</option>
                      <option value="Rwanda">Rwanda 🇷🇼</option>
                      <option value="Burundi">Burundi 🇧🇮</option>
                      <option value="South Sudan">South Sudan 🇸🇸</option>
                      <option value="DR Congo">DR Congo 🇨🇩</option>
                    </select>
                    <div className="flex items-center gap-2 p-2 border border-dashed rounded-lg dark:border-gray-700 col-span-2">
                      <label className="flex-1 cursor-pointer text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Upload size={16} />
                        <span>Upload package image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                    <input type="url" value={editForm.image_url} onChange={(e) => {
                      const value = e.target.value
                      setEditForm({ ...editForm, image_url: value })
                      setImagePreview(toPreviewSrc(value) || null)
                    }} placeholder="Or paste image URL" className="px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 col-span-2" />
                    {imagePreview && (
                      <div className="relative w-20 h-20 border rounded-lg overflow-hidden col-span-2">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 flex items-center justify-center w-5 h-5"><X size={12} /></button>
                      </div>
                    )}
                    {uploading && <p className="text-xs text-safari-gold col-span-2">Uploading image...</p>}
                  </div>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <textarea value={editForm.itinerary} onChange={(e) => setEditForm({ ...editForm, itinerary: e.target.value })} placeholder="Itinerary (separate days with |)" rows={3} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <textarea value={editForm.includes} onChange={(e) => setEditForm({ ...editForm, includes: e.target.value })} placeholder="Includes (separate with |)" rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <textarea value={editForm.excludes} onChange={(e) => setEditForm({ ...editForm, excludes: e.target.value })} placeholder="Excludes (separate with |)" rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  
                  <div className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-700 space-y-4">
                    <textarea value={editForm.highlights} onChange={(e) => setEditForm({ ...editForm, highlights: e.target.value })} placeholder="Highlights (separate with | e.g. Spot Lions | Photographic Safari)" rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Budget Lodge</label>
                        <input type="text" value={editForm.accommodations_budget} onChange={(e) => setEditForm({ ...editForm, accommodations_budget: e.target.value })} placeholder="Budget Lodge" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Mid-Range Lodge</label>
                        <input type="text" value={editForm.accommodations_midrange} onChange={(e) => setEditForm({ ...editForm, accommodations_midrange: e.target.value })} placeholder="Mid-Range Lodge" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Luxury Lodge</label>
                        <input type="text" value={editForm.accommodations_luxury} onChange={(e) => setEditForm({ ...editForm, accommodations_luxury: e.target.value })} placeholder="Luxury Lodge" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 text-sm" />
                      </div>
                    </div>

                    <textarea value={editForm.addons} onChange={(e) => setEditForm({ ...editForm, addons: e.target.value })} placeholder="Premium Add-Ons (separate with | e.g. Zanzibar Extension | Hot Air Balloon)" rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(pkg.id)} className="flex-1 px-4 py-2 safari-gradient text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"><Save size={16} />Save</button>
                    <button onClick={() => void cancelEdit()} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><X size={16} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-safari-cream">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-safari-cream/60">{pkg.duration} • ${pkg.price} • {pkg.type}{pkg.country && ` • ${pkg.country}`}</p>
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
                <select value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} className="px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700">
                  <option value="">Select Country/Flag</option>
                  <option value="Kenya">Kenya 🇰🇪</option>
                  <option value="Tanzania">Tanzania 🇹🇿</option>
                  <option value="Uganda">Uganda 🇺🇬</option>
                  <option value="Rwanda">Rwanda 🇷🇼</option>
                  <option value="Burundi">Burundi 🇧🇮</option>
                  <option value="South Sudan">South Sudan 🇸🇸</option>
                  <option value="DR Congo">DR Congo 🇨🇩</option>
                </select>
                <div className="flex items-center gap-2 p-2 border border-dashed rounded-lg dark:border-gray-700 col-span-2">
                  <label className="flex-1 cursor-pointer text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Upload size={16} />
                    <span>Upload package image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <input type="url" value={editForm.image_url} onChange={(e) => {
                  const value = e.target.value
                  setEditForm({ ...editForm, image_url: value })
                  setImagePreview(toPreviewSrc(value) || null)
                }} placeholder="Or paste image URL" className="px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 col-span-2" />
                {imagePreview && (
                  <div className="relative w-20 h-20 border rounded-lg overflow-hidden col-span-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 flex items-center justify-center w-5 h-5"><X size={12} /></button>
                  </div>
                )}
                {uploading && <p className="text-xs text-safari-gold col-span-2">Uploading image...</p>}
              </div>
              <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <textarea value={editForm.itinerary} onChange={(e) => setEditForm({ ...editForm, itinerary: e.target.value })} placeholder="Itinerary (separate days with | e.g., Day 1: Arrival|Day 2: Safari)" rows={3} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <textarea value={editForm.includes} onChange={(e) => setEditForm({ ...editForm, includes: e.target.value })} placeholder="Includes (separate with | e.g., All meals|Park fees|Guide)" rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <textarea value={editForm.excludes} onChange={(e) => setEditForm({ ...editForm, excludes: e.target.value })} placeholder="Excludes (separate with | e.g., Flights|Insurance|Tips)" rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              
              <div className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-700 space-y-4">
                <textarea value={editForm.highlights} onChange={(e) => setEditForm({ ...editForm, highlights: e.target.value })} placeholder="Highlights (separate with | e.g., Panoramic views | Professional photography guide)" rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Budget Lodge</label>
                    <input type="text" value={editForm.accommodations_budget} onChange={(e) => setEditForm({ ...editForm, accommodations_budget: e.target.value })} placeholder="Budget Lodge" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Mid-Range Lodge</label>
                    <input type="text" value={editForm.accommodations_midrange} onChange={(e) => setEditForm({ ...editForm, accommodations_midrange: e.target.value })} placeholder="Mid-Range Lodge" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Luxury Lodge</label>
                    <input type="text" value={editForm.accommodations_luxury} onChange={(e) => setEditForm({ ...editForm, accommodations_luxury: e.target.value })} placeholder="Luxury Lodge" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 text-sm" />
                  </div>
                </div>

                <textarea value={editForm.addons} onChange={(e) => setEditForm({ ...editForm, addons: e.target.value })} placeholder="Premium Add-Ons (separate with | e.g. Zanzibar Extension | Hot Air Balloon)" rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 px-4 py-2 safari-gradient text-white rounded-lg hover:opacity-90 transition-all">Add Package</button>
              <button onClick={async () => {
                if (editForm.image_url && isLocalUploadRef(editForm.image_url)) {
                  try {
                    await api.deleteUploadedImage(editForm.image_url)
                  } catch (error) {
                    console.error('Failed to clean up temporary image:', error)
                  }
                }
                setShowAddModal(false)
                setOriginalImageUrl('')
                setEditForm({ name: '', duration: '', price: 0, tag: '', type: '', image_url: '', description: '', itinerary: '', includes: '', excludes: '', published: true, highlights: '', accommodations_budget: '', accommodations_midrange: '', accommodations_luxury: '', addons: '', country: '' })
                setImagePreview(null)
              }} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
