import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccounts } from '../../hooks/useAccounts';
import { SavingsGoal } from '../../types/Savings';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: number, fromAccountId?: string) => Promise<{ success: boolean; message?: string }>;
  goal: SavingsGoal;
}

const QUICK_AMOUNTS = [10, 25, 50, 100, 200, 500];

export const AddContributionModal: React.FC<Props> = ({ visible, onClose, onSubmit, goal }) => {
  const { accounts, refreshAccounts } = useAccounts();
  const { formatAmount, currencySymbol } = useCurrency();
  const { t } = useLanguage();
  
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedSavingsAccountId, setSelectedSavingsAccountId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // ✅ CORRECTION : Filtrer les comptes UNE FOIS
  const contributionAccounts = accounts.filter(acc => 
    acc.type !== 'savings' && acc.balance > 0
  );

  const savingsAccounts = accounts.filter(acc => acc.type === 'savings');

  // ✅ CORRECTION : INITIALISATION UNIQUE QUAND LA MODALE S'OUVRE
  useEffect(() => {
    if (!visible || initialized || accounts.length === 0) return;

    console.log('⚙️ [AddContributionModal] Initialisation UNIQUE des comptes…');
    
    // Réinitialisation des montants
    setAmount('');
    setCustomAmount('');

    // Auto-sélection du compte source (premier compte non épargne)
    if (contributionAccounts.length > 0) {
      setSelectedAccountId(contributionAccounts[0].id);
    }

    // Auto-sélection du compte d'épargne
    if (goal.savingsAccountId && savingsAccounts.some(acc => acc.id === goal.savingsAccountId)) {
      setSelectedSavingsAccountId(goal.savingsAccountId);
    } else if (savingsAccounts.length > 0) {
      setSelectedSavingsAccountId(savingsAccounts[0].id);
    }

    setInitialized(true);
  }, [visible, accounts.length, goal.savingsAccountId]); // ✅ Dépendances fixes

  // ✅ CORRECTION : RÉINITIALISATION QUAND LA MODALE SE FERME
  useEffect(() => {
    if (!visible) {
      setInitialized(false);
      setAmount('');
      setCustomAmount('');
      setSelectedAccountId('');
      setSelectedSavingsAccountId('');
    }
  }, [visible]);

  const handleQuickAmount = (quickAmount: number) => { 
    console.log('💰 Quick amount selected:', quickAmount);
    setAmount(quickAmount.toString());
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    console.log('📝 Custom amount:', value);
    // Permettre uniquement les nombres et un point décimal
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    
    // Vérifier qu'il n'y a qu'un seul point décimal
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limiter à 2 décimales
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setCustomAmount(cleanedValue);
    setAmount('');
  };

  // ✅ VERSION CORRIGÉE - GESTION SIMPLIFIÉE
const processContribution = async (contributionAmount: number) => {
  if (loading) {
    console.log('🛑 Double submission prevented');
    return;
  }

  setLoading(true);
  
  try {
    console.log('💰 [AddContributionModal] Processing contribution...');

    // ✅ ESSAYER LA CONTRIBUTION
    const result = await onSubmit(contributionAmount, selectedAccountId);
    
    console.log('📨 [AddContributionModal] Submit result:', result);
    
    // ✅ SI ON ARRIVE ICI, TOUT A RÉUSSI
    console.log('✅ [AddContributionModal] Contribution successful');
    
    // Rafraîchir les comptes
    await refreshAccounts();
    
    // ✅ UNE SEULE ALERTE DE SUCCÈS
    Alert.alert(
      t.success, 
      result?.message || `${t.contribution} ${formatAmount(contributionAmount)} ${t.contributionAdded}`,
      [{ text: t.ok, onPress: handleClose }]
    );
    
  } catch (error: any) {
    console.error('❌ [AddContributionModal] Contribution failed:', error);
    
    // ✅ UNE SEULE ALERTE D'ERREUR
    Alert.alert(
      t.error, 
      error?.message || t.cannotAddContribution
    );
    
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async () => {
    // ✅ CORRECTION : EMPÊCHER LES DOUBLES SOUMISSIONS
    if (loading) {
      console.log('🛑 [AddContributionModal] Double submission prevented');
      return;
    }

    // ✅ CORRECTION : VALIDATION DES COMPTES
    if (!selectedAccountId) {
      Alert.alert(t.errorLabel, t.pleaseSelectSourceAccount);
      return;
    }

    if (!selectedSavingsAccountId) {
      Alert.alert(t.errorLabel, t.pleaseSelectSavingsDestination);
      return;
    }

    const contributionAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount);
    
    if (!contributionAmount || contributionAmount <= 0 || isNaN(contributionAmount)) {
      Alert.alert(t.errorLabel, t.pleaseEnterValidAmount);
      return;
    }

    // ✅ CORRECTION : VÉRIFICATION DU SOLDE
    const selectedAccount = contributionAccounts.find(acc => acc.id === selectedAccountId);
    if (selectedAccount && contributionAmount > selectedAccount.balance) {
      Alert.alert(
        t.insufficientBalanceTitle,
        `${t.balanceOf} ${selectedAccount.name} ${t.is} ${formatAmount(selectedAccount.balance)}. ${t.cannotTransfer} ${formatAmount(contributionAmount)}.`
      );
      return;
    }

    // ✅ GESTION DU DÉPASSEMENT D'OBJECTIF
    if (contributionAmount + goal.currentAmount > goal.targetAmount) {
      Alert.alert(
        t.warningLabel,
        `${t.contributionExceedsGoal} ${formatAmount(goal.targetAmount)}. ${t.continueQuestion}`,
        [
          { text: t.cancel, style: 'cancel' },
          { 
            text: t.confirmButton, 
            onPress: () => processContribution(contributionAmount)
          }
        ]
      );
    } else {
      processContribution(contributionAmount);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const getSelectedAmount = (): number => {
    return customAmount ? parseFloat(customAmount) : parseFloat(amount) || 0;
  };

  const newTotal = goal.currentAmount + getSelectedAmount();
  const willComplete = newTotal >= goal.targetAmount;
  const selectedAmount = getSelectedAmount();

  // ✅ CORRECTION : DÉSACTIVER LES BOUTONS SI PAS DE COMPTES
  const canSelectAmount = selectedAccountId && selectedSavingsAccountId && !loading;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* En-tête */}
            <View style={styles.header}>
              <Text style={styles.title}>{t.addContribution}</Text>
              <Text style={styles.subtitle}>{goal.name}</Text>
            </View>

            {/* Montant actuel */}
            <View style={styles.currentAmountSection}>
              <Text style={styles.currentAmountLabel}>{t.currentAmount}</Text>
              <Text style={styles.currentAmount}>{formatAmount(goal.currentAmount)}</Text>
              <Text style={styles.targetAmount}>
                {t.target}: {formatAmount(goal.targetAmount)}
              </Text>
            </View>

            {/* Compte source */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionLabel}>{t.sourceAccount} *</Text>
              <View style={styles.accountsContainer}>
                {contributionAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountButton,
                      selectedAccountId === account.id && styles.accountButtonSelected
                    ]}
                    onPress={() => setSelectedAccountId(account.id)}
                    disabled={loading}
                  >
                    <View style={[styles.accountColor, { backgroundColor: account.color }]} />
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountName}>{account.name}</Text>
                      <Text style={styles.accountBalance}>
                        {t.balance}: {formatAmount(account.balance)}
                      </Text>
                    </View>
                    {selectedAccountId === account.id && (
                      <View style={styles.accountCheckmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {contributionAccounts.length === 0 && (
                <Text style={styles.warningText}>
                  {t.noAccountWithBalance}
                </Text>
              )}
            </View>

            {/* Compte d'épargne de destination */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionLabel}>{t.destinationSavingsAccount} *</Text>
              <View style={styles.accountsContainer}>
                {savingsAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountButton,
                      selectedSavingsAccountId === account.id && styles.accountButtonSelected
                    ]}
                    onPress={() => setSelectedSavingsAccountId(account.id)}
                    disabled={loading}
                  >
                    <View style={[styles.accountColor, { backgroundColor: account.color }]} />
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountName}>{account.name}</Text>
                      <Text style={styles.accountBalance}>
                        {t.balance}: {formatAmount(account.balance)}
                      </Text>
                    </View>
                    {selectedSavingsAccountId === account.id && (
                      <View style={styles.accountCheckmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {savingsAccounts.length === 0 && (
                <Text style={styles.warningText}>
                  {t.noSavingsAccount}
                </Text>
              )}
            </View>

            {/* Montant personnalisé */}
            <View style={styles.customAmountSection}>
              <Text style={styles.sectionLabel}>{t.customAmount}</Text>
              <View style={styles.customAmountInput}>
                <Text style={styles.currencySymbol}>{currencySymbol}</Text>
                <TextInput
                  style={[
                    styles.customAmountTextInput,
                    !canSelectAmount && styles.inputDisabled
                  ]}
                  value={customAmount}
                  onChangeText={handleCustomAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#adb5bd"
                  editable={!!canSelectAmount}
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Prévisualisation */}
            {selectedAmount > 0 && selectedAccountId && selectedSavingsAccountId && (
              <View style={styles.previewSection}>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>{t.amountToTransfer}:</Text>
                  <Text style={styles.previewAmount}>{formatAmount(selectedAmount)}</Text>
                </View>
                
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>{t.from}:</Text>
                  <Text style={styles.previewAccount}>
                    {contributionAccounts.find(acc => acc.id === selectedAccountId)?.name}
                  </Text>
                </View>

                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>{t.to}:</Text>
                  <Text style={styles.previewAccount}>
                    {savingsAccounts.find(acc => acc.id === selectedSavingsAccountId)?.name}
                  </Text>
                </View>
                
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>{t.newTotal}:</Text>
                  <Text style={styles.previewTotal}>{formatAmount(newTotal)}</Text>
                </View>
                
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>{t.progress}:</Text>
                  <Text style={styles.previewPercentage}>
                    {((newTotal / goal.targetAmount) * 100).toFixed(1)}%
                  </Text>
                </View>

                {willComplete && (
                  <View style={styles.completionWarning}>
                    <Text style={styles.completionWarningText}>
                      🎉 {t.goalWillBeReached} !
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.cancelButton, loading && styles.buttonDisabled]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>
                  {loading ? t.canceling : t.cancel}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!selectedAmount || !selectedAccountId || !selectedSavingsAccountId || loading) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!selectedAmount || !selectedAccountId || !selectedSavingsAccountId || loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? (t.transferring || 'Transfert...') : `${t.transfer || 'Transférer'} ${formatAmount(selectedAmount)}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Les styles restent identiques...
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  scrollView: {
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  currentAmountSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  currentAmountLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  targetAmount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  inputGroup: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  accountsContainer: {
    gap: 8,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 12,
  },
  accountButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  accountColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  accountBalance: {
    fontSize: 12,
    color: '#6c757d',
  },
  accountCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 12,
    color: '#e74c3c',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  quickAmountsSection: {
    marginBottom: 20,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '30%',
    margin: 4,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickAmountButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  quickAmountButtonDisabled: {
    backgroundColor: '#f8f9fa',
    opacity: 0.5,
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  quickAmountTextActive: {
    color: '#fff',
  },
  quickAmountTextDisabled: {
    color: '#bdc3c7',
  },
  customAmountSection: {
    marginBottom: 20,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 8,
  },
  customAmountTextInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  inputDisabled: {
    backgroundColor: '#f8f9fa',
    color: '#bdc3c7',
  },
  previewSection: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  previewAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  previewAccount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  previewTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#28a745',
  },
  previewPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#28a745',
  },
  completionWarning: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  completionWarningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#155724',
    textAlign: 'center',
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    padding: 20,
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AddContributionModal;