# 📦 Guide d'optimisation de la taille de l'APK

## 🎯 Objectif : Réduire de 98 MB → 40-50 MB

### ✅ Optimisations appliquées

#### 1. **ProGuard/R8 activé** (Gain estimé : 15-20%)
- ✅ `enableProguardInReleaseBuilds: true`
- ✅ `enableShrinkResourcesInReleaseBuilds: true`
- ✅ Configuration dans `eas.json` et `app.json`

#### 2. **Optimisation des images** (Gain estimé : 50% sur les images)

**Problème actuel :**
- Chaque icône fait ~315 KB (beaucoup trop !)
- Total : ~1,5 MB pour 5 images

**Solution :**
```bash
# 1. Installer sharp (outil d'optimisation)
npm install --save-dev sharp

# 2. Exécuter le script d'optimisation
node scripts/optimize-images.js

# 3. Remplacer les images originales par les optimisées
# Les images seront dans assets/images-optimized/
```

**Tailles cibles après optimisation :**
- icon.png : 1024×1024 → ~80-100 KB
- adaptive-icon.png : 1024×1024 → ~80-100 KB
- splash-icon.png : 1284×2778 → ~150-200 KB
- notification-icon.png : 96×96 → ~5-10 KB
- favicon.png : 48×48 → ~3-5 KB

**Gain total images : ~1,2 MB**

---

#### 3. **Utiliser AAB au lieu d'APK** (Gain : 30-40%)

**APK vs AAB :**
- **APK** : Contient toutes les architectures (arm64-v8a, armeabi-v7a, x86, x86_64)
- **AAB** : Google Play génère des APK optimisés par appareil

**Pour un AAB :**
```bash
eas build --platform android --profile production
```

**Important :** Un AAB est seulement pour le Play Store. Pour distribution interne, garde l'APK optimisé.

---

#### 4. **Réduire les dépendances** (Gain : 5-10%)

**Dépendances lourdes identifiées :**
1. `@expo/vector-icons` (~2 MB)
   - Contient 15+ familles d'icônes
   - Solution : Garder uniquement celles utilisées

2. `react-native-chart-kit` + `react-native-svg` (~2-3 MB)
   - Utilisé pour les graphiques
   - Envisager `react-native-svg-charts` (plus léger)

**Actions à envisager :**
```json
// Dans package.json, ajouter :
"resolutions": {
  "@expo/vector-icons": "^14.0.0"
}
```

---

#### 5. **Configuration Metro Bundler** (Gain : 5-10%)

Créer `metro.config.js` pour exclure les fichiers inutiles :

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

module.exports = config;
```

---

### 📊 Résumé des gains estimés

| Optimisation | Gain estimé | Nouveau total |
|-------------|-------------|---------------|
| État initial | - | 98 MB |
| ProGuard/R8 | -15% (~15 MB) | 83 MB |
| Images optimisées | -1,2 MB | 82 MB |
| AAB (si Play Store) | -30% (~25 MB) | **57 MB** |
| Nettoyage dépendances | -5% (~3 MB) | **54 MB** |
| Metro config | -5% (~3 MB) | **51 MB** |

**Taille finale estimée : 50-55 MB** (APK) ou **35-40 MB** (AAB)

---

### 🚀 Étapes à suivre MAINTENANT

#### Étape 1 : Optimiser les images (RAPIDE)
```bash
npm install --save-dev sharp
node scripts/optimize-images.js
# Remplacer les images dans assets/images/
```

#### Étape 2 : Créer un nouveau build avec optimisations
```bash
eas build --platform android --profile production-apk
```

#### Étape 3 : Vérifier la taille
- Télécharger le nouvel APK
- Comparer avec l'ancien (98 MB)
- Objectif : ~50-60 MB

---

### 📈 Optimisations avancées (si besoin)

#### Option A : Lazy loading des modules
```typescript
// Au lieu de :
import HeavyComponent from './HeavyComponent';

// Utiliser :
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

#### Option B : Hermes Engine (déjà activé par défaut avec Expo 54)
- Réduit la taille du bundle JS de 20-30%
- ✅ Déjà actif dans ton projet

#### Option C : Analyse du bundle
```bash
# Analyser ce qui prend de la place
npx expo-bundle-analyzer

# Ou avec React Native Bundle Visualizer
npm install --save-dev react-native-bundle-visualizer
npx react-native-bundle-visualizer
```

---

### ⚠️ Notes importantes

1. **Ne pas sur-optimiser** : Une app de 50-60 MB est acceptable
2. **Tester après chaque optimisation** : Vérifier que l'app fonctionne
3. **AAB pour Play Store** : Obligatoire et plus petit
4. **Garder APK pour distribution interne** : Tests et partage direct

---

### 🎯 Checklist finale

- [ ] Images optimisées avec sharp
- [ ] ProGuard/R8 activé dans eas.json et app.json
- [ ] Nouveau build lancé
- [ ] Taille vérifiée (objectif : <60 MB)
- [ ] App testée et fonctionnelle
- [ ] Commit des changements

---

**Date de création :** 11 décembre 2025
**Version concernée :** 1.1.0 (versionCode 40)
**Taille actuelle :** 98 MB
**Objectif :** 50-55 MB
