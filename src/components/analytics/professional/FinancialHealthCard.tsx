// src/components/analytics/professional/FinancialHealthCard.tsx - IMPORTS CORRIGÉS
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrency } from '../../../context/CurrencyContext'; // ✅ CHEMIN CORRIGÉ
import { useTheme } from '../../../context/ThemeContext'; // ✅ CHEMIN CORRIGÉ
import CircleChart from '../../charts/CircleChart'; // ✅ CHEMIN CORRIGÉ

interface FinancialFlowCardProps {
  income: number;
  expenses: number;
  balance: number;
  onPress?: () => void;
  compact?: boolean;
}

export const FinancialFlowCard: React.FC<FinancialFlowCardProps> = ({
  income,
  expenses,
  balance,
  onPress,
  compact = false
}) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const isDark = theme === 'dark';

  const CardContent = () => (
    <View style={[
      styles.card, 
      isDark && styles.darkCard,
      compact && styles.compactCard
    ]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, isDark && styles.darkTitle]}>
          Flux Financiers
        </Text>
        <Text style={[styles.cardSubtitle, isDark && styles.darkSubtitle]}>
          Ce mois
        </Text>
      </View>

      <View style={[
        styles.chartContainer,
        compact && styles.compactChartContainer
      ]}>
        <CircleChart 
          income={income}
          expenses={expenses}
          balance={balance}
          isDark={isDark}
          size={compact ? 100 : 140}
          strokeWidth={compact ? 12 : 16}
          showLegend={!compact}
          showBalance={!compact}
        />
      </View>

      {compact && (
        <View style={styles.compactStats}>
          <View style={styles.compactStat}>
            <View style={[styles.compactDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.compactLabel, isDark && styles.darkSubtitle]}>
              {formatAmount(income)}
            </Text>
          </View>
          <View style={styles.compactStat}>
            <View style={[styles.compactDot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.compactLabel, isDark && styles.darkSubtitle]}>
              {formatAmount(expenses)}
            </Text>
          </View>
        </View>
      )}

      {!compact && (
        <View style={styles.detailedStats}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
                <Text style={styles.statIconText}>↑</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>
                  {formatAmount(income)}
                </Text>
                <Text style={[styles.statLabel, isDark && styles.darkSubtitle]}>
                  Revenus
                </Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#EF444420' }]}>
                <Text style={styles.statIconText}>↓</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>
                  {formatAmount(expenses)}
                </Text>
                <Text style={[styles.statLabel, isDark && styles.darkSubtitle]}>
                  Dépenses
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.balanceRow}>
            <View style={[
              styles.balanceBadge,
              { backgroundColor: balance >= 0 ? '#10B98120' : '#EF444420' }
            ]}>
              <Text style={[
                styles.balanceText,
                { color: balance >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                {formatAmount(balance)}
              </Text>
              <Text style={[
                styles.balanceLabel,
                isDark && styles.darkSubtitle
              ]}>
                {balance >= 0 ? 'Épargne' : 'Déficit'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginVertical: 8,
  },
  darkCard: {
    backgroundColor: '#1E293B',
  },
  compactCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  darkTitle: {
    color: '#F1F5F9',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  darkSubtitle: {
    color: '#94A3B8',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  compactChartContainer: {
    marginBottom: 12,
  },
  compactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  compactStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compactLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  detailedStats: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statIconText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  balanceRow: {
    alignItems: 'center',
  },
  balanceBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default FinancialFlowCard;