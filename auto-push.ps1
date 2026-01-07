# Script PowerShell pentru push automat la GitHub
# Rulează acest script după fiecare commit sau configurează-l să ruleze automat

Write-Host "🔄 Verificare modificări..." -ForegroundColor Cyan

# Verifică dacă există modificări
$changes = git status --porcelain
if ($changes) {
    Write-Host "📝 Găsite modificări, adaug în staging..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Creare commit..." -ForegroundColor Yellow
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $firstChange = (git status --short | Select-Object -First 1 | ForEach-Object { $_.Substring(3) })
    git commit -m "Auto-commit: $timestamp - $firstChange" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ Nu s-au putut face modificări (posibil commit gol)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Nu există modificări de commit" -ForegroundColor Green
}

# Verifică dacă există commit-uri de push
$commitsToPush = git log origin/main..HEAD 2>&1
if ($commitsToPush -and -not ($commitsToPush -match "fatal")) {
    Write-Host "🚀 Push la GitHub..." -ForegroundColor Cyan
    git push origin main
    Write-Host "✅ Push completat cu succes!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Nu există commit-uri noi pentru push" -ForegroundColor Blue
}

