import { Plus, Edit, Trash2, X, Save, Upload, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import * as api from '../lib/api'

export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editForm, setEditForm] = useState({ 
    title: '', 
    category: '', 
    excerpt: '', 
    content: '',
    image_url: '',
    read_time: '',
    published: true
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      const data = await api.getBlogs()
      setBlogs(data)
    } catch (error) {
      console.error('Failed to load blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (editForm.title && editForm.category) {
      try {
        await api.createBlog({
          title: editForm.title,
          category: editForm.category,
          excerpt: editForm.excerpt,
          content: editForm.content,
          image_url: editForm.image_url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
          read_time: editForm.read_time || '5 min',
          published: editForm.published
        })
        await loadBlogs()
        setEditForm({ title: '', category: '', excerpt: '', content: '', image_url: '', read_time: '', published: true })
        setImagePreview(null)
        setShowAddModal(false)
      } catch (error) {
        console.error('Failed to add blog:', error)
      }
    }
  }

  const handleEdit = (blog: any) => {
    setEditingId(blog.id)
    setEditForm({ 
      title: blog.title, 
      category: blog.category, 
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      image_url: blog.image_url,
      read_time: blog.read_time || '5 min',
      published: blog.published !== false
    })
    setImagePreview(blog.image_url)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setEditForm({ ...editForm, image_url: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (id: string) => {
    try {
      await api.updateBlog(id, {
        title: editForm.title,
        category: editForm.category,
        excerpt: editForm.excerpt,
        content: editForm.content,
        image_url: editForm.image_url,
        read_time: editForm.read_time,
        published: editForm.published
      })
      await loadBlogs()
      setEditingId(null)
      setImagePreview(null)
    } catch (error) {
      console.error('Failed to update blog:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await api.deleteBlog(id)
        await loadBlogs()
      } catch (error) {
        console.error('Failed to delete blog:', error)
      }
    }
  }

  const togglePublished = async (blog: any) => {
    try {
      await api.updateBlog(blog.id, { ...blog, published: !blog.published })
      await loadBlogs()
    } catch (error) {
      console.error('Failed to toggle published:', error)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading blogs...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">Blog Posts</h1>
          <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage blog articles and travel guides</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 safari-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Blog Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white dark:bg-safari-charcoal rounded-2xl overflow-hidden card-shadow-lg border border-gray-100 dark:border-safari-brown/20 hover:shadow-xl transition-all">
            <div className="relative h-48 overflow-hidden group">
              <img src={editingId === blog.id && imagePreview ? imagePreview : blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
              {editingId === blog.id && (
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-center text-white">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Upload Image</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="px-3 py-1 bg-safari-gold text-white text-xs font-bold rounded-full">
                  {editingId === blog.id ? editForm.category : blog.category}
                </span>
                {!blog.published && (
                  <span className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">Draft</span>
                )}
              </div>
            </div>
            <div className="p-6">
              {editingId === blog.id ? (
                <div className="space-y-3 mb-4">
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Blog title" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <input type="text" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <textarea value={editForm.excerpt} onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })} placeholder="Excerpt" rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} placeholder="Full content" rows={4} className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <input type="url" value={editForm.image_url} onChange={(e) => { setEditForm({ ...editForm, image_url: e.target.value }); setImagePreview(e.target.value); }} placeholder="Image URL" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <input type="text" value={editForm.read_time} onChange={(e) => setEditForm({ ...editForm, read_time: e.target.value })} placeholder="Read time (e.g., 5 min)" className="w-full px-3 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editForm.published} onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })} className="rounded" />
                    <span className="text-sm">Published</span>
                  </label>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-safari-cream mb-2">{blog.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-safari-cream/60 mb-3">{blog.excerpt}</p>
                  <p className="text-xs text-gray-500 dark:text-safari-cream/60 mb-4">{blog.read_time} read</p>
                </>
              )}
              <div className="flex gap-2 mt-4">
                {editingId === blog.id ? (
                  <>
                    <button onClick={() => handleSave(blog.id)} className="flex-1 px-4 py-2 safari-gradient text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"><Save size={16} />Save</button>
                    <button onClick={() => { setEditingId(null); setImagePreview(null); }} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><X size={16} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => togglePublished(blog)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" title={blog.published ? 'Unpublish' : 'Publish'}>{blog.published ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                    <button onClick={() => handleEdit(blog)} className="flex-1 px-4 py-2 border border-safari-gold text-safari-gold rounded-xl hover:bg-safari-gold hover:text-white transition-all flex items-center justify-center gap-2"><Edit size={16} />Edit</button>
                    <button onClick={() => handleDelete(blog.id)} className="px-4 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 max-w-2xl w-full card-shadow-lg my-8">
            <h2 className="text-2xl font-bold text-safari-charcoal dark:text-safari-cream mb-4">Add New Blog Post</h2>
            <div className="space-y-4">
              <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Blog title" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <input type="text" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category (e.g., Travel Tips, Destination Guide)" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <textarea value={editForm.excerpt} onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })} placeholder="Short excerpt" rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} placeholder="Full blog content" rows={6} className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <input type="text" value={editForm.read_time} onChange={(e) => setEditForm({ ...editForm, read_time: e.target.value })} placeholder="Read time (e.g., 5 min)" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg dark:border-gray-700">
                <Upload className="w-5 h-5 text-gray-400" />
                <label className="flex-1 cursor-pointer">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Upload image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <input type="url" value={editForm.image_url} onChange={(e) => { setEditForm({ ...editForm, image_url: e.target.value }); setImagePreview(e.target.value); }} placeholder="Or paste image URL" className="w-full px-4 py-2 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.published} onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })} className="rounded" />
                <span className="text-sm">Publish immediately</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 px-4 py-2 safari-gradient text-white rounded-lg hover:opacity-90 transition-all">Add Blog Post</button>
              <button onClick={() => { setShowAddModal(false); setEditForm({ title: '', category: '', excerpt: '', content: '', image_url: '', read_time: '', published: true }); setImagePreview(null); }} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
