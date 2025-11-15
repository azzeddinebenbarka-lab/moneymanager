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
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { useDebts } from '../hooks/useDebts';
import { Debt, DebtPayment } from '../types/Debt';

interface DebtDetailScreenProps {
  navigation: any;
  route: any;
}

const DebtDetailScreen: React.FC<DebtDetailScreenProps> = ({ navigation, route }) => {
  const { debtId } = route.params;
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
      Alert.alert('Erreur', 'Impossible de charger les données de la dette');
    } finally {
      setLoading(false);
    }
  }, [debtId, getDebtById, getPaymentHistory]);

  const handleMakePayment = async () => {
    if (!debt || !paymentAmount || !selectedAccountId) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Montant invalide');
      return;
    }

    if (amount > debt.currentAmount) {
      Alert.alert('Erreur', 'Le montant ne peut pas dépasser le solde restant');
      return;
    }

    if (debt.paymentEligibility && !debt.paymentEligibility.isEligible) {
      Alert.alert('Paiement non autorisé', debt.paymentEligibility.reason);
      return;
    }

    setPaymentLoading(true);
    try {
      await makePayment(debtId, amount, selectedAccountId);
      
      Alert.alert('Succès', 'Paiement effectué avec succès');
      setShowPaymentForm(false);
      setPaymentAmount('');
      setSelectedAccountId('');
      await loadDebtData();
      await refreshDebts();
    } catch (error: any) {
      console.error('Error making payment:', error);
      Alert.alert('Erreur', error.message || 'Impossible d\'effectuer le paiement');
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
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDebt(debtId);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Erreur', error.message || 'Impossible de supprimer la dette');
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
      <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Chargement...
        </Text>
      </View>
    );
  }

  const sourceAccounts = accounts.filter(acc => acc.type !== 'savings' && acc.balance > 0);
  const progressPercentage = Math.max(0, ((debt.initialAmount - debt.currentAmount) / debt.initialAmount) * 100);

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.darkText]}>
          Détails de la Dette
        </Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('EditDebt', { debtId })}
        >
          <Ionicons name="create-outline" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Carte principale */}
        <View style={[styles.mainCard, isDark && styles.darkCard]}>
          <View style={styles.debtHeader}>
            <View style={[styles.colorIndicator, { backgroundColor: debt.color }]} />
            <View style={styles.debtInfo}>
              <Text style={[styles.debtName, isDark && styles.darkText]}>
                {debt.name}
              </Text>
              <Text style={[styles.creditor, isDark && styles.darkSubtext]}>
                {debt.creditor}
              </Text>
            </View>
          </View>
          
          <View style={styles.amountSection}>
            <Text style={[styles.currentAmount, isDark && styles.darkText]}>
              {formatDisplayAmount(debt.currentAmount)} {/* ✅ CORRECTION: Format devise */}
            </Text>
            <Text style={[styles.initialAmount, isDark && styles.darkSubtext]}>
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
            <Text style={[styles.progressText, isDark && styles.darkSubtext]}>
              {progressPercentage.toFixed(1)}% remboursé
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                Taux d'intérêt
              </Text>
              <Text style={[styles.statValue, isDark && styles.darkText]}>
                {debt.interestRate}%
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                Mensualité
              </Text>
              <Text style={[styles.statValue, isDark && styles.darkText]}>
                {formatDisplayAmount(debt.monthlyPayment)} {/* ✅ CORRECTION: Format devise */}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
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
                color={debt.paymentEligibility.isEligible ? "#10B981" : "#EF4444"} 
              />
              <Text style={[
                styles.eligibilityText,
                isDark && styles.darkText
              ]}>
                {debt.paymentEligibility.isEligible 
                  ? 'Paiement autorisé ce mois' 
                  : debt.paymentEligibility.reason}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={[styles.actionsCard, isDark && styles.darkCard]}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
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
              <Ionicons name="card" size={24} color="#007AFF" />
              <Text style={[styles.actionText, isDark && styles.darkText]}>
                Payer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('EditDebt', { debtId })}
            >
              <Ionicons name="create" size={24} color="#F59E0B" />
              <Text style={[styles.actionText, isDark && styles.darkText]}>
                Modifier
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informations détaillées */}
        <View style={[styles.infoCard, isDark && styles.darkCard]}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Informations
          </Text>
          
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, isDark && styles.darkSubtext]}>
                Date de début
              </Text>
              <Text style={[styles.infoValue, isDark && styles.darkText]}>
                {new Date(debt.startDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, isDark && styles.darkSubtext]}>
                Date d'échéance
              </Text>
              <Text style={[styles.infoValue, isDark && styles.darkText]}>
                {new Date(debt.dueDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, isDark && styles.darkSubtext]}>
                Catégorie
              </Text>
              <Text style={[styles.infoValue, isDark && styles.darkText]}>
                {debt.category}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, isDark && styles.darkSubtext]}>
                Progression
              </Text>
              <Text style={[styles.infoValue, isDark && styles.darkText]}>
                {progressPercentage.toFixed(1)}%
              </Text>
            </View>
          </View>

          {debt.notes && (
            <View style={styles.notesSection}>
              <Text style={[styles.notesLabel, isDark && styles.darkSubtext]}>
                Notes
              </Text>
              <Text style={[styles.notesValue, isDark && styles.darkText]}>
                {debt.notes}
              </Text>
            </View>
          )}
        </View>

        {/* Historique des paiements */}
        <View style={[styles.paymentsCard, isDark && styles.darkCard]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              Historique des Paiements ({payments.length})
            </Text>
          </View>

          {payments.length === 0 ? (
            <View style={styles.emptyPayments}>
              <Ionicons name="receipt-outline" size={48} color="#666" />
              <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
                Aucun paiement enregistré
              </Text>
            </View>
          ) : (
            <View style={styles.paymentsList}>
              {payments.map((payment) => (
                <View key={payment.id} style={styles.paymentItem}>
                  <View style={styles.paymentLeft}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <View style={styles.paymentDetails}>
                      <Text style={[styles.paymentAmount, isDark && styles.darkText]}>
                        {formatDisplayAmount(payment.amount)} {/* ✅ CORRECTION: Format devise */}
                      </Text>
                      <Text style={[styles.paymentDate, isDark && styles.darkSubtext]}>
                        {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={[styles.paymentPrincipal, isDark && styles.darkSubtext]}>
                      Principal: {formatDisplayAmount(payment.principal, false)} {/* ✅ CORRECTION: Format devise */}
                    </Text>
                    <Text style={[styles.paymentInterest, isDark && styles.darkSubtext]}>
                      Intérêts: {formatDisplayAmount(payment.interest, false)} {/* ✅ CORRECTION: Format devise */}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Zone de danger */}
        <View style={[styles.dangerCard, isDark && styles.darkCard]}>
          <Text style={[styles.dangerTitle, isDark && styles.darkText]}>
            Zone de danger
          </Text>
          <Text style={[styles.dangerText, isDark && styles.darkSubtext]}>
            La suppression est irréversible et supprimera toutes les données associées à cette dette.
          </Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteDebt}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={styles.deleteButtonText}>Supprimer la dette</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de paiement */}
      {showPaymentForm && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.darkCard]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.darkText]}>
                Effectuer un paiement
              </Text>
              <TouchableOpacity onPress={() => setShowPaymentForm(false)}>
                <Ionicons name="close" size={24} color={isDark ? "#fff" : "#000"} />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentForm}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>
                  Montant à payer
                </Text>
                <View style={styles.amountContainer}>
                  <TextInput
                    style={[styles.input, styles.amountInput, isDark && styles.darkInput]}
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                    placeholder="0,00"
                    placeholderTextColor={isDark ? "#888" : "#999"}
                    keyboardType="decimal-pad"
                  />
                </View>
                <Text style={[styles.hint, isDark && styles.darkSubtext]}>
                  Solde restant: {formatDisplayAmount(debt.currentAmount)} {/* ✅ CORRECTION: Format devise */}
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>
                  Compte source
                </Text>
                <View style={styles.accountsList}>
                  {sourceAccounts.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.accountButton,
                        selectedAccountId === account.id && styles.accountButtonSelected,
                        isDark && styles.darkAccountButton
                      ]}
                      onPress={() => setSelectedAccountId(account.id)}
                    >
                      <View style={[styles.accountColor, { backgroundColor: account.color }]} />
                      <View style={styles.accountInfo}>
                        <Text style={[styles.accountName, isDark && styles.darkText]}>
                          {account.name}
                        </Text>
                        <Text style={[styles.accountBalance, isDark && styles.darkSubtext]}>
                          {formatDisplayAmount(account.balance, false)} disponible {/* ✅ CORRECTION: Format devise */}
                        </Text>
                      </View>
                      {selectedAccountId === account.id && (
                        <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                {sourceAccounts.length === 0 && (
                  <Text style={[styles.warningText, isDark && styles.darkSubtext]}>
                    Aucun compte avec un solde suffisant
                  </Text>
                )}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.cancelButton, isDark && styles.darkCancelButton]}
                  onPress={() => setShowPaymentForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.confirmButton,
                    (!paymentAmount || !selectedAccountId || paymentLoading) && styles.confirmButtonDisabled
                  ]}
                  onPress={handleMakePayment}
                  disabled={!paymentAmount || !selectedAccountId || paymentLoading}
                >
                  <Text style={styles.confirmButtonText}>
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
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkHeader: {
    backgroundColor: '#2c2c2e',
    borderBottomColor: '#38383a',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
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
    color: '#000',
    marginBottom: 4,
  },
  creditor: {
    fontSize: 14,
    color: '#666',
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  initialAmount: {
    fontSize: 14,
    color: '#666',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
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
    color: '#666',
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
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
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
    color: '#000',
    flex: 1,
  },
  actionsCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    gap: 8,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  infoCard: {
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
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
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
    color: '#000',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentPrincipal: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  paymentInterest: {
    fontSize: 12,
    color: '#666',
  },
  dangerCard: {
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
  darkInput: {
    backgroundColor: '#38383a',
    borderColor: '#555',
    color: '#fff',
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
  darkAccountButton: {
    backgroundColor: '#38383a',
    borderColor: '#555',
  },
  accountButtonSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
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
  darkCancelButton: {
    backgroundColor: '#38383a',
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
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default DebtDetailScreen;