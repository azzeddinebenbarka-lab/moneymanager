// /src/components/savings/SavingsGoalDetail.tsx
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { useSavings } from '../../hooks/useSavings';
import { SavingsGoal } from '../../types/Savings';
import { ProgressBar } from '../ui/ProgressBar';

interface Props {
  goal: SavingsGoal;
  onAddContribution: () => void; 
}

export const SavingsGoalDetail = ({ goal, onAddContribution }: Props) => {
  const { calculateGoalAchievementDate } = useSavings();
  const { formatAmount } = useCurrency();

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const isCompleted = goal.isCompleted;

  // Calcul de la date d'atteinte réelle
  const achievementDate = useMemo(() => {
    if (isCompleted) {
      return new Date(goal.targetDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    
    const calculatedDate = calculateGoalAchievementDate(
      goal.targetAmount,
      goal.currentAmount,
      goal.monthlyContribution 
    );
    
    return new Date(calculatedDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [goal, isCompleted, calculateGoalAchievementDate]);

  // Calcul du temps restant
  const timeRemaining = useMemo(() => {
    if (isCompleted) return { months: 0, years: 0 };

    const today = new Date();
    const targetDate = new Date(achievementDate);
    const months = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
                  (targetDate.getMonth() - today.getMonth());
    
    return {
      years: Math.floor(months / 12),
      months: months % 12
    };
  }, [achievementDate, isCompleted]);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      vacation: 'Vacances',
      emergency: 'Fonds d\'urgence',
      house: 'Maison',
      car: 'Voiture',
      education: 'Éducation',
      retirement: 'Retraite',
      other: 'Autre'
    };
    return labels[category] || 'Autre';
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryIcon}>{goal.icon}</Text>
          <Text style={styles.categoryText}>{getCategoryLabel(goal.category)}</Text>
        </View>
        
        <Text style={styles.goalName}>{goal.name}</Text>
        
        <View style={styles.amountSection}>
          <Text style={styles.currentAmount}>{formatAmount(goal.currentAmount)}</Text>
          <Text style={styles.targetAmount}>sur {formatAmount(goal.targetAmount)}</Text>
        </View>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progression</Text>
          <Text style={styles.progressPercentage}>{progress.toFixed(1)}%</Text>
        </View>
        <ProgressBar 
          progress={progress} 
          color={isCompleted ? '#28a745' : goal.color}
          height={10}
        />
        <View style={styles.progressFooter}>
          <Text style={styles.progressText}>
            {formatAmount(goal.currentAmount)} épargnés
          </Text>
          <Text style={styles.progressText}>
            {formatAmount(remainingAmount)} restants
          </Text>
        </View>
      </View>

      {/* Statistiques détaillées */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Contribution mensuelle</Text>
          <Text style={styles.statValue}>{formatAmount(goal.monthlyContribution)}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Date prévue</Text>
          <Text style={styles.statValue}>{achievementDate}</Text>
        </View>
        
        {!isCompleted && (
          <>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Temps restant</Text>
              <Text style={styles.statValue}>
                {timeRemaining.years > 0 && `${timeRemaining.years} an${timeRemaining.years > 1 ? 's' : ''} `}
                {timeRemaining.months > 0 && `${timeRemaining.months} mois`}
                {timeRemaining.years === 0 && timeRemaining.months === 0 && 'Moins d\'un mois'}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Progression mensuelle</Text>
              <Text style={styles.statValue}>
                {((goal.monthlyContribution / goal.targetAmount) * 100).toFixed(1)}%
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Message de félicitations si complété */}
      {isCompleted && (
        <View style={styles.completionMessage}>
          <Text style={styles.completionIcon}>🎉</Text>
          <Text style={styles.completionText}>
            Félicitations ! Vous avez atteint votre objectif le {' '}
            {new Date(goal.targetDate).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      )}

      {/* Actions rapides */}
      {!isCompleted && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: goal.color }]}
            onPress={onAddContribution}
          >
            <Text style={styles.quickActionText}>Ajouter une contribution</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  goalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  amountSection: {
    alignItems: 'flex-start',
  },
  currentAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  targetAmount: {
    fontSize: 16,
    color: '#7f8c8d',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6c757d',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 20,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  completionMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  completionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  completionText: {
    flex: 1,
    fontSize: 14,
    color: '#155724',
    fontWeight: '500',
  },
  quickActions: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  quickActionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});