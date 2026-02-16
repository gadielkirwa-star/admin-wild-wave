import { Plus, Edit, Trash2, X, Save, Upload, Image as ImageIcon } from 'lucide-react'
import { db } from '../lib/db'
import { formatCurrency } from '../lib/utils'
import { useState } from 'react'

export default function Packages() {
  const { packages } = db
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', duration: '', price: 0, category: '', image: '' })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleAdd = () => {
    if (editForm.name && editForm.duration && editForm.price) {
      packages.push({
        id: Date.now().toString(),
        name: editForm.name,
        duration: editForm.duration,
        price: editForm.price,
        category: editForm.category || 'Luxury',
        bookings: 0,
        revenue: 0,
        status: 'active',
        image: editForm.image || 'https://images.unsplash.com/photo-1516426122078-c23e76319801'
      })
      setEditForm({ name: '', duration: '', price: 0, category: '', image: '' })
      setImagePreview(null)
      setShowAddModal(false)
    }
  }

  const handleEdit = (pkg: typeof packages[0]) => {
    setEditingId(pkg.id)
    setEditForm({ name: pkg.name, duration: pkg.duration, price: pkg.price, category: pkg.category, image: pkg.image })
    setImagePreview(pkg.image)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setEditForm({ ...editForm, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (id: string) => {
    const pkg = packages.find(p => p.id === id)
    if (pkg) {
      pkg.name = editForm.name
      pkg.duration = editForm.duration
      pkg.price = editForm.price
      pkg.category = editForm.category
      pkg.image = editForm.image
    }
    setEditingId(null)
    setImagePreview(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      const index = packages.findIndex(p => p.id === id)
      if (index > -1) packages.splice(index, 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">Tour Packages</h1>
          <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage safari packages and itineraries</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 safari-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white dark:bg-safari-charcoal rounded-2xl overflow-hidden card-shadow-lg border border-gray-100 dark:border-safari-brown/20 hover:shadow-xl transition-all">
            <div className="relative h-48 overflow-hidden group">
              <img src={editingId === pkg.id && imagePreview ? imagePreview : pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              {editingId === pkg.id && (
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-center text-white">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Upload Image</p>
                    <p className="text-xs opacity-75">Click to change</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-safari-gold text-white text-xs font-bold rounded-full">
                  {editingId === pkg.id ? editForm.category : pkg.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              {editingId === pkg.id ? (
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Package name"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  />
                  <input
                    type="text"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    placeholder="Duration (e.g., 7 days)"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  />
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    placeholder="Price"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  />
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Premium">Premium</option>
                    <option value="Value">Value</option>
                    <option value="Exclusive">Exclusive</option>
                  </select>
                  <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg dark:border-gray-700">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <label className="flex-1 cursor-pointer">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Change package image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-safari-cream mb-2">{pkg.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 dark:text-safari-cream/60">{pkg.duration}</span>
                    <span className="text-2xl font-bold text-safari-gold">{formatCurrency(pkg.price)}</span>
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-safari-brown/20">
                <div>
                  <p className="text-xs text-gray-500 dark:text-safari-cream/60">Bookings</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-safari-cream">{pkg.bookings}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-safari-cream/60">Revenue</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-safari-cream">{formatCurrency(pkg.revenue)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {editingId === pkg.id ? (
                  <>
                    <button
                      onClick={() => handleSave(pkg.id)}
                      className="flex-1 px-4 py-2 safari-gradient text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setImagePreview(null)
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 px-4 py-2 border border-safari-gold text-safari-gold rounded-xl hover:bg-safari-gold hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 max-w-md w-full card-shadow-lg">
            <h2 className="text-2xl font-bold text-safari-charcoal dark:text-safari-cream mb-4">Add New Package</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Package name"
                className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
              />
              <input
                type="text"
                value={editForm.duration}
                onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                placeholder="Duration (e.g., 7 days)"
                className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
              />
              <input
                type="number"
                value={editForm.price || ''}
                onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                placeholder="Price"
                className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
              />
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
              >
                <option value="">Select category</option>
                <option value="Luxury">Luxury</option>
                <option value="Premium">Premium</option>
                <option value="Value">Value</option>
                <option value="Exclusive">Exclusive</option>
              </select>
              <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg dark:border-gray-700">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                <label className="flex-1 cursor-pointer">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Upload package image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 safari-gradient text-white rounded-lg hover:opacity-90 transition-all"
              >
                Add Package
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditForm({ name: '', duration: '', price: 0, category: '', image: '' })
                  setImagePreview(null)
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
