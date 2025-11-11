// /src/components/debts/DebtDetailHeader.tsx
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Debt } from '../../types/Debt';
import { ProgressBar } from '../ui/ProgressBar';

interface Props {
  debt: Debt; 
  onAddPayment: (amount: number) => void;
}

export const DebtDetailHeader = ({ debt, onAddPayment }: Props) => {
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((debt.initialAmount - debt.currentAmount) / debt.initialAmount) * 100;
  const remainingAmount = debt.initialAmount - debt.currentAmount;
  const totalPaid = debt.initialAmount - debt.currentAmount;

  const handleAddPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return;
    } 

    const amount = parseFloat(paymentAmount);
    if (amount > debt.currentAmount) {
      Alert.alert('Erreur', 'Le montant ne peut pas dépasser le solde restant');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddPayment(amount);
      setPaymentAmount('');
      setShowPaymentInput(false);
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* En-tête principal */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.debtName}>{debt.name}</Text>
          <Text style={styles.creditor}>{debt.creditor}</Text>
          <View style={[styles.statusBadge, styles[debt.status]]}>
            <Text style={styles.statusText}>
              {debt.status === 'active' ? 'Active' : 
               debt.status === 'overdue' ? 'En Retard' : 'Payée'}
            </Text>
          </View>
        </View>
        
        <View style={styles.amountSection}>
          <Text style={styles.currentAmount}>€{debt.currentAmount.toLocaleString()}</Text>
          <Text style={styles.initialAmount}>sur €{debt.initialAmount.toLocaleString()}</Text>
        </View>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progression</Text>
          <Text style={styles.progressPercentage}>{progress.toFixed(1)}%</Text>
        </View>
        <ProgressBar progress={progress} color="#3498db" height={8} />
        <View style={styles.progressFooter}>
          <Text style={styles.progressText}>
            €{totalPaid.toLocaleString()} remboursés
          </Text>
          <Text style={styles.progressText}>
            €{remainingAmount.toLocaleString()} restants
          </Text>
        </View>
      </View>

      {/* Informations détaillées */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Mensualité</Text>
          <Text style={styles.detailValue}>€{debt.monthlyPayment.toLocaleString()}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Taux d'intérêt</Text>
          <Text style={styles.detailValue}>{debt.interestRate}%</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Prochaine échéance</Text>
          <Text style={styles.detailValue}>
            {new Date(debt.dueDate).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>
            {debt.type === 'personal' ? 'Personnel' :
             debt.type === 'mortgage' ? 'Immobilier' :
             debt.type === 'credit_card' ? 'Carte crédit' : 'Prêt'}
          </Text>
        </View>
      </View>

      {/* Ajout de paiement */}
      {debt.status !== 'paid' && (
        <View style={styles.paymentSection}>
          {!showPaymentInput ? (
            <TouchableOpacity
              style={styles.addPaymentButton}
              onPress={() => setShowPaymentInput(true)}
            >
              <Text style={styles.addPaymentButtonText}>Ajouter un paiement</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.paymentInputContainer}>
              <Text style={styles.paymentInputLabel}>Montant du paiement</Text>
              <View style={styles.paymentInputRow}>
                <Text style={styles.currencySymbol}>€</Text>
                <TextInput
                  style={styles.paymentInput}
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
                  onPress={handleAddPayment}
                  disabled={isSubmitting}
                >
                  <Text style={styles.confirmButtonText}>
                    {isSubmitting ? '...' : 'Valider'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowPaymentInput(false);
                    setPaymentAmount('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleSection: {
    flex: 1,
  },
  debtName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  creditor: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  active: {
    backgroundColor: '#d4edda',
  },
  overdue: {
    backgroundColor: '#f8d7da',
  },
  paid: {
    backgroundColor: '#e2e3e5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#155724',
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  initialAmount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3498db',
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#6c757d',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 20,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  paymentSection: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  addPaymentButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addPaymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentInputContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  paymentInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  paymentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginRight: 8,
  },
  paymentInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 14,
  },
});