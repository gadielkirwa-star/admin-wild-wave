import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Save, X, Upload, Users } from 'lucide-react'
import * as api from '../lib/api'

type TeamMember = {
  id: number
  name: string
  role?: string
  bio?: string
  image_url?: string
  active?: boolean
  display_order?: number
}

const TEAM_ROLE_OPTIONS = [
  'Senior Safari Guide',
  'Safari Driver Guide',
  'Tour Manager',
  'Travel Consultant',
  'Guest Experience Manager',
  'Gorilla Trekking Specialist',
  'Wildlife Photographer Guide',
  'Logistics Coordinator',
  'Camp Operations Manager',
  'Conservation Liaison',
]

const DEFAULT_TEAM_AVATAR =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='60' fill='%23e5dcc9'/%3E%3Ctext x='50%25' y='52%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='20' fill='%236b4e3d'%3ETeam%3C/text%3E%3C/svg%3E";

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  image_url: '',
  active: true,
  display_order: 0,
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState<any>(emptyForm)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      const data = await api.getTeamMembers()
      setMembers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load team members:', error)
    } finally {
      setLoading(false)
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
      setForm((prev: any) => ({ ...prev, image_url: imageUrl }))
      setImagePreview(imageUrl || localPreview)
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Image upload failed. Please try again.')
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id)
    setForm({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      image_url: member.image_url || '',
      active: member.active !== false,
      display_order: member.display_order ?? 0,
    })
    setImagePreview(member.image_url || null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
    setImagePreview(null)
  }

  const handleAdd = async () => {
    if (!form.name.trim()) return
    try {
      await api.createTeamMember(form)
      await loadMembers()
      setForm(emptyForm)
      setImagePreview(null)
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to add team member:', error)
    }
  }

  const handleSave = async (id: number) => {
    if (!form.name.trim()) return
    try {
      await api.updateTeamMember(id, form)
      await loadMembers()
      cancelEdit()
    } catch (error) {
      console.error('Failed to update team member:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this team member?')) return
    try {
      await api.deleteTeamMember(id)
      await loadMembers()
    } catch (error) {
      console.error('Failed to delete team member:', error)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading team...</div>
  }

  return (
    <div className="space-y-6">
      <datalist id="team-role-options">
        {TEAM_ROLE_OPTIONS.map((role) => (
          <option key={role} value={role} />
        ))}
      </datalist>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">WildWave Team</h1>
          <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage team profiles shown on the public website</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 safari-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Team Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-10 card-shadow-lg border border-gray-100 dark:border-safari-brown/20 text-center">
          <Users className="w-10 h-10 mx-auto mb-3 text-safari-gold" />
          <p className="text-gray-600 dark:text-safari-cream/70">No team members yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
              {editingId === member.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  />
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Role / Title"
                    list="team-role-options"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  />
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Short bio"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  />
                  <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg dark:border-gray-700">
                    <label className="flex-1 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                      Upload image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <Upload className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => {
                      const value = e.target.value
                      setForm({ ...form, image_url: value })
                      setImagePreview(value || null)
                    }}
                    placeholder="Or paste image URL"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                  />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border border-gray-200 dark:border-gray-700" />}
                  {uploading && <p className="text-xs text-safari-gold">Uploading image...</p>}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={form.display_order}
                      onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                      placeholder="Display order"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                        className="rounded"
                      />
                      Active
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(member.id)} className="flex-1 px-4 py-2 safari-gradient text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"><Save size={16} />Save</button>
                    <button onClick={cancelEdit} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><X size={16} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={member.image_url || DEFAULT_TEAM_AVATAR}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div>
                      <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-safari-cream">{member.name}</h3>
                      <p className="text-sm text-safari-gold">{member.role || 'Team Member'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-safari-cream/70 mb-3">{member.bio}</p>
                  <div className="text-xs text-gray-500 dark:text-safari-cream/50 mb-4">
                    Order: {member.display_order ?? 0} • {member.active ? 'Active' : 'Hidden'}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(member)} className="flex-1 px-4 py-2 border border-safari-gold text-safari-gold rounded-xl hover:bg-safari-gold hover:text-white transition-all flex items-center justify-center gap-2"><Edit size={16} />Edit</button>
                    <button onClick={() => handleDelete(member.id)} className="px-4 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 max-w-xl w-full card-shadow-lg">
            <h2 className="text-2xl font-bold text-safari-charcoal dark:text-safari-cream mb-4">Add Team Member</h2>
            <div className="space-y-3">
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role / Title" list="team-role-options" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short bio" rows={3} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg dark:border-gray-700">
                <label className="flex-1 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                  Upload image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <Upload className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => {
                  const value = e.target.value
                  setForm({ ...form, image_url: value })
                  setImagePreview(value || null)
                }}
                placeholder="Or paste image URL"
                className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700"
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border border-gray-200 dark:border-gray-700" />}
              {uploading && <p className="text-xs text-safari-gold">Uploading image...</p>}
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} placeholder="Display order" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" />
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 px-4 py-2 safari-gradient text-white rounded-lg hover:opacity-90 transition-all">Add Team Member</button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setForm(emptyForm)
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
