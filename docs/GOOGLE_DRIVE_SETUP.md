# Configuration Google Drive - Guide Complet

## 📋 Prérequis

Les packages nécessaires sont déjà installés :
- ✅ `@react-native-google-signin/google-signin`
- ✅ `expo-auth-session`
- ✅ `expo-web-browser`

## 🔑 Étape 1 : Créer un projet Google Cloud

1. **Aller sur Google Cloud Console**
   - https://console.cloud.google.com/

2. **Créer un nouveau projet**
   - Cliquer sur "Nouveau projet"
   - Nom : "MyLife Money Manager"
   - Créer

3. **Activer l'API Google Drive**
   - Menu → APIs & Services → Library
   - Chercher "Google Drive API"
   - Cliquer et activer

## 🔐 Étape 2 : Configurer OAuth 2.0

### Pour Android :

1. **Créer les identifiants OAuth**
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type : **Android**
   
2. **Configurer le SHA-1**
   ```bash
   # Obtenir le SHA-1 de debug
   cd android
   ./gradlew signingReport
   
   # Le SHA-1 apparaîtra sous "Variant: debug"
   # Exemple : SHA1: A1:B2:C3:D4...
   ```

3. **Remplir les informations**
   - Package name : `com.azzeddine2025.mylife`
   - SHA-1 : (celui obtenu ci-dessus)
   - Créer

### Pour iOS :

1. **Créer les identifiants OAuth**
   - Application type : **iOS**
   - Bundle ID : `com.azzeddine2025.mylife`

2. **Télécharger le fichier de config**
   - Télécharger le `GoogleService-Info.plist`
   - Le placer dans `ios/`

### Pour Expo (Développement) :

1. **Créer un client OAuth Web**
   - Application type : **Web application**
   - Authorized redirect URIs : 
     ```
     https://auth.expo.io/@VOTRE_USERNAME/moneymanager
     exp://localhost:8081/--/redirect
     ```

2. **Copier le Client ID**
   - Vous verrez : `123456789-abcdefg.apps.googleusercontent.com`
   - **C'est votre GOOGLE_CLIENT_ID**

## ⚙️ Étape 3 : Configurer l'application

### 1. Mettre à jour `app.json`

Ajouter dans la section `expo` :

```json
{
  "expo": {
    "scheme": "mylife",
    "extra": {
      "googleClientId": "VOTRE_CLIENT_ID_ICI"
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

### 2. Mettre à jour le service Google Drive

Ouvrir `src/services/backup/googleDriveService.ts` et remplacer :

```typescript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
```

Par :

```typescript
import Constants from 'expo-constants';
const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId || '';
```

## 🚀 Étape 4 : Tester

### En développement :

```bash
npm run start
npm run android  # ou npm run ios
```

### Test de la fonctionnalité :

1. Aller dans **Paramètres → Sauvegarde & Restauration**
2. Cliquer sur **"Activer Google Drive"**
3. Se connecter avec votre compte Google
4. Autoriser l'accès à Google Drive
5. Créer une sauvegarde cloud

## 📱 Utilisation

### Sauvegarder sur Google Drive :
```typescript
import { useGoogleDrive } from '../hooks/useGoogleDrive';

const { uploadBackup, isAuthenticated } = useGoogleDrive();

// Vérifier l'authentification
if (!isAuthenticated) {
  await signIn();
}

// Upload
await uploadBackup();
```

### Restaurer depuis Google Drive :
```typescript
const { backups, restoreBackup } = useGoogleDrive();

// Charger la liste
await loadBackups();

// Restaurer
await restoreBackup(backups[0].id, backups[0].name);
```

## 🔒 Sécurité

- ✅ Les tokens sont stockés dans **expo-secure-store**
- ✅ Les backups sont dans **appDataFolder** (invisibles pour l'utilisateur)
- ✅ Utilise OAuth 2.0 avec PKCE
- ✅ Refresh token automatique

## ❓ Troubleshooting

### Erreur "Invalid client ID"
→ Vérifier que le `GOOGLE_CLIENT_ID` correspond à celui de Google Cloud Console

### Erreur "Redirect URI mismatch"
→ Vérifier que l'URI de redirection est bien configurée dans Google Cloud Console

### Erreur "API not enabled"
→ Activer Google Drive API dans Google Cloud Console

## 📚 Ressources

- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [OAuth 2.0 Flow](https://developers.google.com/identity/protocols/oauth2)

---

**Note :** Pour production, créer des identifiants OAuth séparés pour Android et iOS avec les SHA-1/Bundle ID de production.
