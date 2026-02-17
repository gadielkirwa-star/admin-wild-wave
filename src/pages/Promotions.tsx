import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import * as api from '../lib/api'

export default function Promotions() {
  const [promotions, setPromotions] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '', description: '', discount_text: '', button_text: 'Book Now', button_link: '/contact', active: true
  })

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    try {
      const data = await api.getPromotions()
      setPromotions(data)
    } catch (error) {
      console.error('Failed to load promotions:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.updatePromotion(editing.id, formData)
      } else {
        await api.createPromotion(formData)
      }
      setFormData({ title: '', description: '', discount_text: '', button_text: 'Book Now', button_link: '/contact', active: true })
      setEditing(null)
      loadPromotions()
    } catch (error) {
      console.error('Failed to save promotion:', error)
    }
  }

  const handleEdit = (promo: any) => {
    setEditing(promo)
    setFormData({
      title: promo.title,
      description: promo.description || '',
      discount_text: promo.discount_text || '',
      button_text: promo.button_text || 'Book Now',
      button_link: promo.button_link || '/contact',
      active: promo.active
    })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this promotion?')) {
      try {
        await api.deletePromotion(id)
        loadPromotions()
      } catch (error) {
        console.error('Failed to delete promotion:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">Promotional Popups</h1>
        <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage promotional offers that appear to visitors</p>
      </div>

      <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
        <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Promotion' : 'Create New Promotion'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-safari-brown/20 bg-white dark:bg-safari-brown/10"
                placeholder="School Safari Special"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Text</label>
              <input
                type="text"
                value={formData.discount_text}
                onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-safari-brown/20 bg-white dark:bg-safari-brown/10"
                placeholder="Up to 30% OFF"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-safari-brown/20 bg-white dark:bg-safari-brown/10"
              placeholder="Book your educational safari adventure at an unbeatable price!"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <input
                type="text"
                value={formData.button_text}
                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-safari-brown/20 bg-white dark:bg-safari-brown/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Link</label>
              <input
                type="text"
                value={formData.button_link}
                onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-safari-brown/20 bg-white dark:bg-safari-brown/10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded"
            />
            <label className="text-sm font-medium">Active (show to visitors)</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 safari-gradient text-white rounded-xl font-medium">
              {editing ? 'Update' : 'Create'} Promotion
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setFormData({ title: '', description: '', discount_text: '', button_text: 'Book Now', button_link: '/contact', active: true })
                }}
                className="px-6 py-2 border border-gray-200 dark:border-safari-brown/20 rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
        <h2 className="text-xl font-bold mb-4">All Promotions</h2>
        <div className="space-y-4">
          {promotions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No promotions yet</p>
          ) : (
            promotions.map((promo) => (
              <div key={promo.id} className="border border-gray-200 dark:border-safari-brown/20 rounded-xl p-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag className="w-5 h-5 text-safari-gold" />
                    <h3 className="font-semibold text-lg">{promo.title}</h3>
                    {promo.discount_text && (
                      <span className="px-3 py-1 bg-safari-gold text-white text-xs font-bold rounded-full">
                        {promo.discount_text}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {promo.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-safari-cream/60 mb-2">{promo.description}</p>
                  <div className="text-xs text-gray-500">
                    Button: "{promo.button_text}" → {promo.button_link}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-safari-brown/20 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
