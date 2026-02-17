const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

let authToken: string | null = localStorage.getItem('authToken')

export const setAuthToken = (token: string | null) => {
  authToken = token
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Auth
export const login = async (email: string, password: string) => {
  const data = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setAuthToken(data.token)
  return data
}

// Dashboard
export const getDashboardStats = async () => {
  return fetchAPI('/admin/dashboard')
}

// Bookings
export const getBookings = async () => {
  return fetchAPI('/admin/bookings')
}

export const updateBookingStatus = async (id: number, status: string) => {
  return fetchAPI(`/admin/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

// Packages (Destinations)
export const getPackages = async () => {
  return fetchAPI('/admin/destinations')
}

export const createPackage = async (data: any) => {
  return fetchAPI('/admin/destinations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updatePackage = async (id: number, data: any) => {
  return fetchAPI(`/admin/destinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deletePackage = async (id: number) => {
  return fetchAPI(`/admin/destinations/${id}`, {
    method: 'DELETE',
  })
}

// Enquiries (Support)
export const getEnquiries = async () => {
  return fetchAPI('/admin/enquiries')
}

export const updateEnquiryStatus = async (id: number, status: string) => {
  return fetchAPI(`/admin/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

// Public endpoints
export const getPublicDestinations = async () => {
  return fetchAPI('/public/destinations')
}

export const submitBooking = async (data: any) => {
  return fetchAPI('/public/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const submitEnquiry = async (data: any) => {
  return fetchAPI('/public/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const getPublicBlogs = async () => {
  return fetchAPI('/public/blogs')
}

// Blogs (Admin)
export const getBlogs = async () => {
  return fetchAPI('/admin/blogs')
}

export const createBlog = async (data: any) => {
  return fetchAPI('/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateBlog = async (id: number, data: any) => {
  return fetchAPI(`/admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteBlog = async (id: number) => {
  return fetchAPI(`/admin/blogs/${id}`, {
    method: 'DELETE',
  })
}

// Contact Settings
export const getContactSettings = async () => {
  return fetchAPI('/admin/contact-settings')
}

export const updateContactSettings = async (data: any) => {
  return fetchAPI('/admin/contact-settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const getPublicContactSettings = async () => {
  return fetchAPI('/public/contact-settings')
}

// Packages (Admin)
export const getPackagesAdmin = async () => {
  return fetchAPI('/admin/packages')
}

export const createPackageAdmin = async (data: any) => {
  return fetchAPI('/admin/packages', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updatePackageAdmin = async (id: number, data: any) => {
  return fetchAPI(`/admin/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deletePackageAdmin = async (id: number) => {
  return fetchAPI(`/admin/packages/${id}`, {
    method: 'DELETE',
  })
}

// Promotions
export const getPromotions = async () => {
  return fetchAPI('/admin/promotions')
}

export const createPromotion = async (data: any) => {
  return fetchAPI('/admin/promotions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updatePromotion = async (id: number, data: any) => {
  return fetchAPI(`/admin/promotions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deletePromotion = async (id: number) => {
  return fetchAPI(`/admin/promotions/${id}`, {
    method: 'DELETE',
  })
}

export const getActivePromotion = async () => {
  return fetchAPI('/public/promotions')
}
