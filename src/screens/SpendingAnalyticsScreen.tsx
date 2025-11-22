// /src/screens/SpendingAnalyticsScreen.tsx - VERSION CORRIGÉE
import React, { useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Header } from '../components/ui/Header';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAdvancedAnalytics } from '../hooks/useAdvancedAnalytics';

export const SpendingAnalyticsScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { spendingAnalysis, loading } = useAdvancedAnalytics(); 
  const [refreshing, setRefreshing] = React.useState(false);
  const [sortBy, setSortBy] = useState<'amount' | 'trend'>('amount');

  const isDark = theme === 'dark';

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh logic here
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  if (!spendingAnalysis || spendingAnalysis.length === 0) {
    return (
      <View style={styles.container}>
        {/* ✅ CORRECTION : Utiliser onBack au lieu de showBackButton */}
        <Header title="Analytics Dépenses" onBack={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune donnée de dépenses disponible</Text>
        </View>
      </View>
    );
  }

  const formatCurrency = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const sortedAnalysis = [...spendingAnalysis].sort((a, b) => {
    if (sortBy === 'amount') {
      return b.currentMonth - a.currentMonth;
    } else {
      return Math.abs(b.trend) - Math.abs(a.trend);
    }
  });

  const getTrendColor = (trend: number) => {
    if (trend > 10) return '#FF3B30'; // Hausse significative
    if (trend > 0) return '#FF9500';   // Légère hausse
    if (trend < -10) return '#34C759'; // Baisse significative
    if (trend < 0) return '#64D2FF';   // Légère baisse
    return '#8E8E93';                  // Stable
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under': return '#34C759';
      case 'over': return '#FF3B30';
      case 'on_track': return '#007AFF';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under': return 'Sous la moyenne';
      case 'over': return 'Au-dessus';
      case 'on_track': return 'Dans la moyenne';
      default: return 'Stable';
    }
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* ✅ CORRECTION : Utiliser onBack au lieu de showBackButton */}
      <Header 
        title="Analytics Dépenses" 
        onBack={() => navigation.goBack()}
      />

      {/* Sélecteur de tri */}
      <View style={[styles.sortContainer, isDark && styles.darkCard]}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'amount' && styles.sortButtonActive
          ]}
          onPress={() => setSortBy('amount')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'amount' && styles.sortButtonTextActive
          ]}>
            Par montant
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'trend' && styles.sortButtonActive
          ]}
          onPress={() => setSortBy('trend')}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === 'trend' && styles.sortButtonTextActive
          ]}>
            Par tendance
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Le reste du code reste inchangé */}
        {/* ... */}
      </ScrollView>
    </View>
  );
};

// Les styles restent inchangés
const styles = StyleSheet.create({
  // ... (garder tous les styles existants)
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  sortContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  analysisCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  trendInfo: {
    alignItems: 'flex-end',
  },
  trendIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  analysisDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountSection: {
    alignItems: 'center',
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  comparisonBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 6,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  currentBar: {
    height: '100%',
    borderRadius: 3,
  },
  averageBar: {
    height: '100%',
    backgroundColor: '#8E8E93',
    opacity: 0.3,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
  },
  insightsCard: {
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
  insightItem: {
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  darkActionButton: {
    backgroundColor: '#0A84FF',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SpendingAnalyticsScreen;

