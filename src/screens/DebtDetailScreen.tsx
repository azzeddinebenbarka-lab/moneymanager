// src/screens/DebtDetailScreen.tsx - VERSION CORRIGÉE AVEC SYSTÈME DE DEVISE
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCurrency } from '../context/CurrencyContext'; // ✅ AJOUT: Import du contexte devise
import { useLanguage } from '../context/LanguageContext';
import { useDesignSystem, useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { useDebts } from '../hooks/useDebts';
import { Debt, DebtPayment } from '../types/Debt';

interface DebtDetailScreenProps {
  navigation: any;
  route: any;
}

const DebtDetailScreen: React.FC<DebtDetailScreenProps> = ({ navigation, route }) => {
  const { debtId } = route.params;
  const { t } = useLanguage();
  const { colors } = useDesignSystem();
  const { theme } = useTheme();
  const { formatAmount } = useCurrency(); // ✅ CORRECTION: Ajout du contexte devise
  const { 
    getDebtById, 
    makePayment,
    getPaymentHistory, 
    deleteDebt,
    refreshDebts 
  } = useDebts();
  const { accounts } = useAccounts();
  
  const [debt, setDebt] = useState<Debt | null>(null);
  const [payments, setPayments] = useState<DebtPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const isDark = theme === 'dark';

  // ✅ CORRECTION: Récupérer le symbole de devise
  const getCurrencySymbol = () => {
    return formatAmount(0, true).replace(/[0-9.,\s]/g, '').trim() || 'MAD';
  };

  // ✅ CORRECTION: Formatage avec la devise courante
  const formatDisplayAmount = (amount: number, showSymbol: boolean = true): string => {
    return formatAmount(amount, showSymbol);
  };

  const loadDebtData = useCallback(async () => {
    try {
      setLoading(true);
      const [debtData, paymentData] = await Promise.all([
        getDebtById(debtId),
        getPaymentHistory(debtId)
      ]);
      
      setDebt(debtData);
      setPayments(paymentData || []);
    } catch (error) {
      console.error('Error loading debt data:', error);
      Alert.alert(t.error, 'Impossible de charger les données de la dette');
    } finally {
      setLoading(false);
    }
  }, [debtId, getDebtById, getPaymentHistory]);

  const handleMakePayment = async () => {
    if (!debt || !paymentAmount || !selectedAccountId) {
      Alert.alert(t.error, 'Veuillez remplir tous les champs');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(t.error, 'Montant invalide');
      return;
    }

    if (amount > debt.currentAmount) {
      Alert.alert(t.error, 'Le montant ne peut pas dépasser le solde restant');
      return;
    }

    if (debt.paymentEligibility && !debt.paymentEligibility.isEligible) {
      Alert.alert('Paiement non autorisé', debt.paymentEligibility.reason);
      return;
    }

    setPaymentLoading(true);
    try {
      await makePayment(debtId, amount, selectedAccountId);
      
      Alert.alert(t.success, 'Paiement effectué avec succès');
      setShowPaymentForm(false);
      setPaymentAmount('');
      setSelectedAccountId('');
      await loadDebtData();
      await refreshDebts();
    } catch (error: any) {
      console.error('Error making payment:', error);
      Alert.alert(t.error, error.message || 'Impossible d\'effectuer le paiement');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeleteDebt = () => {
    if (!debt) return;

    Alert.alert(
      'Supprimer la dette',
      `Êtes-vous sûr de vouloir supprimer la dette "${debt.name}" ?\n\nCette action est irréversible.`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDebt(debtId);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert(t.error, error.message || 'Impossible de supprimer la dette');
            }
          },
        },
      ]
    );
  };

  const getStatusLabel = (status: Debt['status']): string => {
    switch (status) {
      case 'active': return 'Active';
      case 'overdue': return 'En retard';
      case 'paid': return 'Payée';
      case 'future': return 'Future';
      default: return status;
    }
  };

  const getStatusColor = (status: Debt['status']): string => {
    switch (status) {
      case 'active': return '#3B82F6';
      case 'overdue': return '#EF4444';
      case 'paid': return '#10B981';
      case 'future': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  useEffect(() => {
    loadDebtData();
  }, [loadDebtData]);

  if (loading || !debt) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }, styles.center]}>
        <Text style={[styles.loadingText, { color: colors.text.primary }]}>
          Chargement...
        </Text>
      </View>
    );
  }

  const sourceAccounts = accounts.filter(acc => acc.type !== 'savings' && acc.balance > 0);
  const progressPercentage = Math.max(0, ((debt.initialAmount - debt.currentAmount) / debt.initialAmount) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.primary, borderBottomColor: colors.border.primary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Détails de la Dette
        </Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('EditDebt', { debtId })}
        >
          <Ionicons name="create-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Carte principale */}
        <View style={[styles.mainCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.debtHeader}>
            <View style={[styles.colorIndicator, { backgroundColor: debt.color }]} />
            <View style={styles.debtInfo}>
              <Text style={[styles.debtName, { color: colors.text.primary }]}>
                {debt.name}
              </Text>
              <Text style={[styles.creditor, { color: colors.text.secondary }]}>
                {debt.creditor}
              </Text>
            </View>
          </View>
          
          <View style={styles.amountSection}>
            <Text style={[styles.currentAmount, { color: colors.text.primary }]}>
              {formatDisplayAmount(debt.currentAmount)} {/* ✅ CORRECTION: Format devise */}
            </Text>
            <Text style={[styles.initialAmount, { color: colors.text.secondary }]}>
              sur {formatDisplayAmount(debt.initialAmount)} initial {/* ✅ CORRECTION: Format devise */}
            </Text>
          </View>

          {/* Barre de progression */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: getStatusColor(debt.status)
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.text.secondary }]}>
              {progressPercentage.toFixed(1)}% remboursé
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Taux d'intérêt
              </Text>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {debt.interestRate}%
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Mensualité
              </Text>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {formatDisplayAmount(debt.monthlyPayment)} {/* ✅ CORRECTION: Format devise */}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                Statut
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(debt.status) }
              ]}>
                <Text style={styles.statusText}>
                  {getStatusLabel(debt.status)}
                </Text>
              </View>
            </View>
          </View>

          {/* Éligibilité au paiement */}
          {debt.paymentEligibility && (
            <View style={[
              styles.eligibilitySection,
              debt.paymentEligibility.isEligible ? styles.eligible : styles.notEligible
            ]}>
              <Ionicons 
                name={debt.paymentEligibility.isEligible ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={debt.paymentEligibility.isEligible ? colors.semantic.success : colors.semantic.error} 
              />
              <Text style={[
                styles.eligibilityText,
                { color: colors.text.primary }
              ]}>
                {debt.paymentEligibility.isEligible 
                  ? 'Paiement autorisé ce mois' 
                  : debt.paymentEligibility.reason}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={[styles.actionsCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Actions
          </Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[
                styles.actionButton,
                (!debt.paymentEligibility?.isEligible || debt.currentAmount <= 0 || debt.status === 'paid') && styles.actionButtonDisabled
              ]}
              onPress={() => setShowPaymentForm(true)}
              disabled={!debt.paymentEligibility?.isEligible || debt.currentAmount <= 0 || debt.status === 'paid'}
            >
              <Ionicons name="card" size={24} color={colors.primary[500]} />
              <Text style={[styles.actionText, { color: colors.text.primary }]}>
                Payer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('EditDebt', { debtId })}
            >
              <Ionicons name="create" size={24} color={colors.semantic.warning} />
              <Text style={[styles.actionText, { color: colors.text.primary }]}>
                Modifier
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informations détaillées */}
        <View style={[styles.infoCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Informations
          </Text>
          
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                Date de début
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {new Date(debt.startDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                Date d'échéance
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {new Date(debt.dueDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                Catégorie
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {debt.category}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                Progression
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {progressPercentage.toFixed(1)}%
              </Text>
            </View>
          </View>

          {debt.notes && (
            <View style={styles.notesSection}>
              <Text style={[styles.notesLabel, { color: colors.text.secondary }]}>
                Notes
              </Text>
              <Text style={[styles.notesValue, { color: colors.text.primary }]}>
                {debt.notes}
              </Text>
            </View>
          )}
        </View>

        {/* Historique des paiements */}
        <View style={[styles.paymentsCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Historique des Paiements ({payments.length})
            </Text>
          </View>

          {payments.length === 0 ? (
            <View style={styles.emptyPayments}>
              <Ionicons name="receipt-outline" size={48} color={colors.text.disabled} />
              <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                Aucun paiement enregistré
              </Text>
            </View>
          ) : (
            <View style={styles.paymentsList}>
              {payments.map((payment) => (
                <View key={payment.id} style={styles.paymentItem}>
                  <View style={styles.paymentLeft}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.semantic.success} />
                    <View style={styles.paymentDetails}>
                      <Text style={[styles.paymentAmount, { color: colors.text.primary }]}>
                        {formatDisplayAmount(payment.amount)} {/* ✅ CORRECTION: Format devise */}
                      </Text>
                      <Text style={[styles.paymentDate, { color: colors.text.secondary }]}>
                        {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={[styles.paymentPrincipal, { color: colors.text.secondary }]}>
                      Principal: {formatDisplayAmount(payment.principal, false)} {/* ✅ CORRECTION: Format devise */}
                    </Text>
                    <Text style={[styles.paymentInterest, { color: colors.text.secondary }]}>
                      Intérêts: {formatDisplayAmount(payment.interest, false)} {/* ✅ CORRECTION: Format devise */}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Zone de danger */}
        <View style={[styles.dangerCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.dangerTitle, { color: colors.semantic.error }]}>
            Zone de danger
          </Text>
          <Text style={[styles.dangerText, { color: colors.text.secondary }]}>
            La suppression est irréversible et supprimera toutes les données associées à cette dette.
          </Text>
          <TouchableOpacity 
            style={[styles.deleteButton, { backgroundColor: colors.semantic.error + '10', borderLeftColor: colors.semantic.error }]}
            onPress={handleDeleteDebt}
          >
            <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
            <Text style={[styles.deleteButtonText, { color: colors.semantic.error }]}>Supprimer la dette</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de paiement */}
      {showPaymentForm && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background.primary }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border.primary }]}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Effectuer un paiement
              </Text>
              <TouchableOpacity onPress={() => setShowPaymentForm(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentForm}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                  Montant à payer
                </Text>
                <View style={styles.amountContainer}>
                  <TextInput
                    style={[styles.input, styles.amountInput, { backgroundColor: colors.background.card, color: colors.text.primary, borderColor: colors.border.primary }]}
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                    placeholder="0,00"
                    placeholderTextColor={colors.text.disabled}
                    keyboardType="decimal-pad"
                  />
                </View>
                <Text style={[styles.hint, { color: colors.text.secondary }]}>
                  Solde restant: {formatDisplayAmount(debt.currentAmount)} {/* ✅ CORRECTION: Format devise */}
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text.primary }]}>
                  Compte source
                </Text>
                <View style={styles.accountsList}>
                  {sourceAccounts.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.accountButton,
                        { backgroundColor: colors.background.card, borderColor: colors.border.primary },
                        selectedAccountId === account.id && { borderColor: colors.primary[500], backgroundColor: colors.primary[100] },
                      ]}
                      onPress={() => setSelectedAccountId(account.id)}
                    >
                      <View style={[styles.accountColor, { backgroundColor: account.color }]} />
                      <View style={styles.accountInfo}>
                        <Text style={[styles.accountName, { color: colors.text.primary }]}>
                          {account.name}
                        </Text>
                        <Text style={[styles.accountBalance, { color: colors.text.secondary }]}>
                          {formatDisplayAmount(account.balance, false)} disponible {/* ✅ CORRECTION: Format devise */}
                        </Text>
                      </View>
                      {selectedAccountId === account.id && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                {sourceAccounts.length === 0 && (
                  <Text style={[styles.warningText, { color: colors.text.secondary }]}>
                    Aucun compte avec un solde suffisant
                  </Text>
                )}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.cancelButton, { backgroundColor: colors.background.secondary, borderColor: colors.border.primary }]}
                  onPress={() => setShowPaymentForm(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text.primary }]}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.confirmButton,
                    { backgroundColor: colors.primary[500] },
                    (!paymentAmount || !selectedAccountId || paymentLoading) && { opacity: 0.5 },
                  ]}
                  onPress={handleMakePayment}
                  disabled={!paymentAmount || !selectedAccountId || paymentLoading}
                >
                  <Text style={[styles.confirmButtonText, { color: colors.text.inverse }]}>
                    {paymentLoading ? 'Paiement...' : 'Confirmer'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mainCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  debtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  debtInfo: {
    flex: 1,
  },
  debtName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  creditor: {
    fontSize: 14,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  initialAmount: {
    fontSize: 14,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  eligibilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  eligible: {
    backgroundColor: '#10B98120',
  },
  notEligible: {
    backgroundColor: '#EF444420',
  },
  eligibilityText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  actionsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  notesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  notesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notesValue: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  paymentsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  emptyPayments: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  paymentsList: {
    gap: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDetails: {
    marginLeft: 12,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentPrincipal: {
    fontSize: 12,
    marginBottom: 2,
  },
  paymentInterest: {
    fontSize: 12,
  },
  dangerCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  dangerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FF3B3010',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    gap: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  paymentForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  // ✅ CORRECTION: Styles pour le conteneur de montant avec devise
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 12,
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  amountInput: {
    paddingLeft: 10,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  hint: {
    fontSize: 12,
    color: '#666',
  },
  warningText: {
    fontSize: 12,
    color: '#EF4444',
    fontStyle: 'italic',
  },
  accountsList: {
    gap: 8,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
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
    color: '#000',
  },
  accountBalance: {
    fontSize: 12,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default DebtDetailScreen;