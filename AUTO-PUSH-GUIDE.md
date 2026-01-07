# 🚀 Ghid Push Automat GitHub

Acest proiect este configurat pentru push automat la GitHub. Iată toate opțiunile disponibile:

## ✅ Configurație Activă

1. **Git Hook automat** - Push automat după fiecare commit
2. **Scripturi manuale** - Pentru control mai fin
3. **NPM scripts** - Pentru integrare în workflow

## 📋 Opțiuni de Push Automat

### 1. Push Automat După Commit (ACTIVAT)

Hook-ul Git este deja configurat. **Fiecare commit va face push automat la GitHub:**

```bash
git add .
git commit -m "Mesaj commit"
# Push automat se face în background!
```

### 2. Script Manual - Linux/Mac

```bash
# Dă permisiuni de execuție (o singură dată)
chmod +x auto-push.sh

# Rulează scriptul
./auto-push.sh
```

Acest script va:
- Adăuga automat toate modificările
- Crea un commit automat cu timestamp
- Face push la GitHub

### 3. Script Manual - Windows PowerShell

```powershell
# Rulează scriptul
.\auto-push.ps1
```

### 4. NPM Scripts

```bash
# Push automat cu commit
npm run push

# Push forțat (folosește cu atenție!)
npm run push:force
```

## 🔧 Configurare Git Globală

Configurațiile de mai jos sunt deja setate:

```bash
git config --global push.autoSetupRemote true  # Setup remote automat
git config --global push.default simple        # Push doar branch-ul curent
```

## ⚙️ Dezactivare Push Automat (dacă e necesar)

Dacă vrei să dezactivezi push-ul automat după commit:

```bash
# Șterge hook-ul
rm .git/hooks/post-commit

# Sau redenumește-l
mv .git/hooks/post-commit .git/hooks/post-commit.disabled
```

## 📝 Exemple de Utilizare

### Workflow Normal

```bash
# 1. Modifică fișiere
nano app/page.js

# 2. Commit (push automat se face!)
git add .
git commit -m "Update homepage"

# Gata! Push-ul s-a făcut automat
```

### Workflow cu Script Manual

```bash
# Modifică fișiere
# ...

# Rulează scriptul (face totul: add, commit, push)
./auto-push.sh
# sau
npm run push
```

### Push Manual (dacă ai nevoie)

```bash
git push origin main
```

## 🔍 Verificare Status

```bash
# Verifică dacă hook-ul este activ
ls -la .git/hooks/post-commit

# Verifică configurația Git
git config --list | grep push

# Verifică status
git status
```

## ⚠️ Note Importante

1. **Hook-ul funcționează doar local** - Push-ul automat se face doar când faci commit local
2. **Nu funcționează cu `git commit --no-verify`** - Pentru a ocoli hook-urile
3. **Dacă push-ul eșuează** - Hook-ul va afișa eroarea, dar commit-ul local rămâne
4. **Scripturile manuale** pot fi folosite oricând pentru control total

## 🆘 Troubleshooting

### Hook-ul nu funcționează
```bash
# Verifică permisiuni
chmod +x .git/hooks/post-commit

# Verifică dacă fișierul există
cat .git/hooks/post-commit
```

### Push eșuează
```bash
# Verifică conexiunea la GitHub
git remote -v

# Verifică autentificare
git push origin main -v
```

### Vrei să faci commit fără push
```bash
git commit --no-verify -m "Mesaj"
# Sau dezactivează hook-ul temporar
```

## 📚 Resurse

- Repository GitHub: https://github.com/asmaamohamed0264/coursebox
- Documentație Git Hooks: https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks

