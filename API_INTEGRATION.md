# API Integration Guide

## Overview
This document explains how the WildWave Admin Dashboard connects to the backend API and database.

## Architecture

```
Frontend (React Admin) <---> Backend API (Express) <---> Database (PostgreSQL)
     Port 3000                    Port 5000                  Port 5432
```

## Configuration

### Admin Dashboard (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://wildwave_user:wildwave_pass@localhost:5432/wildwave_safaris
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## API Endpoints Used by Admin

### Authentication
- `POST /api/auth/login` - Admin login
  - Request: `{ email, password }`
  - Response: `{ token, user: { id, name, email, role } }`

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
  - Response: `{ totalBookings, totalRevenue, activeTours, totalCustomers, revenueData, countryData, recentBookings }`

### Bookings
- `GET /api/admin/bookings` - List all bookings
- `PUT /api/admin/bookings/:id` - Update booking status
  - Request: `{ status: 'pending' | 'confirmed' | 'cancelled' }`

### Packages (Destinations)
- `GET /api/admin/destinations` - List all destinations
- `POST /api/admin/destinations` - Create new destination
- `PUT /api/admin/destinations/:id` - Update destination
- `DELETE /api/admin/destinations/:id` - Delete destination

### Enquiries (Support)
- `GET /api/admin/enquiries` - List all enquiries
- `PUT /api/admin/enquiries/:id` - Update enquiry status
  - Request: `{ status: 'new' | 'in-progress' | 'resolved' }`

## Authentication Flow

1. User enters credentials on login page
2. Admin calls `POST /api/auth/login`
3. Backend validates credentials against database
4. Backend returns JWT token
5. Admin stores token in localStorage
6. All subsequent API calls include token in Authorization header: `Bearer <token>`

## Data Flow Example

### Dashboard Load
```javascript
// 1. Component mounts
useEffect(() => {
  loadDashboard()
}, [])

// 2. Fetch data from API
const loadDashboard = async () => {
  const data = await api.getDashboardStats()
  setStats(data)
}

// 3. API call with auth token
const getDashboardStats = async () => {
  return fetchAPI('/admin/dashboard') // Includes Bearer token
}

// 4. Backend queries database
router.get('/dashboard', authenticate, async (req, res) => {
  const bookings = await pool.query('SELECT COUNT(*) FROM bookings')
  // ... more queries
  res.json({ totalBookings, totalRevenue, ... })
})
```

## Error Handling

### Frontend
- Network errors: Display error message to user
- 401 Unauthorized: Redirect to login page
- 403 Forbidden: Show access denied message
- 500 Server Error: Show generic error message

### Backend
- Validates all inputs
- Returns appropriate HTTP status codes
- Includes error messages in response

## Security

### JWT Token
- Stored in localStorage
- Included in Authorization header
- Expires after 24 hours
- Validated on every protected route

### CORS
- Backend allows requests from admin dashboard origin
- Credentials included in requests

### Password Security
- Passwords hashed with bcrypt (12 rounds)
- Never stored in plain text
- Never returned in API responses

## Testing API Connection

### 1. Check Backend Health
```bash
curl http://localhost:5000/health
# Expected: {"status":"OK"}
```

### 2. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wildwavesafaris.com","password":"admin123"}'
# Expected: {"token":"...", "user":{...}}
```

### 3. Test Protected Route
```bash
TOKEN="your-token-here"
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
# Expected: Dashboard statistics
```

## Troubleshooting

### Admin can't connect to backend
1. Check backend is running: `curl http://localhost:5000/health`
2. Check VITE_API_URL in admin/.env
3. Check CORS configuration in backend
4. Check browser console for errors

### Login fails
1. Verify credentials in database
2. Check JWT_SECRET is set in backend/.env
3. Check password hashing is working
4. Check database connection

### Data not loading
1. Check auth token is stored: `localStorage.getItem('authToken')`
2. Check token is valid (not expired)
3. Check API endpoints are correct
4. Check database has data

### CORS errors
1. Ensure backend has CORS middleware
2. Check allowed origins include admin URL
3. Check credentials are included in requests

## Development Workflow

### Starting Services
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Admin
cd admin
npm run dev

# Terminal 3: Database (if not running)
sudo service postgresql start
```

### Making API Changes
1. Update backend route
2. Update API service in admin/src/lib/api.ts
3. Update component to use new data structure
4. Test end-to-end

## Production Deployment

### Environment Variables
- Set VITE_API_URL to production backend URL
- Set DATABASE_URL to production database
- Set JWT_SECRET to secure random string
- Set NODE_ENV=production

### CORS Configuration
- Update allowed origins to include production admin URL
- Remove development origins

### Database
- Run migrations
- Seed initial admin user
- Set up backups

## API Response Formats

### Success Response
```json
{
  "data": { ... },
  "message": "Success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

### Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Performance Optimization

### Caching
- Dashboard stats cached for 5 minutes
- Destination list cached for 10 minutes
- Invalidate cache on data changes

### Lazy Loading
- Load data only when needed
- Paginate large lists
- Use infinite scroll for long lists

### Debouncing
- Search inputs debounced 300ms
- Auto-save debounced 1000ms

## Monitoring

### Metrics to Track
- API response times
- Error rates
- Authentication failures
- Database query performance

### Logging
- All API requests logged
- Errors logged with stack traces
- Admin actions logged for audit trail
