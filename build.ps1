# Scripts helper pour EAS Build
# Sauvegarde ce fichier comme build.ps1

# Couleurs pour la console
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }

# Menu principal
function Show-Menu {
    Clear-Host
    Write-Info "═══════════════════════════════════════"
    Write-Info "    EAS Build Helper - MyLife App     "
    Write-Info "═══════════════════════════════════════"
    Write-Host ""
    Write-Host "1. 🚀 Build APK Production (pour distribution)"
    Write-Host "2. 🔄 Update OTA rapide (sans rebuild)"
    Write-Host "3. 🧪 Build APK Preview (pour test)"
    Write-Host "4. 📦 Build AAB Play Store"
    Write-Host "5. 📋 Lister les builds"
    Write-Host "6. 📊 Vérifier les updates"
    Write-Host "7. 🔧 Setup EAS (première fois)"
    Write-Host "8. ❌ Quitter"
    Write-Host ""
}

# Build APK Production
function Invoke-ProductionAPKBuild {
    Write-Info "🚀 Building APK Production..."
    Write-Host ""
    
    # Demander message de build
    $message = Read-Host "Message de build"
    
    Write-Info "Lancement du build..."
    eas build --platform android --profile production-apk --message "$message"
    
    Write-Success "✅ Build terminé ! Télécharge l'APK depuis : https://expo.dev"
    Read-Host "Appuyer sur Entrée pour continuer"
}

# Update OTA
function Publish-OTAUpdate {
    Write-Info "🔄 Publication d'une mise à jour OTA..."
    Write-Host ""
    
    $message = Read-Host "Message de la mise à jour"
    
    Write-Info "Publication..."
    eas update --branch production --message "$message"
    
    Write-Success "✅ Mise à jour publiée ! Les utilisateurs la recevront au prochain démarrage."
    Read-Host "Appuyer sur Entrée pour continuer"
}

# Build Preview
function Invoke-PreviewAPKBuild {
    Write-Info "🧪 Building APK Preview..."
    Write-Host ""
    
    $message = Read-Host "Message de build (optionnel)"
    
    Write-Info "Lancement du build..."
    if ($message) {
        eas build --platform android --profile preview --message "$message"
    } else {
        eas build --platform android --profile preview
    }
    
    Write-Success "✅ Build terminé !"
    Read-Host "Appuyer sur Entrée pour continuer"
}

# Build AAB
function Invoke-PlayStoreAABBuild {
    Write-Info "📦 Building AAB pour Play Store..."
    Write-Host ""
    
    Write-Host "⚠️  Ce build est pour le Google Play Store uniquement."
    $confirm = Read-Host "Continuer ? (O/N)"
    
    if ($confirm -eq "O" -or $confirm -eq "o") {
        eas build --platform android --profile production
        Write-Success "✅ Build terminé !"
    }
    
    Read-Host "Appuyer sur Entrée pour continuer"
}

# Lister les builds
function Get-BuildsList {
    Write-Info "📋 Liste des builds récents..."
    Write-Host ""
    
    eas build:list --platform android --limit 10
    
    Read-Host "Appuyer sur Entrée pour continuer"
}

# Vérifier les updates
function Get-UpdatesList {
    Write-Info "📊 Liste des updates publiés..."
    Write-Host ""
    
    eas update:list --branch production
    
    Read-Host "Appuyer sur Entrée pour continuer"
}

# Setup EAS
function Initialize-EAS {
    Write-Info "🔧 Configuration EAS..."
    Write-Host ""
    
    Write-Info "Vérification de l'installation d'EAS CLI..."
    
    $easInstalled = Get-Command eas -ErrorAction SilentlyContinue
    
    if (-not $easInstalled) {
        Write-Info "Installation d'EAS CLI..."
        npm install -g eas-cli
    } else {
        Write-Success "✅ EAS CLI déjà installé"
    }
    
    Write-Info "Connexion à Expo..."
    eas login
    
    Write-Info "Configuration du projet..."
    eas build:configure
    
    Write-Success "✅ Setup terminé !"
    Read-Host "Appuyer sur Entrée pour continuer"
}

# Boucle principale
do {
    Show-Menu
    $choice = Read-Host "Choisir une option (1-8)"
    
    switch ($choice) {
        "1" { Invoke-ProductionAPKBuild }
        "2" { Publish-OTAUpdate }
        "3" { Invoke-PreviewAPKBuild }
        "4" { Invoke-PlayStoreAABBuild }
        "5" { Get-BuildsList }
        "6" { Get-UpdatesList }
        "7" { Initialize-EAS }
        "8" { 
            Write-Success "Au revoir !"
            break
        }
        default {
            Write-Error "Option invalide"
            Start-Sleep -Seconds 1
        }
    }
} while ($choice -ne "8")
