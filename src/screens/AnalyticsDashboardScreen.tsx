// src/screens/AnalyticsDashboardScreen.tsx - VERSION MODERNISÉE
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useDesignSystem, useTheme } from '../context/ThemeContext';
import { useReports } from '../hooks/useReports';

// Composants de graphiques
import LineChart from '../components/charts/LineChart';

const { width: screenWidth } = Dimensions.get('window');

type PeriodType = 'month' | '3months' | '6months' | 'year';

const AnalyticsDashboardScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { colors } = useDesignSystem();
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const {
    quickStats,
    monthlySummaries = [], // Valeur par défaut
    financialHealth,
    chartData,
    loading,
    refreshing,
    refreshAllData,
  } = useReports();

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('3months');
  const [showDropdown, setShowDropdown] = useState(false);
  const isDark = theme === 'dark';

  const getPeriodLabel = (period: PeriodType): string => {
    switch (period) {
      case 'month': return 'Ce mois';
      case '3months': return '3 mois';
      case '6months': return '6 mois';
      case 'year': return 'Cette année';
      default: return '3 mois';
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Filtrer les données selon la période sélectionnée
  const filteredData = useMemo(() => {
    if (!monthlySummaries || !Array.isArray(monthlySummaries) || monthlySummaries.length === 0) return [];
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const currentMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    
    switch (selectedPeriod) {
      case 'month': {
        // Prendre le dernier mois disponible
        return monthlySummaries.slice(-1);
      }
      case '3months': {
        // Les 3 derniers mois disponibles
        return monthlySummaries.slice(-3);
      }
      case '6months': {
        // Les 6 derniers mois disponibles
        return monthlySummaries.slice(-6);
      }
      case 'year': {
        // Les 12 derniers mois disponibles (ou tous si moins de 12)
        return monthlySummaries.slice(-12);
      }
      default:
        return monthlySummaries.slice(-3);
    }
  }, [monthlySummaries, selectedPeriod]);

  // Calculer la moyenne mensuelle
  const monthlyAverage = useMemo(() => {
    if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) return 0;
    const total = filteredData.reduce((sum, month) => sum + (month.expenses || 0), 0);
    return total / filteredData.length;
  }, [filteredData]);

  // Calculer la prévision pour le prochain mois
  const nextMonthPrediction = useMemo(() => {
    if (!filteredData || !Array.isArray(filteredData) || filteredData.length < 2) {
      return {
        amount: monthlyAverage,
        percentage: 0,
        isIncreasing: false
      };
    }
    
    const lastMonth = filteredData[filteredData.length - 1]?.expenses || 0;
    const previousMonth = filteredData[filteredData.length - 2]?.expenses || 0;
    
    const trend = lastMonth - previousMonth;
    const trendPercentage = previousMonth > 0 ? (trend / previousMonth) * 100 : 0;
    
    return {
      amount: lastMonth + trend,
      percentage: trendPercentage,
      isIncreasing: trend > 0
    };
  }, [filteredData, monthlyAverage]);

  // Données du graphique - Format pour LineChart
  const lineChartData = useMemo(() => {
    if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    const labels = filteredData.map(month => 
      new Date(month.month).toLocaleDateString('fr-FR', { month: 'short' })
    );
    const data = filteredData.map(month => month.expenses || 0);
    
    return {
      labels,
      datasets: [{ data }]
    };
  }, [filteredData]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header moderne */}
      <View style={[styles.modernHeader, { backgroundColor: colors.background.card }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.modernTitle, { color: colors.text.primary }]}>
          Statistiques Avancées
        </Text>
        
        {/* Dropdown filtre période */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={[styles.dropdownButton, { backgroundColor: colors.background.secondary }]}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={[styles.dropdownButtonText, { color: colors.text.primary }]}>
              {getPeriodLabel(selectedPeriod)}
            </Text>
            <Ionicons 
              name={showDropdown ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={colors.text.primary} 
            />
          </TouchableOpacity>
          
          {showDropdown && (
            <View style={[styles.dropdownMenu, { backgroundColor: colors.background.card }]}>
              {[
                { key: 'month' as PeriodType, label: 'Ce mois' },
                { key: '3months' as PeriodType, label: '3 mois' },
                { key: '6months' as PeriodType, label: '6 mois' },
                { key: 'year' as PeriodType, label: 'Cette année' },
              ].map((period) => (
                <TouchableOpacity
                  key={period.key}
                  style={[
                    styles.dropdownItem,
                    { backgroundColor: selectedPeriod === period.key ? colors.primary[100] : 'transparent' },
                  ]}
                  onPress={() => {
                    setSelectedPeriod(period.key);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    { color: selectedPeriod === period.key ? colors.primary[500] : colors.text.primary },
                  ]}>
                    {period.label}
                  </Text>
                  {selectedPeriod === period.key && (
                    <Ionicons name="checkmark" size={18} color={colors.primary[500]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAllData}
            tintColor={colors.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Graphique d'évolution mensuelle */}
        <View style={[styles.chartCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.chartHeader}>
            <Ionicons name="trending-up" size={20} color={colors.text.primary} />
            <Text style={[styles.chartTitle, { color: colors.text.primary }]}>
              Évolution mensuelle
            </Text>
          </View>
          
          {lineChartData?.datasets?.[0]?.data?.length > 0 ? (
            <LineChart 
              data={lineChartData}
              height={200}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={[styles.emptyChartText, { color: colors.text.secondary }]}>
                Aucune donnée disponible
              </Text>
            </View>
          )}
        </View>

        {/* Comparaison mensuelle */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Comparaison mensuelle
        </Text>
        
        <View style={[styles.comparisonCard, { backgroundColor: colors.background.card }]}>
          {filteredData && Array.isArray(filteredData) && filteredData.length > 0 ? (
            filteredData.slice(-3).reverse().map((month, index) => {
              const date = new Date(month.month);
              const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
              const isCurrentMonth = index === 0;
              
              return (
                <View key={month.month} style={styles.comparisonRow}>
                  <Text style={[
                    styles.comparisonMonth,
                    { color: isCurrentMonth ? colors.primary[500] : colors.text.secondary },
                    isCurrentMonth && styles.comparisonMonthCurrent,
                  ]}>
                    {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                  </Text>
                  <Text style={[
                    styles.comparisonAmount,
                    { color: isCurrentMonth ? colors.primary[500] : colors.text.primary },
                    isCurrentMonth && { fontWeight: 'bold' },
                  ]}>
                    {formatAmount(month.expenses || 0)}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyChartText, { color: colors.text.secondary }]}>
                Aucune donnée disponible
              </Text>
            </View>
          )}
        </View>

        {/* Tendances & Prévisions */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Tendances & Prévisions
        </Text>

        {/* Moyenne mensuelle */}
        <View style={[styles.insightCard, { backgroundColor: colors.background.card }]}>
          <View style={[styles.insightIcon, { backgroundColor: colors.primary[500] + '20' }]}>
            <Ionicons name="bar-chart" size={20} color={colors.primary[500]} />
          </View>
          <View style={styles.insightContent}>
            <Text style={[styles.insightLabel, { color: colors.text.primary }]}>
              Moyenne mensuelle
            </Text>
            <Text style={[styles.insightSubtext, { color: colors.text.secondary }]}>
              Basé sur les {filteredData?.length || 0} derniers mois
            </Text>
          </View>
          <Text style={[styles.insightValue, { color: colors.text.primary }]}>
            {formatAmount(monthlyAverage)}
          </Text>
        </View>

        {/* Prévision janvier */}
        <View style={[styles.insightCard, { backgroundColor: colors.background.card }]}>
          <View style={[styles.insightIcon, { backgroundColor: colors.semantic.warning + '20' }]}>
            <Ionicons name="bulb" size={20} color={colors.semantic.warning} />
          </View>
          <View style={styles.insightContent}>
            <Text style={[styles.insightLabel, { color: colors.text.primary }]}>
              Prévision janvier
            </Text>
            <Text style={[styles.insightSubtext, { color: colors.text.secondary }]}>
              {nextMonthPrediction.isIncreasing ? '+' : ''}{nextMonthPrediction.percentage.toFixed(0)}% vs décembre • Tendance à la {nextMonthPrediction.isIncreasing ? 'hausse' : 'baisse'}
            </Text>
          </View>
          <Text style={[styles.insightValue, { color: colors.text.primary }]}>
            ~{formatAmount(nextMonthPrediction.amount)}
          </Text>
        </View>

        {/* Recommandation */}
        <View style={[styles.recommendationCard, { backgroundColor: colors.background.card }]}>
          <View style={[styles.recommendationIcon, { backgroundColor: colors.semantic.warning + '20' }]}>
            <Ionicons name="bulb" size={20} color={colors.semantic.warning} />
          </View>
          <View style={styles.recommendationContent}>
            <Text style={[styles.recommendationTitle, { color: colors.text.primary }]}>
              Recommandation
            </Text>
            <Text style={[styles.recommendationText, { color: colors.text.secondary }]}>
              {nextMonthPrediction.isIncreasing 
                ? 'Vos dépenses augmentent légèrement. Pensez à revoir votre budget pour maintenir votre équilibre financier.'
                : 'Bonne nouvelle ! Vos dépenses sont en baisse. Continuez sur cette lancée pour améliorer votre épargne.'}
            </Text>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header moderne
  modernHeader: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
  },

  // Dropdown période
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 42,
    right: 0,
    borderRadius: 12,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 14,
  },

  content: {
    flex: 1,
  },

  // Carte graphique
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 14,
  },
  emptyState: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Section titre
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
  },

  // Carte comparaison
  comparisonCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  comparisonMonth: {
    fontSize: 14,
  },
  comparisonMonthCurrent: {
    fontSize: 14,
    fontWeight: '600',
  },
  comparisonAmount: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Cartes insight
  insightCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightSubtext: {
    fontSize: 12,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Carte recommandation
  recommendationCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
  },

  spacer: {
    height: 40,
  },
});

export default AnalyticsDashboardScreen;