// src/components/analytics/NetWorthCard.tsx - VERSION CORRIGÉE
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAnalytics } from '../../hooks/useAnalytics';

interface NetWorthCardProps {
  onPress?: () => void;
  compact?: boolean;
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({ 
  onPress, 
  compact = false 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { analytics, loading } = useAnalytics();
  const { netWorth, cashFlow } = analytics;

  // ✅ TREND BASÉ SUR L'HISTORIQUE
  const getTrend = () => {
    if (netWorth.history.length < 2) {
      return { value: 0, isPositive: true };
    }
    
    const current = netWorth.history[netWorth.history.length - 1].netWorth;
    const previous = netWorth.history[netWorth.history.length - 2].netWorth;
    
    return calculationService.calculateTrend(current, previous);
  };

  const trend = getTrend();

  const formatCurrency = (amount: number): string => {
    return `${amount >= 0 ? '' : '-'}€${Math.abs(amount).toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : '-'}${Math.abs(value).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <View style={[styles.card, isDark && styles.darkCard]}>
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Chargement du patrimoine...
        </Text>
      </View>
    );
  }

  const CardContent = () => (
    <View style={styles.content}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkText]}>
          Patrimoine Net
        </Text>
        {!compact && (
          <View style={[
            styles.trendBadge,
            { backgroundColor: trend.isPositive ? '#34C75920' : '#FF3B3020' }
          ]}>
            <Text style={[
              styles.trendText,
              { color: trend.isPositive ? '#34C759' : '#FF3B30' }
            ]}>
              {formatPercentage(trend.isPositive ? trend.value : -trend.value)}
            </Text>
          </View>
        )}
      </View>

      {/* Valeur principale */}
      <Text style={[
        styles.netWorthValue,
        { color: netWorth.netWorth >= 0 ? '#34C759' : '#FF3B30' }
      ]}>
        {formatCurrency(netWorth.netWorth)}
      </Text>

      {!compact && (
        <>
          {/* Répartition Actifs/Passifs */}
          <View style={styles.breakdown}>
            <View style={styles.breakdownItem}>
              <View style={[styles.dot, { backgroundColor: '#34C759' }]} />
              <Text style={[styles.breakdownLabel, isDark && styles.darkSubtext]}>
                Actifs
              </Text>
              <Text style={[styles.breakdownValue, isDark && styles.darkText]}>
                {formatCurrency(netWorth.totalAssets)}
              </Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <View style={[styles.dot, { backgroundColor: '#FF3B30' }]} />
              <Text style={[styles.breakdownLabel, isDark && styles.darkSubtext]}>
                Passifs
              </Text>
              <Text style={[styles.breakdownValue, isDark && styles.darkText]}>
                {formatCurrency(netWorth.totalLiabilities)}
              </Text>
            </View>
          </View>

          {/* Cash Flow */}
          <View style={styles.cashFlow}>
            <View style={styles.cashFlowItem}>
              <Text style={[styles.cashFlowLabel, isDark && styles.darkSubtext]}>
                Revenus
              </Text>
              <Text style={[styles.cashFlowValue, isDark && styles.darkText]}>
                {formatCurrency(cashFlow.income)}
              </Text>
            </View>
            
            <View style={styles.cashFlowItem}>
              <Text style={[styles.cashFlowLabel, isDark && styles.darkSubtext]}>
                Dépenses
              </Text>
              <Text style={[styles.cashFlowValue, isDark && styles.darkText]}>
                {formatCurrency(cashFlow.expenses)}
              </Text>
            </View>
            
            <View style={styles.cashFlowItem}>
              <Text style={[styles.cashFlowLabel, isDark && styles.darkSubtext]}>
                Épargne
              </Text>
              <Text style={[
                styles.cashFlowValue, 
                { color: cashFlow.savingsRate >= 0 ? '#34C759' : '#FF3B30' }
              ]}>
                {cashFlow.savingsRate.toFixed(1)}%
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Indicateur de clic */}
      {onPress && (
        <Text style={[styles.viewDetails, isDark && styles.darkSubtext]}>
          Voir le détail →
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[styles.card, isDark && styles.darkCard]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
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
  content: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  netWorthValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  breakdown: {
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  cashFlow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cashFlowItem: {
    alignItems: 'center',
    flex: 1,
  },
  cashFlowLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cashFlowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  viewDetails: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

// Import manquant
import { calculationService } from '../../services/calculationService';
