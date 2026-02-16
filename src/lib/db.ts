export const db = {
  stats: {
    totalBookings: 156,
    todayBookings: 8,
    weeklyBookings: 42,
    monthlyBookings: 156,
    totalRevenue: 487500,
    todayRevenue: 12800,
    weeklyRevenue: 89400,
    monthlyRevenue: 487500,
    activeTours: 23,
    pendingPayments: 12,
    totalCustomers: 342,
    revenueGrowth: 23.5,
    bookingGrowth: 18.2
  },
  
  recentBookings: [
    { id: '1', ref: 'WS-2026-156', customer: 'Sarah Johnson', email: 'sarah@example.com', package: 'Masai Mara Luxury', people: 4, amount: 8500, status: 'confirmed', date: '2026-03-15', guide: 'Daniel Kipchoge' },
    { id: '2', ref: 'WS-2026-155', customer: 'Michael Chen', email: 'michael@example.com', package: 'Serengeti Adventure', people: 2, amount: 5200, status: 'pending', date: '2026-03-14', guide: 'Unassigned' },
    { id: '3', ref: 'WS-2026-154', customer: 'Emma Williams', email: 'emma@example.com', package: 'Gorilla Trekking', people: 1, amount: 4200, status: 'confirmed', date: '2026-03-14', guide: 'Joseph Mutebi' },
    { id: '4', ref: 'WS-2026-153', customer: 'James Brown', email: 'james@example.com', package: 'Beach & Bush', people: 6, amount: 12600, status: 'completed', date: '2026-03-13', guide: 'Grace Wanjiku' },
    { id: '5', ref: 'WS-2026-152', customer: 'Lisa Anderson', email: 'lisa@example.com', package: 'Balloon Safari', people: 2, amount: 5500, status: 'confirmed', date: '2026-03-12', guide: 'Daniel Kipchoge' }
  ],

  packages: [
    { id: '1', name: 'Masai Mara Luxury Safari', duration: '7 days', price: 2800, category: 'Luxury', bookings: 45, revenue: 126000, status: 'active', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801' },
    { id: '2', name: 'Serengeti Adventure', duration: '10 days', price: 4500, category: 'Premium', bookings: 38, revenue: 171000, status: 'active', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e' },
    { id: '3', name: 'Gorilla Trekking Expedition', duration: '5 days', price: 4200, category: 'Exclusive', bookings: 28, revenue: 117600, status: 'active', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44' },
    { id: '4', name: 'Beach & Bush Combo', duration: '12 days', price: 3600, category: 'Value', bookings: 32, revenue: 115200, status: 'active', image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f' },
    { id: '5', name: 'Balloon Safari Experience', duration: '10 days', price: 5500, category: 'Premium', bookings: 13, revenue: 71500, status: 'active', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801' }
  ],

  customers: [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 555 0101', country: 'USA', totalBookings: 3, totalSpent: 15400, joinedDate: '2026-01-15' },
    { id: '2', name: 'Michael Chen', email: 'michael@example.com', phone: '+44 20 1234', country: 'UK', totalBookings: 1, totalSpent: 5200, joinedDate: '2026-02-20' },
    { id: '3', name: 'Emma Williams', email: 'emma@example.com', phone: '+61 2 9876', country: 'Australia', totalBookings: 2, totalSpent: 8400, joinedDate: '2026-03-10' },
    { id: '4', name: 'James Brown', email: 'james@example.com', phone: '+1 555 0202', country: 'Canada', totalBookings: 4, totalSpent: 12600, joinedDate: '2025-11-05' },
    { id: '5', name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+49 30 1234', country: 'Germany', totalBookings: 2, totalSpent: 5800, joinedDate: '2026-01-28' }
  ],

  payments: [
    { id: '1', transactionId: 'TXN-2026-001', customerName: 'Sarah Johnson', amount: 8500, method: 'Credit Card', status: 'completed', date: '2026-03-15' },
    { id: '2', transactionId: 'TXN-2026-002', customerName: 'Michael Chen', amount: 5200, method: 'PayPal', status: 'pending', date: '2026-03-14' },
    { id: '3', transactionId: 'TXN-2026-003', customerName: 'Emma Williams', amount: 4200, method: 'Bank Transfer', status: 'completed', date: '2026-03-14' },
    { id: '4', transactionId: 'TXN-2026-004', customerName: 'James Brown', amount: 12600, method: 'Credit Card', status: 'completed', date: '2026-03-13' },
    { id: '5', transactionId: 'TXN-2026-005', customerName: 'Lisa Anderson', amount: 5500, method: 'PayPal', status: 'completed', date: '2026-03-12' },
    { id: '6', transactionId: 'TXN-2026-006', customerName: 'Sarah Johnson', amount: 6900, method: 'Credit Card', status: 'pending', date: '2026-03-11' }
  ],

  guides: [
    { id: '1', name: 'Daniel Kipchoge', specialization: 'Big Five Safari', rating: 4.9, tours: 234, status: 'available', phone: '+254 712 345 678', email: 'daniel@wildwave.com', languages: ['English', 'Swahili', 'German'] },
    { id: '2', name: 'Joseph Mutebi', specialization: 'Gorilla Trekking', rating: 4.8, tours: 189, status: 'on-tour', phone: '+256 772 123 456', email: 'joseph@wildwave.com', languages: ['English', 'Luganda', 'French'] },
    { id: '3', name: 'Grace Wanjiku', specialization: 'Cultural Tours', rating: 4.9, tours: 156, status: 'available', phone: '+254 723 456 789', email: 'grace@wildwave.com', languages: ['English', 'Swahili', 'Kikuyu'] },
    { id: '4', name: 'Samuel Omondi', specialization: 'Bird Watching', rating: 4.7, tours: 142, status: 'available', phone: '+254 734 567 890', email: 'samuel@wildwave.com', languages: ['English', 'Swahili'] }
  ],

  vehicles: [
    { id: '1', model: 'Toyota Land Cruiser V8', type: '4x4 Safari Vehicle', plateNumber: 'KBZ 456A', capacity: 7, year: 2022, mileage: 45000, status: 'available' },
    { id: '2', model: 'Land Rover Defender 110', type: '4x4 Safari Vehicle', plateNumber: 'KCA 789B', capacity: 8, year: 2023, mileage: 28000, status: 'in-use' },
    { id: '3', model: 'Toyota Hilux Double Cab', type: 'Support Vehicle', plateNumber: 'KCB 123C', capacity: 5, year: 2021, mileage: 67000, status: 'maintenance' },
    { id: '4', model: 'Nissan Patrol', type: '4x4 Safari Vehicle', plateNumber: 'KCD 234D', capacity: 7, year: 2022, mileage: 52000, status: 'available' }
  ],

  revenueData: [
    { month: 'Oct', revenue: 45000, bookings: 28 },
    { month: 'Nov', revenue: 52000, bookings: 32 },
    { month: 'Dec', revenue: 68000, bookings: 41 },
    { month: 'Jan', revenue: 58000, bookings: 35 },
    { month: 'Feb', revenue: 72000, bookings: 44 },
    { month: 'Mar', revenue: 89000, bookings: 52 }
  ],

  countryData: [
    { country: 'Kenya', bookings: 52, percentage: 33.3 },
    { country: 'Tanzania', bookings: 45, percentage: 28.8 },
    { country: 'Uganda', bookings: 32, percentage: 20.5 },
    { country: 'Rwanda', bookings: 18, percentage: 11.5 },
    { country: 'Others', bookings: 9, percentage: 5.9 }
  ]
}

export const updateBookingStatus = (id: string, status: string) => {
  const booking = db.recentBookings.find(b => b.id === id)
  if (booking) booking.status = status
}

export const assignGuide = (bookingId: string, guide: string) => {
  const booking = db.recentBookings.find(b => b.id === bookingId)
  if (booking) booking.guide = guide
}

export const { customers, payments, guides, vehicles } = db;
