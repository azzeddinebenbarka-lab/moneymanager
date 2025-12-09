// components/budget/BudgetCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Budget } from '../../types';
import BudgetProgress from './BudgetProgress';

interface BudgetCardProps {
  budget: Budget;
  onPress: (budget: Budget) => void;
  onLongPress: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onPress,
  onLongPress,
  onToggle,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'daily': return 'Quotidien';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      case 'yearly': return 'Annuel';
      default: return period;
    }
  };

  const getProgressColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return '#FF3B30';
    if (percentage >= 80) return '#FF9500';
    return '#34C759';
  };

  const handleToggle = () => {
    onToggle(budget.id, !budget.isActive);
  };

  const handleLongPress = () => {
    onLongPress(budget.id);
  };

  const handlePress = () => {
    onPress(budget);
  };

  const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
  const remaining = Math.max(budget.amount - budget.spent, 0);

  return (
    <TouchableOpacity
      style={[styles.card, isDark && styles.darkCard]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      {/* En-tête du budget */}
      <View style={styles.header}>
        <View style={styles.budgetInfo}>
          <Text style={[styles.budgetName, isDark && styles.darkText]}>
            {budget.name}
          </Text>
          <View style={styles.categoryContainer}>
            <Ionicons 
              name="pricetag-outline" 
              size={14} 
              color={isDark ? '#888' : '#666'} 
            />
            <Text style={[styles.category, isDark && styles.darkSubtext]}>
              {translateCategoryName(budget.category, t)}
            </Text>
          </View>
        </View>

        {/* Bouton d'activation/désactivation */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            budget.isActive && styles.toggleButtonActive,
            isDark && styles.darkToggleButton,
          ]}
          onPress={handleToggle}
        >
          <Ionicons 
            name={budget.isActive ? 'pause' : 'play'} 
            size={16} 
            color={budget.isActive ? '#fff' : (isDark ? '#888' : '#666')} 
          />
        </TouchableOpacity>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressSection}>
        <BudgetProgress
          spent={budget.spent}
          budget={budget.amount}
          showLabels={true}
          height={8}
        />
      </View>

      {/* Détails financiers */}
      <View style={styles.financialDetails}>
        <View style={styles.amountGroup}>
          <Text style={[styles.amountLabel, isDark && styles.darkSubtext]}>
            Dépensé
          </Text>
          <Text style={[
            styles.amountValue,
            { color: getProgressColor(budget.spent, budget.amount) }
          ]}>
            {budget.spent.toFixed(2)} €
          </Text>
        </View>

        <View style={styles.amountGroup}>
          <Text style={[styles.amountLabel, isDark && styles.darkSubtext]}>
            Budget
          </Text>
          <Text style={[styles.amountValue, isDark && styles.darkText]}>
            {budget.amount.toFixed(2)} €
          </Text>
        </View>

        <View style={styles.amountGroup}>
          <Text style={[styles.amountLabel, isDark && styles.darkSubtext]}>
            Restant
          </Text>
          <Text style={[
            styles.amountValue,
            { color: remaining > 0 ? '#34C759' : '#FF3B30' }
          ]}>
            {remaining.toFixed(2)} €
          </Text>
        </View>
      </View>

      {/* Informations supplémentaires */}
      <View style={styles.footer}>
        <View style={styles.periodContainer}>
          <Ionicons 
            name="calendar-outline" 
            size={12} 
            color={isDark ? '#888' : '#666'} 
          />
          <Text style={[styles.period, isDark && styles.darkSubtext]}>
            {getPeriodLabel(budget.period)}
          </Text>
        </View>

        <View style={styles.percentageContainer}>
          <Text style={[
            styles.percentage,
            { color: getProgressColor(budget.spent, budget.amount) }
          ]}>
            {Math.round(percentage)}%
          </Text>
        </View>
      </View>

      {/* Statut actif/inactif */}
      {!budget.isActive && (
        <View style={[styles.inactiveOverlay, isDark && styles.darkInactiveOverlay]}>
          <Text style={styles.inactiveText}>INACTIF</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkToggleButton: {
    backgroundColor: '#38383a',
    borderColor: '#48484a',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  progressSection: {
    marginBottom: 16,
  },
  financialDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountGroup: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  period: {
    fontSize: 12,
    color: '#666',
  },
  percentageContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkInactiveOverlay: {
    backgroundColor: 'rgba(44, 44, 46, 0.8)',
  },
  inactiveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
    transform: [{ rotate: '-15deg' }],
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default BudgetCard;