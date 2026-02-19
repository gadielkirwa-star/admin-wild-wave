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

  guides: [
    {
      id: 1,
      name: 'Daniel Kiptoo',
      specialization: 'Big Five & Birding',
      rating: 4.9,
      tours: 186,
      phone: '+254 700 111 222',
      email: 'daniel@wildwavesafaris.com',
      languages: ['English', 'Swahili'],
      status: 'available'
    },
    {
      id: 2,
      name: 'Amina Njoroge',
      specialization: 'Family Safaris',
      rating: 4.8,
      tours: 142,
      phone: '+254 700 222 333',
      email: 'amina@wildwavesafaris.com',
      languages: ['English', 'French', 'Swahili'],
      status: 'on-tour'
    },
    {
      id: 3,
      name: 'Peter Mutesi',
      specialization: 'Gorilla Trekking',
      rating: 4.9,
      tours: 121,
      phone: '+254 700 333 444',
      email: 'peter@wildwavesafaris.com',
      languages: ['English', 'Kinyarwanda'],
      status: 'available'
    }
  ],

  vehicles: [
    {
      id: 1,
      model: 'Toyota Land Cruiser',
      type: '4x4 Safari Jeep',
      plateNumber: 'KDA 102A',
      capacity: 6,
      year: 2022,
      mileage: 45600,
      status: 'available'
    },
    {
      id: 2,
      model: 'Land Rover Defender',
      type: '4x4 Safari Jeep',
      plateNumber: 'KDB 221F',
      capacity: 6,
      year: 2021,
      mileage: 62400,
      status: 'in-use'
    },
    {
      id: 3,
      model: 'Toyota Hiace',
      type: 'Safari Van',
      plateNumber: 'KDC 332H',
      capacity: 9,
      year: 2020,
      mileage: 88200,
      status: 'maintenance'
    }
  ],

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
