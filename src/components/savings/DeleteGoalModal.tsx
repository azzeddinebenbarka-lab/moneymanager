// src/components/savings/DeleteGoalModal.tsx - VERSION AMÉLIORÉE AVEC AFFICHAGE DES TRANSACTIONS
import { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useSavings } from '../../hooks/useSavings';
import { SavingsGoal } from '../../types/Savings';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (withRefund: boolean, deleteTransactions: boolean) => Promise<void>;
  goal: SavingsGoal;
  loading?: boolean;
}

export const DeleteGoalModal = ({ visible, onClose, onConfirm, goal, loading = false }: Props) => {
  const [refundOption, setRefundOption] = useState<'refund' | 'keep'>('refund');
  const [deleteTransactions, setDeleteTransactions] = useState<boolean>(true);
  const [relatedTransactionsCount, setRelatedTransactionsCount] = useState<number>(0);
  const [relatedTransactions, setRelatedTransactions] = useState<any[]>([]);
  const [showTransactionsDetails, setShowTransactionsDetails] = useState<boolean>(false);
  
  const { t } = useLanguage();
  const { getRelatedTransactionsCount, getRelatedTransactionsDetails } = useSavings();

  useEffect(() => {
    if (visible && goal) {
      loadRelatedTransactionsInfo();
    }
  }, [visible, goal]);

  const loadRelatedTransactionsInfo = async () => {
    try {
      const count = await getRelatedTransactionsCount(goal.id);
      setRelatedTransactionsCount(count);
      
      if (count > 0) {
        const transactions = await getRelatedTransactionsDetails(goal.id);
        setRelatedTransactions(transactions);
      }
    } catch (error) {
      console.error('Error loading related transactions info:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      await onConfirm(refundOption === 'refund', deleteTransactions);
      onClose();
    } catch (error) {
      // L'erreur est gérée dans le parent
    }
  };

  const handleClose = () => {
    setRefundOption('refund');
    setDeleteTransactions(true);
    setShowTransactionsDetails(false);
    setRelatedTransactionsCount(0);
    setRelatedTransactions([]);
    onClose();
  };

  const formatAmount = (amount: number) => {
    return `${Math.round(amount)} Dh`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* En-tête */}
            <View style={styles.header}>
              <Text style={styles.title}>{t.deleteGoalTitle}</Text>
              <Text style={styles.subtitle}>{goal.name}</Text>
            </View>

            {/* Montant actuel */}
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>{t.savedAmount}</Text>
              <Text style={styles.amount}>{formatAmount(goal.currentAmount)}</Text>
            </View>

            {/* ✅ SECTION TRANSACTIONS LIÉES */}
            {relatedTransactionsCount > 0 && (
              <View style={styles.transactionsInfoSection}>
                <Text style={styles.sectionLabel}>{t.transactionsLinked}</Text>
                <View style={styles.transactionsSummary}>
                  <Text style={styles.transactionsCount}>
                    {relatedTransactionsCount} {t.transactionAssociated}{relatedTransactionsCount > 1 ? 's' : ''}
                  </Text>
                  <TouchableOpacity 
                    style={styles.detailsButton}
                    onPress={() => setShowTransactionsDetails(!showTransactionsDetails)}
                  >
                    <Text style={styles.detailsButtonText}>
                      {showTransactionsDetails ? t.hideDetails : t.seeDetails} {t.details}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showTransactionsDetails && (
                  <View style={styles.transactionsDetails}>
                    <Text style={styles.detailsTitle}>{t.transactionsToDelete}</Text>
                    {relatedTransactions
                      .filter((transaction, index, self) => 
                        self.findIndex(t => t.id === transaction.id) === index
                      )
                      .slice(0, 5)
                      .map((transaction, index) => (
                      <View key={transaction.id} style={styles.transactionItem}>
                        <Text style={styles.transactionDescription} numberOfLines={1}>
                          {transaction.description}
                        </Text>
                        <View style={styles.transactionDetails}>
                          <Text style={styles.transactionAmount}>
                            {formatAmount(Math.abs(transaction.amount))}
                          </Text>
                          <Text style={styles.transactionDate}>
                            {formatDate(transaction.date)}
                          </Text>
                        </View>
                      </View>
                    ))}
                    {relatedTransactions.length > 5 && (
                      <Text style={styles.moreTransactionsText}>
                        ... {t.and} {relatedTransactions.length - 5} {t.moreTransactions}{relatedTransactions.length - 5 > 1 ? 's' : ''}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Options de remboursement */}
            <View style={styles.optionsSection}>
              <Text style={styles.sectionLabel}>{t.whatDoWithSavedMoney}</Text>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  refundOption === 'refund' && styles.optionButtonSelected
                ]}
                onPress={() => setRefundOption('refund')}
                disabled={loading}
              >
                <View style={styles.optionRadio}>
                  {refundOption === 'refund' && <View style={styles.optionRadioSelected} />}
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t.refundToSourceAccount}</Text>
                  <Text style={styles.optionDescription}>
                    {t.moneyWillBeTransferred}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  refundOption === 'keep' && styles.optionButtonSelected
                ]}
                onPress={() => setRefundOption('keep')}
                disabled={loading}
              >
                <View style={styles.optionRadio}>
                  {refundOption === 'keep' && <View style={styles.optionRadioSelected} />}
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t.keepOnSavingsAccount}</Text>
                  <Text style={styles.optionDescription}>
                    {t.moneyWillRemain}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* ✅ OPTION : Suppression des transactions */}
            <View style={styles.transactionsSection}>
              <Text style={styles.sectionLabel}>{t.transactionsManagement}</Text>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  deleteTransactions && styles.optionButtonSelected
                ]}
                onPress={() => setDeleteTransactions(true)}
                disabled={loading}
              >
                <View style={styles.optionRadio}>
                  {deleteTransactions && <View style={styles.optionRadioSelected} />}
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t.deleteRelatedTransactions}</Text>
                  <Text style={styles.optionDescription}>
                    {relatedTransactionsCount > 0 
                      ? `${relatedTransactionsCount} ${t.transactionAssociated}${relatedTransactionsCount > 1 ? 's' : ''} ${t.willBeDeleted}${relatedTransactionsCount > 1 ? 's' : ''}`
                      : t.savingsTransfersWillBeDeleted
                    }
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  !deleteTransactions && styles.optionButtonSelected
                ]}
                onPress={() => setDeleteTransactions(false)}
                disabled={loading}
              >
                <View style={styles.optionRadio}>
                  {!deleteTransactions && <View style={styles.optionRadioSelected} />}
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t.keepTransactions}</Text>
                  <Text style={styles.optionDescription}>
                    {t.transferHistoryKept}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Avertissements */}
            {refundOption === 'keep' && (
              <View style={styles.warningSection}>
                <Text style={styles.warningText}>
                  {t.moneyWillStayWarning}
                </Text>
              </View>
            )}

            {deleteTransactions && relatedTransactionsCount > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.infoText}>
                  ℹ️ {relatedTransactionsCount} transaction{relatedTransactionsCount > 1 ? 's' : ''} contenant "{goal.name}" dans leur description seront supprimée{relatedTransactionsCount > 1 ? 's' : ''}.
                </Text>
              </View>
            )}

            {!deleteTransactions && relatedTransactionsCount > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.infoText}>
                  ℹ️ Les {relatedTransactionsCount} transaction{relatedTransactionsCount > 1 ? 's' : ''} liées seront conservées dans votre historique.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelButton, loading && styles.buttonDisabled]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.confirmButton,
                loading && styles.buttonDisabled
              ]}
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? t.deletingGoal : t.confirm}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
  amountSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  // ✅ NOUVEAUX STYLES POUR LES TRANSACTIONS
  transactionsInfoSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
  },
  transactionsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  transactionsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  detailsButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#1976d2',
    borderRadius: 6,
  },
  detailsButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  transactionsDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  transactionDescription: {
    flex: 1,
    fontSize: 12,
    color: '#424242',
    marginRight: 8,
  },
  transactionDetails: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
  },
  transactionDate: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2,
  },
  moreTransactionsText: {
    fontSize: 11,
    color: '#757575',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  optionsSection: {
    marginBottom: 16,
  },
  transactionsSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#adb5bd',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 18,
  },
  warningSection: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoSection: {
    backgroundColor: '#d1ecf1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#0c5460',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default DeleteGoalModal;