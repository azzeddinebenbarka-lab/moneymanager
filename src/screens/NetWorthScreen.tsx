// src/screens/NetWorthScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import React, { useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AssetAllocationChart } from '../components/analytics/AssetAllocationChart';
import { FinancialSummaryCard } from '../components/analytics/FinancialSummaryCard';
import { NetWorthCard } from '../components/analytics/NetWorthCard';
import { NetWorthChart } from '../components/analytics/NetWorthChart';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAnalytics } from '../hooks/useAnalytics';

// ✅ INTERFACES CORRIGÉES
interface NetWorthChartData {
  date: string;
  netWorth: number;
  assets: number;
  liabilities: number;
}

interface AssetAllocationData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export const NetWorthScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { 
    analytics, 
    loading, 
    error, 
    refreshAnalytics 
  } = useAnalytics();

  const { netWorth, cashFlow, assetAllocation } = analytics;

  // ✅ DONNÉES POUR LE GRAPHIQUE PATRIMOINE CORRIGÉES
  const netWorthChartData = useMemo((): NetWorthChartData[] => {
    if (!netWorth.history || netWorth.history.length === 0) {
      return [
        {
          date: new Date().toISOString().split('T')[0],
          netWorth: 0,
          assets: 0,
          liabilities: 0
        }
      ];
    }

    return netWorth.history.map(item => ({
      date: item.date,
      netWorth: item.netWorth,
      assets: netWorth.totalAssets,
      liabilities: netWorth.totalLiabilities
    }));
  }, [netWorth.history, netWorth.totalAssets, netWorth.totalLiabilities]);

  // ✅ DONNÉES POUR LA RÉPARTITION DES ACTIFS CORRIGÉES
  const assetAllocationData = useMemo((): AssetAllocationData[] => {
    const totalAssets = netWorth.totalAssets;
    
    if (totalAssets === 0) {
      return [
        { name: 'Aucun actif', value: 100, color: '#6B7280', percentage: 100 }
      ];
    }

    const data = [
      {
        name: 'Liquidités',
        value: assetAllocation.cash,
        color: '#3B82F6',
        percentage: totalAssets > 0 ? (assetAllocation.cash / totalAssets) * 100 : 0
      },
      {
        name: 'Épargne',
        value: assetAllocation.savings,
        color: '#10B981',
        percentage: totalAssets > 0 ? (assetAllocation.savings / totalAssets) * 100 : 0
      },
      {
        name: 'Investissements',
        value: assetAllocation.investments,
        color: '#F59E0B',
        percentage: totalAssets > 0 ? (assetAllocation.investments / totalAssets) * 100 : 0
      },
      {
        name: 'Autres',
        value: assetAllocation.other,
        color: '#8B5CF6',
        percentage: totalAssets > 0 ? (assetAllocation.other / totalAssets) * 100 : 0
      }
    ].filter(item => item.value > 0);

    return data;
  }, [assetAllocation, netWorth.totalAssets]);

  // ✅ RAPPORT FINANCIER POUR FinancialSummaryCard
  const financialReport = useMemo(() => ({
    totalIncome: cashFlow.income,
    totalExpenses: cashFlow.expenses,
    netSavings: cashFlow.netFlow,
    savingsRate: cashFlow.savingsRate
  }), [cashFlow]);

  const onRefresh = React.useCallback(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isDark && styles.darkText]}>
            Erreur lors du chargement du patrimoine
          </Text>
          <Text style={[styles.errorSubtext, isDark && styles.darkSubtext]}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor={isDark ? '#FFFFFF' : '#000000'}
          />
        }
      >
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Patrimoine Net
          </Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>
            Vue d'ensemble de votre situation financière
          </Text>
        </View>

        {/* Carte patrimoine net */}
        <NetWorthCard compact={false} />

        {/* Résumé financier */}
        <FinancialSummaryCard
          report={financialReport}
          period="Ce mois"
          isDark={isDark}
        />

        {/* Graphique évolution patrimoine */}
        <View style={[styles.chartContainer, isDark && styles.darkChartContainer]}>
          <Text style={[styles.chartTitle, isDark && styles.darkText]}>
            Évolution du Patrimoine
          </Text>
          {/* ✅ CORRECTION : Passage des données avec le bon type */}
          <NetWorthChart 
  data={netWorthChartData}
  isDark={isDark}
/>
        </View>

        {/* Répartition des actifs */}
        <View style={[styles.chartContainer, isDark && styles.darkChartContainer]}>
          <Text style={[styles.chartTitle, isDark && styles.darkText]}>
            Répartition des Actifs
          </Text>
          {/* ✅ CORRECTION : Utilisation du composant correct avec les bonnes props */}
          <AssetAllocationChart
            data={assetAllocationData}
            isDark={isDark}
          />
        </View>

        {/* Détails du patrimoine */}
        <View style={[styles.detailsContainer, isDark && styles.darkDetailsContainer]}>
          <Text style={[styles.detailsTitle, isDark && styles.darkText]}>
            Détails du Patrimoine
          </Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
                Actifs Totaux
              </Text>
              <Text style={[styles.detailValue, isDark && styles.darkText]}>
                €{netWorth.totalAssets.toLocaleString('fr-FR')}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
                Passifs Totaux
              </Text>
              <Text style={[styles.detailValue, isDark && styles.darkText]}>
                €{netWorth.totalLiabilities.toLocaleString('fr-FR')}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
                Patrimoine Net
              </Text>
              <Text style={[
                styles.detailValue,
                { color: netWorth.netWorth >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                €{netWorth.netWorth.toLocaleString('fr-FR')}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isDark && styles.darkSubtext]}>
                Taux d'Épargne
              </Text>
              <Text style={[
                styles.detailValue,
                { color: cashFlow.savingsRate >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                {cashFlow.savingsRate.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Indicateurs de santé financière */}
        <View style={[styles.healthContainer, isDark && styles.darkHealthContainer]}>
          <Text style={[styles.healthTitle, isDark && styles.darkText]}>
            Santé Financière
          </Text>
          
          <View style={styles.healthIndicators}>
            <View style={styles.healthIndicator}>
              <View style={styles.healthBar}>
                <View 
                  style={[
                    styles.healthProgress,
                    { 
                      width: `${Math.min(100, Math.max(0, analytics.financialHealth))}%`,
                      backgroundColor: analytics.financialHealth >= 70 ? '#10B981' : 
                                      analytics.financialHealth >= 40 ? '#F59E0B' : '#EF4444'
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.healthLabel, isDark && styles.darkSubtext]}>
                Score: {analytics.financialHealth}/100
              </Text>
            </View>
          </View>
          
          <View style={styles.healthTips}>
            {analytics.financialHealth < 40 && (
              <Text style={[styles.healthTip, isDark && styles.darkSubtext]}>
                💡 Conseil: Essayez de réduire vos dettes et d'augmenter votre épargne d'urgence.
              </Text>
            )}
            {analytics.financialHealth >= 40 && analytics.financialHealth < 70 && (
              <Text style={[styles.healthTip, isDark && styles.darkSubtext]}>
                💡 Conseil: Continuez à épargner régulièrement et surveillez vos dépenses.
              </Text>
            )}
            {analytics.financialHealth >= 70 && (
              <Text style={[styles.healthTip, isDark && styles.darkSubtext]}>
                💡 Félicitations! Votre santé financière est excellente.
              </Text>
            )}
          </View>
        </View>

        {/* Espace en bas pour le scrolling */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  darkContainer: {
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  darkText: {
    color: '#F1F5F9',
  },
  darkSubtext: {
    color: '#94A3B8',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkChartContainer: {
    backgroundColor: '#1E293B',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkDetailsContainer: {
    backgroundColor: '#1E293B',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    width: '47%',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  healthContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkHealthContainer: {
    backgroundColor: '#1E293B',
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  healthIndicators: {
    marginBottom: 16,
  },
  healthIndicator: {
    marginBottom: 8,
  },
  healthBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthProgress: {
    height: '100%',
    borderRadius: 4,
  },
  healthLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  healthTips: {
    marginTop: 8,
  },
  healthTip: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default NetWorthScreen;