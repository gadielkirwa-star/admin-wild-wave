export const db = {
  stats: {
    totalBookings: 0,
    todayBookings: 0,
    weeklyBookings: 0,
    monthlyBookings: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    activeTours: 0,
    pendingPayments: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
    bookingGrowth: 0
  },
  
  recentBookings: [],

  packages: [],

  customers: [],

  payments: [],

  guides: [],

  vehicles: [],

  revenueData: [],

  countryData: []
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
