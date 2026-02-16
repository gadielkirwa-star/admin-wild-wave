#!/bin/bash

echo "🚀 WildWave Admin - Vercel Deployment Script"
echo "=============================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is ready"
echo ""

# Navigate to admin directory
cd "$(dirname "$0")"

echo "📋 Current directory: $(pwd)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building project..."
npm run build

echo ""
echo "🚀 Deploying to Vercel..."
echo ""
echo "Choose deployment type:"
echo "1) Preview deployment (for testing)"
echo "2) Production deployment"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "2" ]; then
    echo "🌐 Deploying to production..."
    vercel --prod
else
    echo "🔍 Creating preview deployment..."
    vercel
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Login credentials:"
echo "   Email: admin@wildwave.com"
echo "   Password: admin123"
echo ""
