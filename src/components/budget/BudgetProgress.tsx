// components/budget/BudgetProgress.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface BudgetProgressProps {
  spent: number;
  budget: number;
  showLabels?: boolean;
  height?: number;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({
  spent,
  budget,
  showLabels = true,
  height = 8,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = Math.max(budget - spent, 0);

  const getProgressColor = () => {
    if (percentage >= 100) return '#FF3B30';
    if (percentage >= 80) return '#FF9500';
    return '#34C759';
  };

  const getStatusText = () => {
    if (percentage >= 100) return 'Dépassé';
    if (percentage >= 80) return 'Attention';
    return 'Dans le budget';
  };

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.labels}>
          <Text style={[styles.label, isDark && styles.darkText]}>
            {getStatusText()}
          </Text>
          <Text style={[styles.percentage, isDark && styles.darkText]}>
            {Math.round(percentage)}%
          </Text>
        </View>
      )}

      {/* Barre de progression */}
      <View style={[
        styles.progressBar,
        isDark && styles.darkProgressBar,
        { height }
      ]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: getProgressColor(),
              height,
            }
          ]}
        />
      </View>

      {showLabels && (
        <View style={styles.amounts}>
          <Text style={[styles.amount, isDark && styles.darkSubtext]}>
            {spent.toFixed(2)}€ / {budget.toFixed(2)}€
          </Text>
          <Text style={[styles.remaining, isDark && styles.darkSubtext]}>
            Reste: {remaining.toFixed(2)}€
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  progressBar: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  darkProgressBar: {
    backgroundColor: '#38383a',
  },
  progressFill: {
    borderRadius: 4,
  },
  amounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 12,
    color: '#666',
  },
  remaining: {
    fontSize: 12,
    color: '#666',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default BudgetProgress;