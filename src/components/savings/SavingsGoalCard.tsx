// /src/components/savings/SavingsGoalCard.tsx
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { SavingsGoal } from '../../types/Savings';
import { ProgressBar } from '../ui/ProgressBar';

interface Props {
  goal: SavingsGoal;
  onPress: () => void;
  onDelete: () => void;
  onMarkCompleted: () => void;
  onAddContribution: () => void;
} 

export const SavingsGoalCard = ({ goal, onPress, onDelete, onMarkCompleted, onAddContribution }: Props) => {
  const { t } = useLanguage();
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const isCompleted = goal.isCompleted;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      vacation: '🏖️',
      emergency: '🆘',
      house: '🏠',
      car: '🚗',
      education: '🎓',
      retirement: '👵',
      other: '💰'
    };
    return icons[category] || '💰'; 
  };

  return (
    <TouchableOpacity 
      style={[styles.card, isCompleted && styles.completedCard]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(goal.category)}</Text>
            <Text style={styles.categoryText}>
              {goal.category === 'vacation' ? t.savingsVacation :
               goal.category === 'emergency' ? t.savingsEmergency :
               goal.category === 'house' ? t.savingsHouse :
               goal.category === 'car' ? t.savingsCar :
               goal.category === 'education' ? t.savingsEducation :
               goal.category === 'retirement' ? t.savingsRetirement : t.savingsOther}
            </Text>
          </View>
          <Text style={styles.name}>{goal.name}</Text>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={styles.currentAmount}>€{goal.currentAmount.toLocaleString()}</Text>
          <Text style={styles.targetAmount}>sur €{goal.targetAmount.toLocaleString()}</Text>
        </View>
      </View>

      {/* Barre de progression */}
      <ProgressBar 
        progress={progress} 
        color={isCompleted ? '#28a745' : '#007AFF'}
        height={8}
      />

      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {progress.toFixed(1)}% {t.reached}
        </Text>
        {!isCompleted && (
          <Text style={styles.remainingText}>
            €{remainingAmount.toLocaleString()} {t.remaining}
          </Text>
        )}
      </View>

      {/* Informations supplémentaires */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t.targetDate}</Text>
          <Text style={styles.detailValue}>
            {new Date(goal.targetDate).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t.monthlyPaymentLabel}</Text>
          <Text style={styles.detailValue}>€{goal.monthlyContribution.toLocaleString()}</Text>
        </View>
      </View>

      {/* Actions */}
      {!isCompleted && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.contributionButton}
            onPress={onAddContribution}
          >
            <Text style={styles.contributionButtonText}>{t.addButton}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={onMarkCompleted}
          >
            <Text style={styles.completeButtonText}>{t.complete}</Text>
          </TouchableOpacity>
        </View>
      )}

      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>{t.goalReachedBadge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    backgroundColor: '#f8fff9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6c757d',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  currentAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  targetAmount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  remainingText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  details: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  contributionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  contributionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#d4edda',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  completedText: {
    color: '#155724',
    fontSize: 14,
    fontWeight: '600',
  },
});