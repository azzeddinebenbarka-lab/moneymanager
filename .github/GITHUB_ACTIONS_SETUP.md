# Configuration GitHub Actions pour EAS

## 🚀 Workflows automatiques configurés

### 1. **EAS Update Auto** (`.github/workflows/eas-update.yml`)
Se déclenche automatiquement à chaque push sur `rollback/v6` et publie une mise à jour OTA.

**Fonctionnalité :**
- ✅ Update automatique lors de chaque commit
- ✅ Message de commit utilisé comme description
- ✅ Publication sur branche `main` pour Android
- ✅ Ignores les fichiers `.md` et `.github/`

### 2. **EAS Build Android** (`.github/workflows/eas-build.yml`)
Build manuel via GitHub Actions (à déclencher manuellement).

**Utilisation :**
1. Aller sur GitHub → Actions → "EAS Build Android"
2. Cliquer "Run workflow"
3. Choisir le profil (`production` ou `preview`)
4. Le build APK/AAB sera généré automatiquement

## 📋 Configuration requise

### Étape 1 : Générer un token Expo
```bash
# Se connecter à Expo
npx expo login

# Générer un token
# Aller sur : https://expo.dev/accounts/azzeddine2025/settings/access-tokens
# Créer un nouveau token avec les permissions :
# - Read projects
# - Write projects
# - Read builds
# - Write builds
# - Read updates
# - Write updates
```

### Étape 2 : Ajouter le token sur GitHub
1. Aller sur : https://github.com/azzeddinebenbarka-lab/moneymanager/settings/secrets/actions
2. Cliquer "New repository secret"
3. Nom : `EXPO_TOKEN`
4. Valeur : Coller le token généré sur Expo
5. Cliquer "Add secret"

### Étape 3 : Tester le workflow
```bash
# Faire un commit et push
git add .
git commit -m "test: trigger automatic update"
git push moneymanager rollback/v6

# Le workflow se déclenchera automatiquement !
# Vérifier sur : https://github.com/azzeddinebenbarka-lab/moneymanager/actions
```

## 🔄 Fonctionnement

### Updates automatiques (OTA)
```
Commit sur rollback/v6
    ↓
GitHub Actions détecte le push
    ↓
Installe les dépendances
    ↓
Publie sur EAS Update
    ↓
Les utilisateurs reçoivent la mise à jour au lancement
```

### Builds manuels
```
Actions → EAS Build Android → Run workflow
    ↓
Choisir production/preview
    ↓
Build généré sur EAS
    ↓
Télécharger l'APK/AAB depuis expo.dev
```

## ⚙️ Configuration app.json

Le fichier `app.json` doit avoir :
```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[project-id]"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

## 🎯 Avantages

- ✅ **Updates instantanés** : Push un commit → Update publié automatiquement
- ✅ **Pas de Play Store** : Les users reçoivent les updates sans télécharger
- ✅ **Builds à la demande** : Générer un APK quand tu veux via GitHub
- ✅ **Gratuit** : Tout se fait via GitHub Actions et EAS Free tier

## 📱 Pour les utilisateurs

L'application vérifie automatiquement les updates au démarrage. Pour forcer une vérification :
1. Fermer complètement l'app
2. Relancer
3. L'update se télécharge en arrière-plan

## 🐛 Troubleshooting

**Erreur "EXPO_TOKEN not found"**
→ Vérifier que le secret est bien ajouté sur GitHub

**Build failed avec erreur Web**
→ Normal, on build que pour Android (pas Web)

**Update pas reçu**
→ Vérifier que `runtimeVersion` dans `app.json` correspond au build installé
