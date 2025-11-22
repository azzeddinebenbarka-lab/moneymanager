# Guide d'implémentation des fonctionnalités restantes

## ✅ Tâches complétées

### 1. ✅ Corriger l'affichage "Compte non trouvé" - COMPLÉTÉ
**Fichier modifié:** `src/screens/AccountDetailScreen.tsx`

**Changements apportés:**
- Ajout de l'état `accountsLoading` depuis `useAccounts()`
- Ajout d'un écran de chargement qui s'affiche pendant le chargement initial
- L'erreur "Compte non trouvé" ne s'affiche plus que si le chargement est terminé ET le compte n'existe pas

**Code ajouté:**
```typescript
const { accounts, loading: accountsLoading } = useAccounts();

// Afficher un loader pendant le chargement initial
if (accountsLoading && !account) {
  return (
    <View style={[styles.container, styles.center]}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={styles.loadingText}>Chargement du compte...</Text>
    </View>
  );
}
```

### 2. ✅ Modifier profil: retirer budget, ajouter email et mot de passe - COMPLÉTÉ
**Fichier modifié:** `src/screens/ProfileScreen.tsx`

**Changements apportés:**
- Suppression de l'import `useBudgets`
- Suppression de la section "Budget mensuel" (carte complète avec progression)
- Les modals `ChangePasswordModal` et `EditEmailModal` étaient déjà fonctionnels
- Les fonctions `changePassword` et `updateEmail` existent dans `AuthContext`

**Résultat:** L'interface du profil est maintenant plus simple et les fonctions de modification d'email/mot de passe sont accessibles et fonctionnelles.

---

## 🔨 Tâches à implémenter

### 3. 🔄 Implémenter la sécurité biométrique fonctionnelle

**État actuel:**
- ✅ Hook `useBiometricAuth` existe déjà dans `src/hooks/useBiometricAuth.ts`
- ❌ Package `expo-local-authentication` NON INSTALLÉ
- ❌ Aucune intégration dans l'App.tsx pour l'authentification au démarrage
- ❌ Aucune option dans le profil pour activer/désactiver la sécurité

**Étapes d'implémentation:**

#### Étape 1: Installer la dépendance
```bash
npx expo install expo-local-authentication
```

#### Étape 2: Créer un écran d'authentification biométrique
Créer `src/screens/BiometricLockScreen.tsx`:
```typescript
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

export const BiometricLockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const { authenticate, biometricAvailable, biometricType } = useBiometricAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const result = await authenticate();
    if (result.success) {
      onUnlock();
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed" size={80} color="#6C63FF" />
      <Text style={styles.title}>Application verrouillée</Text>
      <Text style={styles.subtitle}>
        Utilisez {biometricType} pour déverrouiller
      </Text>
      <TouchableOpacity style={styles.button} onPress={checkAuth}>
        <Text style={styles.buttonText}>Déverrouiller</Text>
      </TouchableOpacity>
    </View>
  );
};
```

#### Étape 3: Créer un service de stockage pour les préférences de sécurité
Créer `src/services/storage/securityPreferences.ts`:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const SECURITY_KEY = '@security_preferences';

export interface SecurityPreferences {
  biometricEnabled: boolean;
  autoLockTimeout: number; // en minutes
}

export const securityPreferencesService = {
  async getPreferences(): Promise<SecurityPreferences> {
    const stored = await AsyncStorage.getItem(SECURITY_KEY);
    return stored ? JSON.parse(stored) : { biometricEnabled: false, autoLockTimeout: 5 };
  },

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    const prefs = await this.getPreferences();
    prefs.biometricEnabled = enabled;
    await AsyncStorage.setItem(SECURITY_KEY, JSON.stringify(prefs));
  },

  async setAutoLockTimeout(timeout: number): Promise<void> {
    const prefs = await this.getPreferences();
    prefs.autoLockTimeout = timeout;
    await AsyncStorage.setItem(SECURITY_KEY, JSON.stringify(prefs));
  }
};
```

#### Étape 4: Ajouter un Context pour la sécurité
Créer `src/context/SecurityContext.tsx`:
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { securityPreferencesService } from '../services/storage/securityPreferences';

interface SecurityContextValue {
  isLocked: boolean;
  unlock: () => void;
  biometricEnabled: boolean;
  toggleBiometric: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextValue | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const { biometricAvailable } = useBiometricAuth();

  useEffect(() => {
    loadPreferences();
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const loadPreferences = async () => {
    const prefs = await securityPreferencesService.getPreferences();
    setBiometricEnabled(prefs.biometricEnabled);
    if (prefs.biometricEnabled && biometricAvailable) {
      setIsLocked(true);
    }
  };

  const handleAppStateChange = async (nextAppState: string) => {
    if (nextAppState === 'background' && biometricEnabled) {
      setIsLocked(true);
    }
  };

  const unlock = () => setIsLocked(false);

  const toggleBiometric = async () => {
    const newValue = !biometricEnabled;
    await securityPreferencesService.setBiometricEnabled(newValue);
    setBiometricEnabled(newValue);
  };

  return (
    <SecurityContext.Provider value={{ isLocked, unlock, biometricEnabled, toggleBiometric }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const ctx = useContext(SecurityContext);
  if (!ctx) throw new Error('useSecurity must be used within SecurityProvider');
  return ctx;
};
```

#### Étape 5: Intégrer dans App.tsx
Modifier `App.tsx` pour envelopper l'app avec SecurityProvider et afficher BiometricLockScreen si verrouillé.

#### Étape 6: Ajouter l'option dans ProfileScreen
Ajouter un switch pour activer/désactiver la sécurité biométrique dans la section "Actions" du profil.

---

### 4. 📊 Ajouter types de catégories: charges annuelles et épargne

**État actuel:**
- ✅ Les charges annuelles existent déjà comme entité séparée
- ✅ L'épargne existe déjà comme entité séparée
- ❌ Le système de catégories supporte uniquement 'expense' et 'income'
- ❌ Besoin de migration SQL pour étendre la colonne type

**Architecture recommandée:**

Il existe deux approches possibles :

**Option A: Garder l'architecture actuelle (RECOMMANDÉ)**
- Les charges annuelles et l'épargne restent des entités séparées
- Les catégories gardent uniquement 'expense' et 'income'
- Avantages: Pas de migration complexe, architecture plus claire
- L'architecture actuelle est déjà bien faite avec des tables dédiées

**Option B: Fusionner dans le système de catégories**
- Modifier la table categories pour accepter 4 types
- Migrer les données existantes
- Complexité élevée et risque de casser l'existant

**Recommandation:** **Garder l'architecture actuelle (Option A)** car elle est déjà bien structurée et les charges annuelles/épargne ont leurs propres logiques métier spécifiques.

Si vous souhaitez quand même implémenter l'Option B, voici les étapes :

#### Migration SQL requise:
```sql
-- 1. Ajouter les nouveaux types dans la table categories
ALTER TABLE categories ADD COLUMN new_type TEXT;
UPDATE categories SET new_type = type;
ALTER TABLE categories DROP COLUMN type;
ALTER TABLE categories RENAME COLUMN new_type TO type;

-- 2. Créer des catégories pour charges annuelles et épargne
INSERT INTO categories (id, name, icon, color, type) VALUES
  ('cat_annual_charge', 'Charge Annuelle', 'calendar-outline', '#FF6B6B', 'annual_charge'),
  ('cat_savings', 'Épargne', 'wallet-outline', '#4ECDC4', 'savings');
```

#### Fichiers TypeScript à modifier:
1. `src/types/index.ts` - Ajouter les nouveaux types
2. `src/services/database/schema.ts` - Mettre à jour le schéma
3. `src/hooks/useCategories.ts` - Gérer les nouveaux types
4. `src/screens/AddTransactionScreen.tsx` - Ajouter les onglets
5. `src/screens/AddMultipleCategoriesScreen.tsx` - Support des 4 types

---

### 5. 💾 Implémenter système de sauvegarde et export

**État actuel:**
- ✅ Hooks `useBackup` et `useExport` existent dans `src/hooks/`
- ❌ Pas d'interface utilisateur pour les utiliser
- ❌ Fonctionnalités peut-être incomplètes

**Étapes d'implémentation:**

#### Étape 1: Vérifier les hooks existants
Examiner `src/hooks/useBackup.ts` et `src/hooks/useExport.ts` pour voir ce qui existe déjà.

#### Étape 2: Créer un écran de sauvegarde/export
Créer `src/screens/BackupScreen.tsx` avec les options:
- Export JSON (données complètes)
- Export CSV (transactions seulement)
- Sauvegarde automatique
- Restaurer depuis une sauvegarde

#### Étape 3: Ajouter un bouton dans ProfileScreen
```typescript
<TouchableOpacity 
  style={[styles.actionButton, isDark && styles.darkCard]}
  onPress={() => navigation.navigate('Backup')}
>
  <View style={[styles.actionIconBox, { backgroundColor: '#E8F5E9' }]}>
    <Ionicons name="cloud-upload-outline" size={22} color="#4CAF50" />
  </View>
  <Text style={[styles.actionText, isDark && styles.darkText]}>
    Sauvegarde et export
  </Text>
  <Ionicons name="chevron-forward" size={20} color={isDark ? '#666' : '#ccc'} />
</TouchableOpacity>
```

#### Étape 4: Implémenter les fonctions d'export
```typescript
// Export JSON
export const exportToJSON = async (db: SQLiteDatabase) => {
  const data = {
    transactions: await db.getAllAsync('SELECT * FROM transactions'),
    categories: await db.getAllAsync('SELECT * FROM categories'),
    accounts: await db.getAllAsync('SELECT * FROM accounts'),
    budgets: await db.getAllAsync('SELECT * FROM budgets'),
    // ... autres tables
  };
  
  const json = JSON.stringify(data, null, 2);
  const fileName = `mylife_backup_${new Date().toISOString()}.json`;
  
  // Utiliser expo-sharing pour partager le fichier
  await shareFile(json, fileName);
};

// Export CSV (transactions)
export const exportTransactionsToCSV = async (transactions: Transaction[]) => {
  const headers = ['Date', 'Montant', 'Type', 'Catégorie', 'Description'];
  const rows = transactions.map(t => [
    t.date,
    t.amount,
    t.type,
    t.category,
    t.description
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const fileName = `transactions_${new Date().toISOString()}.csv`;
  
  await shareFile(csv, fileName);
};
```

#### Étape 5: Implémenter la sauvegarde automatique
Utiliser AsyncStorage pour stocker la dernière sauvegarde et un intervalle pour sauvegarder automatiquement.

---

## 📝 Ordre de priorité recommandé

1. **Sécurité biométrique** (1-2h) - Installation package + Intégration basique
2. **Sauvegarde et export** (2-3h) - Vérifier hooks existants + Créer UI
3. **Types de catégories** (Optionnel) - Garder l'architecture actuelle est recommandé

## 🎯 Prochaines étapes immédiates

Pour continuer l'implémentation, commencez par:

```bash
# 1. Installer expo-local-authentication
npx expo install expo-local-authentication

# 2. Créer les fichiers de sécurité
# - src/screens/BiometricLockScreen.tsx
# - src/context/SecurityContext.tsx
# - src/services/storage/securityPreferences.ts

# 3. Intégrer dans l'app
# - Modifier App.tsx
# - Ajouter l'option dans ProfileScreen
```

Voulez-vous que je commence par l'implémentation de la sécurité biométrique en créant tous ces fichiers ?
