export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  read_time: string | null;
  published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  email: string;
  phone: string | null;
  safari_type: string | null;
  number_of_people: number | null;
  start_date: string | null;
  total_price: number | null;
  special_requests?: string | null;
  status: string;
  created_at: string;
}

export interface ContactSettings {
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  office_hours: string | null;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface DashboardCountryDatum {
  country: string;
  bookings: number;
  percentage: number;
}

export interface DashboardRevenueDatum {
  month: string;
  revenue: number | string;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  activeTours: number;
  bookingGrowth: number;
  revenueGrowth: number;
  recentBookings: Booking[];
  countryData: DashboardCountryDatum[];
  revenueData: DashboardRevenueDatum[];
}

export interface Destination {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  duration: string | null;
  image_url: string | null;
  category: string | null;
  country: string | null;
  tags: string | null;
  best_months: string | null;
  published?: boolean;
  created_at?: string;
}

export interface DestinationPayload {
  name: string;
  description: string;
  price: number;
  duration: string;
  image_url: string;
  category: string;
  country: string;
  tags: string;
  best_months: string;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

export interface Promotion {
  id: number;
  title: string;
  description: string | null;
  info_text: string | null;
  image_url: string | null;
  discount_text: string | null;
  button_text: string | null;
  button_link: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PromotionPayload {
  title: string;
  description: string;
  info_text: string;
  image_url: string;
  discount_text: string;
  button_text: string;
  button_link: string;
  active: boolean;
}

export interface SafariPackage {
  id: number;
  name: string;
  type: string | null;
  duration: string | null;
  price: number | null;
  description: string | null;
  image_url: string | null;
  tag: string | null;
  itinerary: string | null;
  includes: string | null;
  excludes: string | null;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SafariPackagePayload {
  name: string;
  duration: string;
  price: number;
  tag: string;
  type: string;
  image_url: string;
  description: string;
  itinerary: string;
  includes: string;
  excludes: string;
  published: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  role?: string | null;
  bio?: string | null;
  image_url?: string | null;
  active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMemberPayload {
  name: string;
  role: string;
  bio: string;
  image_url: string;
  active: boolean;
  display_order: number;
}

export interface UploadResponse {
  url?: string;
  path?: string;
  filename?: string;
}
