#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt (Certbot)
# This script helps set up SSL certificates for curs.qub3.uk

set -e

DOMAIN="curs.qub3.uk"
EMAIL="your-email@example.com"  # Change this to your email

echo "🔐 Setting up SSL certificates for $DOMAIN..."

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    apt-get update
    apt-get install -y certbot
fi

# Stop nginx temporarily for standalone mode
echo "🛑 Stopping nginx temporarily..."
docker-compose stop nginx

# Obtain certificate
echo "📜 Obtaining SSL certificate..."
certbot certonly --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --non-interactive

# Copy certificates to nginx/ssl directory
echo "📋 Copying certificates..."
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/$DOMAIN.crt
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/$DOMAIN.key
chmod 644 nginx/ssl/$DOMAIN.crt
chmod 600 nginx/ssl/$DOMAIN.key

# Restart nginx
echo "🔄 Restarting nginx..."
docker-compose start nginx

echo "✅ SSL certificates set up successfully!"
echo ""
echo "⚠️  Don't forget to:"
echo "1. Update .env.example with your actual email"
echo "2. Set up auto-renewal: certbot renew --dry-run"
echo "3. Add cron job for renewal: 0 0 * * * certbot renew --quiet && docker-compose restart nginx"

