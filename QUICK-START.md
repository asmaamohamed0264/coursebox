# 🚀 Quick Start - Deployment Coursebox pe VPS

## 📦 Pași Rapizi

### 1. Pe VPS-ul tău

```bash
# Clonează proiectul
git clone https://github.com/varun442/AI-Course-Generator.git coursebox
cd coursebox

# Creează fișierul .env
cp .env.example .env
nano .env  # Completează cu valorile tale

# Dă permisiuni scripturilor
chmod +x deploy.sh setup-ssl.sh

# Configurează SSL (după ce DNS-ul point-ează către VPS)
./setup-ssl.sh

# Deploy aplicația
./deploy.sh
```

### 2. Variabile de Mediu Necesare (.env)

```bash
# Database
POSTGRES_USER=coursebox_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=coursebox_db

# Clerk (obține de la https://clerk.com)
NEXT_PUBLIC_CLERK_FRONTEND_API=pk_live_...
CLERK_API_KEY=sk_live_...
CLERK_SECRET_KEY=sk_live_...

# Gemini AI (obține de la https://ai.google.dev)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key

# YouTube (obține de la https://console.cloud.google.com)
YOUTUBE_API_KEY=your_youtube_key

# Site URL
NEXT_PUBLIC_SITE_URL=https://curs.qub3.uk
```

### 3. Verifică DNS

Asigură-te că `curs.qub3.uk` point-ează către IP-ul VPS-ului:

```bash
dig curs.qub3.uk +short
# Ar trebui să returneze IP-ul VPS-ului
```

### 4. Verifică Aplicația

După deployment, accesează: **https://curs.qub3.uk**

## ⚡ Comenzi Rapide

```bash
# Status
docker-compose ps

# Log-uri
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Update
git pull && ./deploy.sh
```

## 🔧 Dacă ceva nu funcționează

1. Verifică log-urile: `docker-compose logs`
2. Verifică DNS-ul: `dig curs.qub3.uk`
3. Verifică porturile: `netstat -tlnp | grep -E ':(80|443|3000)'`
4. Verifică SSL: `ls -la nginx/ssl/`

