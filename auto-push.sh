#!/bin/bash

# Script pentru push automat la GitHub
# Rulează acest script după fiecare commit sau configurează-l să ruleze automat

set -e

echo "🔄 Verificare modificări..."

# Verifică dacă există modificări
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Găsite modificări, adaug în staging..."
    git add .
    
    echo "💾 Creare commit..."
    git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S') - $(git status --short | head -1 | cut -c4- | sed 's/.*\///')" || {
        echo "⚠️ Nu s-au putut face modificări (posibil commit gol)"
        exit 0
    }
else
    echo "✅ Nu există modificări de commit"
fi

# Verifică dacă există commit-uri de push
if [ -n "$(git log origin/main..HEAD 2>/dev/null)" ]; then
    echo "🚀 Push la GitHub..."
    git push origin main
    echo "✅ Push completat cu succes!"
else
    echo "ℹ️ Nu există commit-uri noi pentru push"
fi

