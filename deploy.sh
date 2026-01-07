#!/bin/bash

# Deployment script for Coursebox on VPS
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment for Coursebox..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file from .env.example and fill in your configuration."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
fi

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose build --no-cache
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec -T nextjs npm run db:push || echo "⚠️ Database migration may need manual attention"

# Show logs
echo "📋 Container status:"
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 Your application should be available at: https://curs.qub3.uk"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"

