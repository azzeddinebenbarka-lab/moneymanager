// src/components/debts/DebtCard.tsx - VERSION CORRIGÉE POUR PHASE 2
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Debt } from '../../types/Debt';
import DebtCalculator from '../../utils/debtCalculator';

interface DebtCardProps {
  debt: Debt;
  onPress: () => void;
  onPay?: () => void;
  showPayButton?: boolean;
}

export const DebtCard: React.FC<DebtCardProps> = ({
  debt,
  onPress,
  onPay,
  showPayButton = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ✅ Utiliser le calculateur pour l'éligibilité
  const eligibility = DebtCalculator.calculatePaymentEligibility(debt);
  const isDueThisMonth = DebtCalculator.isDueThisMonth(debt);
  const isOverdue = DebtCalculator.isDebtOverdue(debt);
  
  // ✅ Calcul correct de la progression : montant payé / montant initial
  const amountPaid = debt.initialAmount - debt.currentAmount;
  const progressPercentage = debt.initialAmount > 0 ? 
    (amountPaid / debt.initialAmount) * 100 : 0;

  const getStatusInfo = () => {
    switch (debt.status) {
      case 'active':
        return { 
          label: isDueThisMonth ? 'Échéance ce mois' : 'Active', 
          color: isDueThisMonth ? '#FF9500' : '#007AFF',
          icon: isDueThisMonth ? 'alert-circle' : 'time'
        };
      case 'overdue':
        return { 
          label: 'En retard', 
          color: '#FF3B30', 
          icon: 'warning' 
        };
      case 'paid':
        return { 
          label: 'Payée', 
          color: '#34C759', 
          icon: 'checkmark-circle' 
        };
      case 'future':
        return { 
          label: 'Future', 
          color: '#8E8E93', 
          icon: 'calendar' 
        };
      default:
        return { 
          label: 'Active', 
          color: '#007AFF', 
          icon: 'time' 
        };
    }
  };

  const statusInfo = getStatusInfo();
  const dueDate = new Date(debt.dueDate);
  const now = new Date();

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (): number => {
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // ✅ COMPOSANT D'ÉLIGIBILITY BADGE
  const EligibilityBadge: React.FC<{ eligibility: Debt['paymentEligibility'] }> = ({ eligibility }) => {
    if (eligibility.isEligible) {
      return (
        <View style={styles.eligibleBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          <Text style={styles.eligibleText}>Paiement autorisé</Text>
        </View>
      );
    }

    if (eligibility.isPastDue) {
      return (
        <View style={styles.pastDueBadge}>
          <Ionicons name="warning" size={14} color="#EF4444" />
          <Text style={styles.pastDueText}>En retard</Text>
        </View>
      );
    }

    if (eligibility.isFutureDue) {
      return (
        <View style={styles.futureBadge}>
          <Ionicons name="calendar" size={14} color="#F59E0B" />
          <Text style={styles.futureText}>Future</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      style={[styles.card, isDark && styles.darkCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* En-tête avec nom et statut */}
      <View style={styles.header}>
        <View style={styles.debtInfo}>
          <View style={[styles.colorIndicator, { backgroundColor: debt.color }]} />
          <View style={styles.textContainer}>
            <Text style={[styles.debtName, isDark && styles.darkText]} numberOfLines={1}>
              {debt.name}
            </Text>
            <Text style={[styles.creditor, isDark && styles.darkSubtext]} numberOfLines={1}>
              {debt.creditor}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Ionicons 
              name={statusInfo.icon as any} 
              size={14} 
              color={statusInfo.color} 
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
          {/* ✅ BADGE D'ÉLIGIBILITÉ */}
          <EligibilityBadge eligibility={debt.paymentEligibility} />
        </View>
      </View>

      {/* Montants et progression */}
      <View style={styles.amountsContainer}>
        <View style={styles.amountColumn}>
          <Text style={[styles.amountLabel, isDark && styles.darkSubtext]}>
            Restant dû
          </Text>
          <Text style={[styles.currentAmount, isDark && styles.darkText]}>
            {debt.currentAmount.toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} MAD
          </Text>
        </View>
        
        <View style={styles.amountColumn}>
          <Text style={[styles.amountLabel, isDark && styles.darkSubtext]}>
            Mensualité
          </Text>
          <Text style={[styles.monthlyPayment, isDark && styles.darkText]}>
            {debt.monthlyPayment.toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} MAD
          </Text>
        </View>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, isDark && styles.darkProgressBackground]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(progressPercentage, 100)}%`,
                backgroundColor: progressPercentage >= 100 ? '#34C759' : statusInfo.color
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, isDark && styles.darkSubtext]}>
          {progressPercentage.toFixed(0)}% remboursé
        </Text>
      </View>

      {/* Informations d'échéance */}
      <View style={styles.dueDateContainer}>
        <View style={styles.dueDateInfo}>
          <Ionicons 
            name="calendar" 
            size={16} 
            color={isDark ? '#888' : '#666'} 
          />
          <Text style={[styles.dueDateLabel, isDark && styles.darkSubtext]}>
            Échéance:
          </Text>
          <Text style={[
            styles.dueDateValue, 
            isDark && styles.darkText,
            isOverdue && styles.overdueText
          ]}>
            {formatDate(dueDate)}
          </Text>
          
          {debt.status === 'active' && !isOverdue && (
            <Text style={[styles.daysText, isDark && styles.darkSubtext]}>
              ({getDaysUntilDue()} jour{getDaysUntilDue() !== 1 ? 's' : ''})
            </Text>
          )}
        </View>

        {isOverdue && (
          <View style={styles.overdueBadge}>
            <Ionicons name="warning" size={14} color="#FF3B30" />
            <Text style={styles.overdueBadgeText}>RETARD</Text>
          </View>
        )}
      </View>

      {/* Message d'éligibilité détaillé */}
      {!eligibility.isEligible && eligibility.reason && (
        <View style={styles.eligibilityContainer}>
          <Ionicons name="information-circle" size={16} color="#FF9500" />
          <Text style={[styles.eligibilityText, isDark && styles.darkSubtext]}>
            {eligibility.reason}
            {eligibility.nextEligibleDate && `\nProchain paiement: ${formatDate(new Date(eligibility.nextEligibleDate))}`}
          </Text>
        </View>
      )}

      {/* Bouton de paiement */}
      {showPayButton && debt.status !== 'paid' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.payButton,
              !eligibility.isEligible && styles.payButtonDisabled
            ]}
            onPress={onPay}
            disabled={!eligibility.isEligible}
          >
            <Ionicons 
              name="card" 
              size={18} 
              color={eligibility.isEligible ? '#fff' : '#999'} 
            />
            <Text style={[
              styles.payButtonText,
              !eligibility.isEligible && styles.payButtonTextDisabled
            ]}>
              Payer
            </Text>
          </TouchableOpacity>

          {!eligibility.isEligible && eligibility.nextEligibleDate && (
            <Text style={[styles.nextEligibleText, isDark && styles.darkSubtext]}>
              Prochain paiement: {formatDate(new Date(eligibility.nextEligibleDate))}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  debtInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  debtName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  creditor: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Styles pour les badges d'éligibilité
  eligibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  eligibleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
  },
  pastDueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF444420',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pastDueText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
  },
  futureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  futureText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F59E0B',
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountColumn: {
    alignItems: 'flex-start',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  currentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  monthlyPayment: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  darkProgressBackground: {
    backgroundColor: '#38383a',
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
  dueDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dueDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueDateLabel: {
    fontSize: 12,
    color: '#666',
  },
  dueDateValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  overdueText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  daysText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B3020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  overdueBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  eligibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF950020',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  eligibilityText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    fontStyle: 'italic',
  },
  actions: {
    alignItems: 'center',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  payButtonTextDisabled: {
    color: '#999',
  },
  nextEligibleText: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default DebtCard;