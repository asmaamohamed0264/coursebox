# 🚀 Configurare Dokploy - Coursebox

## ✅ Status Configurare

- ✅ **Proiect creat:** Coursebox (ID: `gKooXuVJr-wV2kW5lHPXZ`)
- ✅ **Environment creat:** production (ID: `tCS4zadT3YLwWsT9qBlzj`)
- ✅ **Aplicație creată:** Coursebox App (ID: `N1PRgXPwPvPg4ZaI2Ix36`)
- ✅ **Domeniu creat:** curs.qub3.uk cu Let's Encrypt SSL

## 📋 Pași Rămași de Configurare în Dokploy UI

### 1. Configurare GitHub Provider

În panoul Dokploy, pentru aplicația "Coursebox App":

1. Mergi la **Source Settings** sau **Git Provider**
2. Configurează:
   - **Provider:** GitHub
   - **Owner:** `asmaamohamed0264`
   - **Repository:** `coursebox`
   - **Branch:** `main`
   - **Build Path:** `/`

### 2. Configurare Build Type

1. Mergi la **Build Settings**
2. Configurează:
   - **Build Type:** `Dockerfile`
   - **Docker Context Path:** `.`
   - **Dockerfile:** `Dockerfile` (sau lasă implicit)

### 3. Environment Variables

În secțiunea **Environment Variables**, adaugă:

```env
NODE_ENV=production

# Database
DATABASE_URL=postgresql://coursebox_user:YOUR_PASSWORD@postgres:5432/coursebox_db
NEXT_PUBLIC_DB_CONNECTION_STRING=postgresql://coursebox_user:YOUR_PASSWORD@postgres:5432/coursebox_db

# Clerk Authentication
NEXT_PUBLIC_CLERK_FRONTEND_API=pk_live_YOUR_KEY
CLERK_API_KEY=sk_live_YOUR_KEY
CLERK_SECRET_KEY=sk_live_YOUR_SECRET

# Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# Site URL
NEXT_PUBLIC_SITE_URL=https://curs.qub3.uk
```

### 4. Database PostgreSQL

Creează o bază de date PostgreSQL în același proiect:

1. Mergi la **Databases** → **PostgreSQL**
2. Creează:
   - **Name:** Coursebox Database
   - **Database Name:** `coursebox_db`
   - **User:** `coursebox_user`
   - **Password:** (alege o parolă sigură)

3. Folosește credențialele în `DATABASE_URL` din environment variables

### 5. Deployment

După configurare:

1. Mergi la **Deployments**
2. Click pe **Deploy** sau **Redeploy**
3. Așteaptă ca build-ul să se finalizeze

## 🔗 Link-uri Utile

- **Dokploy Dashboard:** [Accesează panoul Dokploy]
- **GitHub Repository:** https://github.com/asmaamohamed0264/coursebox
- **Aplicație URL:** https://curs.qub3.uk (după deployment)

## 📝 Notițe

- Domeniul `curs.qub3.uk` este deja configurat cu Let's Encrypt SSL
- Auto-deploy este activat - fiecare push pe branch-ul `main` va declanșa un deployment automat
- Aplicația va rula pe portul 3000 (configurat în domeniu)

## 🆘 Troubleshooting

### Build eșuează
- Verifică că Dockerfile există în root
- Verifică environment variables
- Verifică log-urile din Dokploy

### Aplicația nu pornește
- Verifică conexiunea la baza de date
- Verifică environment variables (mai ales DATABASE_URL)
- Verifică log-urile aplicației în Dokploy

### Domeniul nu funcționează
- Verifică DNS - `curs.qub3.uk` trebuie să point-eze către server-ul Dokploy
- Verifică configurația SSL în Dokploy
- Verifică că aplicația rulează

