# Plan d'exécution des corrections - Mylife App
**Généré automatiquement le 24/11/2025**
**Branche: rollback/v6**

## ✅ Tâches complétées (Infrastructure)

### 1. CategoryPickerDropdown Component
- ✅ Créé composant réutilisable avec recherche
- ✅ Support catégories principales + sous-catégories
- ✅ Modal avec barre de recherche intuitive
- ✅ Filtrage par type (income/expense/all)
- **Fichier**: `src/components/ui/CategoryPickerDropdown.tsx`

### 2. Service de prélèvement automatique
- ✅ `autoDebitService.ts` créé
- ✅ Fonction `processAutomaticDebits()` pour charges annuelles
- ✅ Gestion des transactions récurrentes mensuelles
- ✅ Système de notification des prélèvements à venir
- **Fichier**: `src/services/autoDebitService.ts`

---

## 🔄 Tâches en cours / À compléter

### GROUPE A: Formulaires & Catégories (Priorité HIGH)

#### 3. Budget - Intégrer CategoryPickerDropdown
**Fichier**: `src/components/budget/BudgetForm.tsx`
**Actions**:
- Remplacer le ScrollView horizontal des catégories par `<CategoryPickerDropdown>`
- Ajouter sélection sous-catégorie si catégorie principale sélectionnée
- Props: `type="expense"`, `showSubcategories={true}`

#### 4. Formulaires - Dropdown catégories partout
**Fichiers à modifier**:
- `src/screens/AddTransactionScreen.tsx`
- `src/screens/EditTransactionScreen.tsx`
- `src/screens/AddAnnualChargeScreen.tsx`
- `src/screens/EditAnnualChargeScreen.tsx`
- `src/components/islamic/IslamicChargeForm.tsx` (si existe)

**Actions**:
- Remplacer tous les Picker traditionnels par CategoryPickerDropdown
- Uniformiser l'UX de sélection de catégories

#### 5. Catégories - Ajouter barre de recherche
**Fichier**: `src/screens/CategoriesScreen.tsx`
**Actions**:
- Ajouter TextInput de recherche en haut de la FlatList
- Filtrer `categoryTree` selon `searchQuery`
- État: `const [searchQuery, setSearchQuery] = useState('')`

---

### GROUPE B: Gestion des données (Priorité HIGH)

#### 6. Dette - Ne pas déduire du solde immédiatement
**Fichier**: `src/screens/AddDebtScreen.tsx` (ligne ~80-120)
**Actions**:
- Retirer toute logique de débit du compte lors de la création de dette
- La dette doit être un tracking séparé
- Seuls les remboursements impactent le compte

#### 7. Charge annuelle - Activer prélèvement auto
**Fichiers**:
- `src/context/DatabaseContext.tsx` (ajouter appel au démarrage)
- `src/hooks/useAnnualCharges.ts` (ajouter refresh après prélèvement)
- `src/screens/DashboardScreen.tsx` (appeler `processAutomaticDebits` au mount et refresh)

**Actions**:
```typescript
import { processAutomaticDebits } from '../services/autoDebitService';

useEffect(() => {
  const checkDebits = async () => {
    const result = await processAutomaticDebits();
    if (result.processed > 0) {
      // Refresh data
      refreshTransactions();
      refreshAccounts();
    }
  };
  checkDebits();
}, []);
```

#### 8. Transactions récurrentes - Vérifier logique
**Fichier**: `src/services/autoDebitService.ts` (déjà fait)
**Validation**:
- ✅ La logique crée nouvelle transaction même jour du mois suivant
- ✅ Utilise `setMonth(currentMonth + 1)` qui préserve le jour
- ⚠️ Besoin de tester edge cases (31 janvier → 28/29 février)

---

### GROUPE C: UX & Navigation (Priorité MEDIUM)

#### 9. Dashboard - Supprimer auto-refresh chaque seconde
**Fichier**: `src/screens/DashboardScreen.tsx`
**Actions**:
- Rechercher `setInterval` ou `useEffect` avec dépendances déclenchant trop souvent
- Remplacer par `<RefreshControl>` sur ScrollView
- Garder refresh manuel uniquement

#### 10. Menu burger - Retirer charges islamiques
**Fichier**: `src/navigation/ModernDrawerNavigator.tsx`
**Actions**:
- Ligne ~85: Retirer `IslamicCharges: undefined;` du type DrawerParamList
- Ligne ~150-160: Retirer `<Drawer.Screen name="IslamicCharges" ... />`
- Vérifier qu'aucun autre écran ne navigue vers IslamicCharges

#### 11. Dashboard - Ajouter icône burger menu
**Fichier**: `src/screens/DashboardScreen.tsx`
**Actions**:
```typescript
const navigation = useNavigation<any>();

// Dans le header ou en haut à gauche:
<TouchableOpacity onPress={() => navigation.openDrawer()}>
  <Ionicons name="menu" size={28} color={colors.text.primary} />
</TouchableOpacity>
```

#### 12. ListTransactionItem - Désactiver clics pour dette/charge/épargne
**Fichier**: `src/components/transaction/ListTransactionItem.tsx`
**Actions**:
- Ligne ~26: Ajouter prop `disablePress?: boolean`
- Ligne ~40: `disabled={disablePress || isProcessing}`
- Ligne ~42: `activeOpacity={disablePress ? 1 : 0.7}`
- Appelants: passer `disablePress={item.category in ['dette', 'épargne', 'charge_annuelle']}`

---

### GROUPE D: Formulaires ScrollView (Priorité MEDIUM)

#### 13. Épargne - Défilement formulaire
**Fichier**: `src/screens/AddSavingsGoalScreen.tsx`
**Validation**: ✅ Déjà implémenté (ligne 9: `<ScrollView>`)

#### 14. Formulaires - ScrollView partout
**Fichiers à vérifier**:
- `src/screens/AddDebtScreen.tsx` ✅ (ligne 7)
- `src/screens/EditDebtScreen.tsx`
- `src/screens/EditBudgetScreen.tsx`
- `src/screens/AddMultipleCategoriesScreen.tsx`

**Actions**:
- Wrapper tout le contenu du formulaire dans `<ScrollView>`
- Ajouter `KeyboardAvoidingView` si nécessaire (iOS)

---

### GROUPE E: Méthode de paiement (Priorité LOW)

#### 15. Supprimer sélecteur méthode paiement
**Fichiers**:
- `src/screens/AddAnnualChargeScreen.tsx` (ligne ~78, ~412)
- `src/screens/EditAnnualChargeScreen.tsx` (ligne ~72, ~378)

**Actions**:
- Retirer `const paymentMethods = [...]`
- Retirer `<ScrollView horizontal>` des méthodes de paiement
- Remplacer par un toggle "Prélèvement automatique" (oui/non)
- Garder uniquement `dueDate` (date d'échéance)

---

### GROUPE F: Détails (Priorité LOW)

#### 16. Charges islamiques - Enlever icône header
**Fichier**: `src/screens/islamic/IslamicChargesScreen.tsx`
**Actions**:
- Ligne ~50-60: Rechercher `headerRight` ou icône dans `useLayoutEffect`
- Retirer ou remplacer par `null`

#### 17. Notification - Deep linking vers détails transaction
**Fichier**: `src/services/PushNotificationService.ts`
**Actions**:
```typescript
// Dans handleNotificationResponse:
if (notification.data?.transactionId) {
  navigation.navigate('TransactionDetail', {
    transactionId: notification.data.transactionId
  });
}
```

#### 18. Comptes - Modification impossible (déjà résolu ?)
**Fichier**: `src/screens/AccountDetailScreen.tsx`
**Validation**: À tester - le code semble correct (ligne ~200)

---

## 🔧 Commandes d'exécution

### Avant de commencer:
```powershell
git status
git pull origin rollback/v6
```

### Après chaque groupe de modifications:
```powershell
git add .
git commit -m "fix(groupe-X): description courte"
git push origin rollback/v6
```

### Test final:
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
npx expo start --clear
```

---

## 📊 Progression

| Groupe | Tâches | Complété | Statut |
|--------|--------|----------|--------|
| Infrastructure | 2 | 2 | ✅ |
| A - Formulaires | 3 | 0 | ⏳ |
| B - Données | 4 | 1 | ⏳ |
| C - UX/Nav | 4 | 0 | ⏳ |
| D - ScrollView | 4 | 1 | ⏳ |
| E - Paiement | 1 | 0 | ⏳ |
| F - Détails | 3 | 0 | ⏳ |
| **TOTAL** | **21** | **4** | **19%** |

---

## ⚠️ Notes importantes

1. **Tests manuels requis**:
   - Prélèvement automatique (attendre une charge due)
   - Transactions récurrentes (attendre fin du mois)
   - CategoryPickerDropdown dans tous les formulaires

2. **Base de données**:
   - Ajouter colonne `lastProcessedDate` à `annual_charges` si absente
   - Ajouter colonne `lastRecurredDate` à `transactions` si absente

3. **Backup avant modification massive**:
   ```powershell
   git branch backup-avant-corrections
   git push origin backup-avant-corrections
   ```

---

**Dernière mise à jour**: 24/11/2025 23:56
**Commit infrastructure**: `ba2dfa9`
