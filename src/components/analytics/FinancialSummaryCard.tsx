// src/components/analytics/FinancialSummaryCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FinancialSummaryCardProps {
  report: any;
  period: string;
  isDark: boolean;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  report,
  period,
  isDark
}) => {
  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      <Text style={[styles.title, isDark && styles.darkText]}>
        Résumé Financier - {period}
      </Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            €{report?.totalIncome?.toLocaleString() || '0'}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Revenus
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            €{report?.totalExpenses?.toLocaleString() || '0'}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Dépenses
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[
            styles.statValue, 
            { color: (report?.netSavings || 0) >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            €{report?.netSavings?.toLocaleString() || '0'}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Épargne
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            {report?.savingsRate?.toFixed(1) || '0'}%
          </Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Taux d'épargne
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  darkCard: {
    backgroundColor: '#1E293B',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  darkText: {
    color: '#F1F5F9',
  },
  darkSubtext: {
    color: '#94A3B8',
  },
});

export default FinancialSummaryCard;