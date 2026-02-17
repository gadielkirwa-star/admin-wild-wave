import { Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import * as api from '../lib/api'

export default function ContactSettings() {
  const [settings, setSettings] = useState({
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    office_hours: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await api.getContactSettings()
      setSettings({
        phone: data.phone || '',
        email: data.email || '',
        whatsapp: data.whatsapp || '',
        address: data.address || '',
        office_hours: data.office_hours || ''
      })
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateContactSettings(settings)
      alert('Contact settings updated successfully!')
    } catch (error) {
      console.error('Failed to update settings:', error)
      alert('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">Contact Settings</h1>
          <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage contact information displayed on the website</p>
        </div>
      </div>

      <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-8 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-safari-cream mb-2">Phone Number</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+254 713 241 666"
              className="w-full px-4 py-3 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 dark:text-safari-cream"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-safari-cream mb-2">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="wildwavesafaris@gmail.com"
              className="w-full px-4 py-3 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 dark:text-safari-cream"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-safari-cream mb-2">WhatsApp Number</label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              placeholder="+254 713 241 666"
              className="w-full px-4 py-3 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 dark:text-safari-cream"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-safari-cream mb-2">Physical Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Thika Road, Spur Mall, Nairobi"
              className="w-full px-4 py-3 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 dark:text-safari-cream"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-safari-cream mb-2">Office Hours</label>
            <textarea
              value={settings.office_hours}
              onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })}
              placeholder="Mon - Fri: 8:00 AM - 6:00 PM (EAT)&#10;Sat: 9:00 AM - 3:00 PM (EAT)&#10;Sun: Closed"
              rows={4}
              className="w-full px-4 py-3 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 dark:text-safari-cream"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use line breaks for multiple lines</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-6 py-3 safari-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Preview</h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p><strong>Phone:</strong> {settings.phone || 'Not set'}</p>
          <p><strong>Email:</strong> {settings.email || 'Not set'}</p>
          <p><strong>WhatsApp:</strong> {settings.whatsapp || 'Not set'}</p>
          <p><strong>Address:</strong> {settings.address || 'Not set'}</p>
          <p><strong>Office Hours:</strong></p>
          <pre className="whitespace-pre-wrap">{settings.office_hours || 'Not set'}</pre>
        </div>
      </div>
    </div>
  )
}
