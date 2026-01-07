# Deployment Guide - Coursebox pe VPS

Acest ghid vă va ajuta să deploy-ați aplicația Coursebox pe VPS-ul dvs. cu domeniul `curs.qub3.uk`.

## 📋 Cerințe Preliminare

1. **VPS cu Docker și Docker Compose instalat**
2. **Domeniu configurat** (curs.qub3.uk) care point-ează către IP-ul VPS-ului
3. **Porturile deschise**: 80 (HTTP), 443 (HTTPS), 22 (SSH)

## 🚀 Pași de Deployment

### 1. Pregătirea VPS-ului

```bash
# Conectează-te la VPS
ssh user@your-vps-ip

# Instalează Docker (dacă nu este deja instalat)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalează Docker Compose
apt-get update
apt-get install -y docker-compose-plugin

# Verifică instalarea
docker --version
docker compose version
```

### 2. Clonează Proiectul

```bash
# Clonează repository-ul
git clone https://github.com/varun442/AI-Course-Generator.git coursebox
cd coursebox
```

### 3. Configurează Variabilele de Mediu

```bash
# Copiază fișierul .env.example
cp .env.example .env

# Editează .env și completează cu valorile tale
nano .env
```

**Variabile obligatorii de completat:**
- `POSTGRES_PASSWORD` - Parolă sigură pentru PostgreSQL
- `NEXT_PUBLIC_CLERK_FRONTEND_API` - Cheia Clerk Frontend API
- `CLERK_API_KEY` - Cheia Clerk API
- `CLERK_SECRET_KEY` - Cheia secretă Clerk
- `NEXT_PUBLIC_GEMINI_API_KEY` - Cheia Gemini API
- `YOUTUBE_API_KEY` - Cheia YouTube API

### 4. Configurare DNS

Asigură-te că DNS-ul pentru `curs.qub3.uk` este configurat:

```
Type: A
Name: curs
Value: IP-ul_VPS-ului
TTL: 3600
```

Verifică configurația:
```bash
dig curs.qub3.uk
# sau
nslookup curs.qub3.uk
```

### 5. Setare SSL Certificate (Let's Encrypt)

**Opțiunea 1: Automat (Recomandat)**

```bash
# Modifică email-ul din setup-ssl.sh
nano setup-ssl.sh

# Rulează scriptul
chmod +x setup-ssl.sh
./setup-ssl.sh
```

**Opțiunea 2: Manual**

```bash
# Instalează certbot
apt-get update
apt-get install -y certbot

# Oprește nginx temporar
docker-compose stop nginx

# Obține certificatul
certbot certonly --standalone -d curs.qub3.uk -d www.curs.qub3.uk

# Copiază certificatul
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/curs.qub3.uk/fullchain.pem nginx/ssl/curs.qub3.uk.crt
cp /etc/letsencrypt/live/curs.qub3.uk/privkey.pem nginx/ssl/curs.qub3.uk.key
chmod 644 nginx/ssl/curs.qub3.uk.crt
chmod 600 nginx/ssl/curs.qub3.uk.key
```

### 6. Deploy Aplicația

```bash
# Dă permisiuni de execuție scriptului
chmod +x deploy.sh

# Rulează deployment-ul
./deploy.sh
```

Sau manual:
```bash
docker-compose build
docker-compose up -d
```

### 7. Rulează Migrațiile Bazei de Date

```bash
# Așteaptă ca PostgreSQL să fie gata
sleep 10

# Rulează migrațiile
docker-compose exec nextjs npm run db:push
```

### 8. Verifică Statusul

```bash
# Verifică statusul containerelor
docker-compose ps

# Verifică log-urile
docker-compose logs -f nextjs

# Testează aplicația
curl https://curs.qub3.uk
```

## 🔧 Comenzi Utile

```bash
# Oprește aplicația
docker-compose down

# Pornește aplicația
docker-compose up -d

# Reîncarcă configurația (după modificări)
docker-compose restart nginx

# Vezi log-urile
docker-compose logs -f [service-name]

# Accesează shell-ul unui container
docker-compose exec nextjs sh
docker-compose exec postgres psql -U coursebox_user -d coursebox_db

# Reconstruiește aplicația
docker-compose build --no-cache
docker-compose up -d
```

## 🔄 Actualizare Aplicație

```bash
# Opțiunea 1: Folosind scriptul
./deploy.sh

# Opțiunea 2: Manual
git pull origin main
docker-compose build --no-cache
docker-compose up -d
docker-compose exec nextjs npm run db:push
```

## 🔐 Securitate

1. **Schimbă parolele default** din `.env`
2. **Configurează firewall** (UFW):
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```
3. **Auto-renewal SSL**: Adaugă cron job pentru reînnoirea automată:
   ```bash
   crontab -e
   # Adaugă linia:
   0 0 * * * certbot renew --quiet && docker-compose restart nginx
   ```

## 📊 Monitorizare

```bash
# Utilizare resurse
docker stats

# Log-uri în timp real
docker-compose logs -f

# Status servicii
docker-compose ps
```

## 🐛 Troubleshooting

### Containerul nu pornește
```bash
docker-compose logs nextjs
docker-compose logs postgres
```

### Eroare de conexiune la baza de date
- Verifică că PostgreSQL este pornit: `docker-compose ps postgres`
- Verifică variabilele de mediu: `docker-compose exec nextjs env | grep DATABASE`

### SSL Certificate expirat
```bash
certbot renew
cp /etc/letsencrypt/live/curs.qub3.uk/fullchain.pem nginx/ssl/curs.qub3.uk.crt
cp /etc/letsencrypt/live/curs.qub3.uk/privkey.pem nginx/ssl/curs.qub3.uk.key
docker-compose restart nginx
```

### Portul 80/443 este deja folosit
```bash
# Verifică ce folosește portul
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Oprește serviciul conflictual sau modifică porturile în docker-compose.yml
```

## 📝 Notițe

- Baza de date PostgreSQL este persistentă (volum Docker: `postgres_data`)
- Pentru backup baza de date:
  ```bash
  docker-compose exec postgres pg_dump -U coursebox_user coursebox_db > backup.sql
  ```
- Pentru restore:
  ```bash
  docker-compose exec -T postgres psql -U coursebox_user coursebox_db < backup.sql
  ```

## 🆘 Suport

Pentru probleme sau întrebări, verifică:
- Log-urile aplicației: `docker-compose logs`
- Status containerelor: `docker-compose ps`
- Configurația Nginx: `nginx/conf.d/coursebox.conf`

