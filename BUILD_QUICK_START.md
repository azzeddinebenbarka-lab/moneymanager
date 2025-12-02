# 🚀 Guide Rapide - Build & Updates

## Commandes Essentielles

### 📦 Build APK Production (Distribution manuelle)
```bash
npm run build:apk
```
→ Génère un APK installable pour tes utilisateurs

### 🔄 Update OTA Rapide (Sans rebuild)
```bash
npm run update
```
→ Publie une mise à jour instantanée (pour bugs/UI)

### 🧪 Build APK Test
```bash
npm run build:preview
```
→ APK pour tester avant production

### 📋 Voir les builds
```bash
npm run build:list
```

### 📊 Voir les updates
```bash
npm run update:list
```

## 🎯 Workflow Quotidien

### Option 1 : Petite correction (90% du temps) ⚡
```bash
# 1. Fais tes modifications
# 2. Teste localement
npm run android

# 3. Publie l'update OTA
npm run update
```
**Résultat :** Les utilisateurs reçoivent la MAJ immédiatement ✅

### Option 2 : Nouvelle version majeure (10% du temps) 🔨
```bash
# 1. Mets à jour la version dans app.json
#    "version": "1.0.0" → "1.0.1"

# 2. Build l'APK
npm run build:apk

# 3. Télécharge l'APK depuis expo.dev
# 4. Distribue aux utilisateurs
```

## 📱 Script PowerShell (Windows)

Pour un menu interactif :
```powershell
.\build.ps1
```

## 📚 Documentation Complète

Voir `docs/EAS_BUILD_GUIDE.md` pour tous les détails.

---

**Astuce :** Privilégie `npm run update` pour les corrections rapides !
