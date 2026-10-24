#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

echo "🚀 Starting deployment..."

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

echo "📂 Copying static files..."
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

echo "♻️  Restarting application..."
pm2 startOrReload ecosystem.config.js --update-env
pm2 save

echo "✅ Deployment complete!"
pm2 status
