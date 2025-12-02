# 📱 Guide EAS Build - Android APK & Mises à jour

## 🚀 Configuration EAS Build

### Profiles disponibles :

1. **`preview`** - APK pour test (développement)
2. **`production-apk`** - APK pour distribution manuelle (recommandé pour toi)
3. **`production`** - AAB pour Google Play Store

## 📦 Commandes Build

### 1. Build APK de production (Recommandé)

```bash
# Build APK production
eas build --platform android --profile production-apk

# Le fichier APK sera téléchargeable depuis le dashboard EAS
```

**Caractéristiques :**
- ✅ Génère un APK installable
- ✅ Auto-incrémente le versionCode
- ✅ Prêt pour distribution directe
- ✅ Support EAS Update

### 2. Build APK de preview (Test)

```bash
# Build APK test
eas build --platform android --profile preview
```

**Utilisation :** Tests rapides avant production

### 3. Build AAB pour Play Store

```bash
# Build AAB production
eas build --platform android --profile production
```

**Utilisation :** Soumission au Google Play Store

## 🔄 Workflow de mise à jour recommandé

### Option 1 : Mises à jour OTA (Over-The-Air) - RAPIDE ⚡

Pour les changements JavaScript/TypeScript uniquement (pas de code natif) :

```bash
# Publier une mise à jour OTA
eas update --branch production --message "Correction bugs calendrier"
```

**Avantages :**
- ✅ Instantané (quelques secondes)
- ✅ Pas besoin de rebuild
- ✅ Les utilisateurs reçoivent la MAJ au démarrage
- ✅ Parfait pour : bug fixes, UI, logique métier

**Limites :**
- ❌ Ne fonctionne pas pour : nouvelles dépendances natives, permissions

### Option 2 : Nouveau build APK - COMPLET 🔨

Pour changements incluant du code natif :

```bash
# 1. Incrémenter la version dans app.json
# "version": "1.0.1" → "1.0.2"

# 2. Build nouveau APK
eas build --platform android --profile production-apk

# 3. Télécharger et distribuer l'APK
```

## 📋 Workflow complet étape par étape

### Première fois (Setup) :

```bash
# 1. S'assurer qu'EAS CLI est installé
npm install -g eas-cli

# 2. Se connecter à Expo
eas login

# 3. Configurer le projet (si pas déjà fait)
eas build:configure
```

### Chaque mise à jour :

#### Pour bug fix JS/UI (Update OTA) :

```bash
# 1. Faire les modifications dans le code
# 2. Tester localement
npm run android

# 3. Publier la mise à jour
eas update --branch production --message "Description de la MAJ"

# 4. Les utilisateurs recevront la MAJ au prochain démarrage
```

#### Pour nouvelle fonctionnalité majeure (Nouveau APK) :

```bash
# 1. Incrémenter la version dans app.json
# "version": "1.0.0" → "1.1.0"
# "android": { "versionCode": 21 } → 22

# 2. Faire les modifications

# 3. Build l'APK
eas build --platform android --profile production-apk

# 4. Attendre la fin du build (~10-15 min)

# 5. Télécharger l'APK depuis :
# https://expo.dev/accounts/[VOTRE_COMPTE]/projects/moneymanager/builds

# 6. Distribuer l'APK aux utilisateurs
```

## 🎯 Stratégie recommandée pour ton cas

### Pour les petites corrections (90% du temps) :

```bash
# Fix rapide + update OTA
eas update --branch production --message "Correction affichage dettes"
```

### Pour les grosses features (10% du temps) :

```bash
# Nouveau build complet
eas build --platform android --profile production-apk
```

## 📊 Vérifier les builds

### Dashboard EAS :
```
https://expo.dev/accounts/[VOTRE_COMPTE]/projects/moneymanager
```

### Lister les builds :
```bash
eas build:list --platform android
```

### Télécharger un build :
```bash
# Le lien de téléchargement est affiché après le build
# Ou disponible dans le dashboard
```

## 🔧 Configuration avancée

### Auto-increment du versionCode

Dans `app.json`, le `versionCode` s'incrémente automatiquement avec `autoIncrement: true` dans `eas.json`.

**Ou manuellement :**

```json
{
  "android": {
    "versionCode": 22  // Incrémenter à chaque build
  }
}
```

### Channels pour tests parallèles

```bash
# Canal de développement
eas update --branch dev --message "Test feature X"

# Canal de production
eas update --branch production --message "Release stable"
```

## 🐛 Troubleshooting

### Build échoue avec erreur Gradle :

```bash
# Nettoyer et rebuild
cd android
./gradlew clean
cd ..
eas build --platform android --profile production-apk --clear-cache
```

### Update OTA ne fonctionne pas :

Vérifier que le runtime version correspond :
```json
// app.json
"runtimeVersion": "1.0.0"  // Doit être identique entre APK et updates
```

### APK non signé :

EAS gère automatiquement le signing. Si problème :
```bash
eas credentials
```

## 📱 Distribution de l'APK

### Options pour distribuer aux utilisateurs :

1. **Google Drive / Dropbox**
   - Upload l'APK
   - Partager le lien

2. **Firebase App Distribution**
   - Distribution automatisée
   - Notifications aux testeurs

3. **Email direct**
   - Envoyer l'APK en pièce jointe

4. **Site web**
   - Héberger l'APK avec lien de téléchargement

### Installation par utilisateur :

1. Télécharger l'APK
2. Autoriser "Sources inconnues" dans les paramètres Android
3. Ouvrir l'APK et installer

## 🎉 Résumé des commandes essentielles

```bash
# Build APK production
eas build -p android --profile production-apk

# Update OTA rapide
eas update --branch production --message "Fix bugs"

# Lister les builds
eas build:list

# Vérifier les updates
eas update:list --branch production

# Build local (pour test)
npm run android
```

## 📈 Workflow optimal pour ton projet

```
┌─────────────────────────────────────────┐
│  Développement quotidien                │
│  ├─ Coder les features                  │
│  ├─ Tester avec: npm run android        │
│  └─ Commit sur Git                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Petites corrections / Bug fixes        │
│  └─ eas update --branch production      │
│     (OTA, instantané)                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Nouvelles features majeures / Natif    │
│  ├─ Incrémenter version                 │
│  ├─ eas build -p android --profile...   │
│  ├─ Télécharger APK                     │
│  └─ Distribuer aux utilisateurs         │
└─────────────────────────────────────────┘
```

---

**Note :** Privilégie les Updates OTA (rapides) quand possible, et les builds complets seulement pour les grosses mises à jour !
