# WildWave Admin Dashboard - Vercel Deployment

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## Manual Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Admin Directory
```bash
cd admin
vercel
```

### 4. Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **wildwave-admin** (or your choice)
- Directory? **./** (current directory)
- Override settings? **N**

### 5. Production Deployment
```bash
vercel --prod
```

## Environment Variables

No environment variables needed for the current setup as it uses in-memory data.

For production with backend API, add these in Vercel Dashboard:
- `VITE_API_URL` - Your backend API URL

## Build Configuration

The project uses:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Post-Deployment

After deployment, you'll receive a URL like:
- **Preview**: `https://wildwave-admin-xxx.vercel.app`
- **Production**: `https://wildwave-admin.vercel.app`

## Login Credentials

- **Email**: admin@wildwave.com
- **Password**: admin123

## Features Deployed

✅ Complete admin dashboard
✅ Authentication system
✅ Bookings management
✅ Tour packages management
✅ Customer management
✅ Payment tracking
✅ Guides & vehicles management
✅ Support ticket system
✅ Admin user management
✅ Settings panel
✅ Dark mode support
✅ PDF/CSV export functionality

## Troubleshooting

### Build Fails
- Check `package.json` has all dependencies
- Ensure Node version is 18.x or higher

### Routes Not Working
- Vercel.json includes SPA rewrites
- All routes redirect to index.html

### Images Not Loading
- Check image URLs are absolute
- Verify CORS settings if using external images

## Support

For deployment issues, contact:
- Email: wildwavesafaris@gmail.com
- Phone: +254 713 241 666
