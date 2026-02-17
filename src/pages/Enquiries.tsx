import { useState, useEffect } from 'react'
import { Mail, Phone, User, Calendar, MessageSquare } from 'lucide-react'
import * as api from '../lib/api'
import { formatDate } from '../lib/utils'

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEnquiries()
  }, [])

  const loadEnquiries = async () => {
    try {
      const data = await api.getEnquiries()
      console.log('Enquiries loaded:', data)
      setEnquiries(data)
      setError('')
    } catch (err: any) {
      console.error('Failed to load enquiries:', err)
      setError(err.message || 'Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.updateEnquiryStatus(id, status)
      loadEnquiries()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading enquiries...</div>
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">Enquiries</h1>
          <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage customer inquiries and messages</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-safari-cream">Enquiries</h1>
        <p className="text-gray-600 dark:text-safari-cream/60 mt-1">Manage customer inquiries and messages</p>
      </div>

      <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-6 card-shadow-lg border border-gray-100 dark:border-safari-brown/20">
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No enquiries yet</p>
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry.id} className="border border-gray-200 dark:border-safari-brown/20 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-safari-gold" />
                      <h3 className="font-semibold text-lg">{enquiry.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        enquiry.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        enquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {enquiry.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-safari-cream/60 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {enquiry.email}
                      </div>
                      {enquiry.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {enquiry.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(enquiry.created_at)}
                      </div>
                    </div>
                    {enquiry.subject && (
                      <div className="mb-2">
                        <span className="font-medium text-sm">Subject:</span> {enquiry.subject}
                      </div>
                    )}
                    <div className="bg-gray-50 dark:bg-safari-brown/10 rounded-lg p-4 mt-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-safari-gold mt-1 flex-shrink-0" />
                        <p className="text-sm whitespace-pre-wrap">{enquiry.message}</p>
                      </div>
                    </div>
                  </div>
                  <select
                    value={enquiry.status}
                    onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                    className="ml-4 px-3 py-2 rounded-lg border border-gray-200 dark:border-safari-brown/20 bg-white dark:bg-safari-brown/10 text-sm focus:outline-none focus:ring-2 focus:ring-safari-gold/50"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
