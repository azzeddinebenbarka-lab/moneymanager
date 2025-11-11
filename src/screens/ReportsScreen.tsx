import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useReports } from '../hooks/useReports';

const ReportsScreen = ({ navigation }: any) => {
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  const {
    monthlySummaries,
    financialHealth,
    chartData,
    pieChartData,
    quickStats,
    topCategories,
    criticalBudgetAlerts,
    loading,
    refreshing,
    error,
    currentPeriod,
    predefinedPeriods,
    refreshAllData,
    changePeriod,
    isEmpty,
  } = useReports();

  const isDark = theme === 'dark';
  const [showPeriodSelector, setShowPeriodSelector] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'month' as const,
    transactionTypes: ['income', 'expense'] as ('income' | 'expense')[],
    minAmount: undefined as number | undefined,
    maxAmount: undefined as number | undefined,
  });

  const PeriodSelector = () => (
    <View style={[styles.periodSelector, isDark && styles.darkCard]}>
      <Text style={[styles.periodSelectorTitle, isDark && styles.darkText]}>
        Période
      </Text>
      {predefinedPeriods.map((period) => (
        <TouchableOpacity
          key={period.label}
          style={[
            styles.periodOption,
            currentPeriod?.label === period.label && styles.periodOptionSelected,
          ]}
          onPress={() => {
            changePeriod(period);
            setShowPeriodSelector(false);
          }}
        >
          <Text style={[
            styles.periodOptionText,
            currentPeriod?.label === period.label && styles.periodOptionTextSelected,
            isDark && styles.darkText
          ]}>
            {period.label}
          </Text>
          {currentPeriod?.label === period.label && (
            <Ionicons name="checkmark" size={16} color="#007AFF" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const AdvancedFilters = () => {
    const toggleDataType = (type: "income" | "expense") => {
      setFilters(prev => ({
        ...prev,
        transactionTypes: prev.transactionTypes.includes(type)
          ? prev.transactionTypes.filter(t => t !== type)
          : [...prev.transactionTypes, type]
      }));
    };

    return (
      <View style={styles.filtersSection}>
        <TouchableOpacity 
          style={[styles.filtersToggle, isDark && styles.darkCard]}
          onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Ionicons name="filter" size={20} color="#007AFF" />
          <Text style={[styles.filtersToggleText, isDark && styles.darkText]}>
            Filtres avancés
          </Text>
          <Ionicons 
            name={showAdvancedFilters ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={isDark ? '#888' : '#666'} 
          />
        </TouchableOpacity>

        {showAdvancedFilters && (
          <View style={[styles.advancedFilters, isDark && styles.darkCard]}>
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, isDark && styles.darkText]}>
                Type de transaction
              </Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filters.transactionTypes.includes('income') && styles.filterOptionSelected,
                  ]}
                  onPress={() => toggleDataType('income')}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.transactionTypes.includes('income') && styles.filterOptionTextSelected,
                  ]}>
                    Revenus
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filters.transactionTypes.includes('expense') && styles.filterOptionSelected,
                  ]}
                  onPress={() => toggleDataType('expense')}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.transactionTypes.includes('expense') && styles.filterOptionTextSelected,
                  ]}>
                    Dépenses
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, isDark && styles.darkText]}>
                Montant
              </Text>
              <View style={styles.amountFilters}>
                <View style={styles.amountInputContainer}>
                  <Text style={[styles.amountLabel, isDark && styles.darkSubtext]}>Min</Text>
                  <TextInput
                    style={[styles.amountInput, isDark && styles.darkAmountInput]}
                    placeholder="0"
                    placeholderTextColor={isDark ? '#888' : '#999'}
                    keyboardType="numeric"
                    value={filters.minAmount?.toString()}
                    onChangeText={(text) => setFilters({ 
                      ...filters, 
                      minAmount: text ? parseFloat(text) : undefined 
                    })}
                  />
                </View>
                <View style={styles.amountInputContainer}>
                  <Text style={[styles.amountLabel, isDark && styles.darkSubtext]}>Max</Text>
                  <TextInput
                    style={[styles.amountInput, isDark && styles.darkAmountInput]}
                    placeholder="∞"
                    placeholderTextColor={isDark ? '#888' : '#999'}
                    keyboardType="numeric"
                    value={filters.maxAmount?.toString()}
                    onChangeText={(text) => setFilters({ 
                      ...filters, 
                      maxAmount: text ? parseFloat(text) : undefined 
                    })}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setFilters({
                dateRange: 'month',
                transactionTypes: ['income', 'expense'],
                minAmount: undefined,
                maxAmount: undefined,
              })}
            >
              <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const QuickStatsCard = () => (
    <View style={[styles.quickStatsCard, isDark && styles.darkCard]}>
      <Text style={[styles.cardTitle, isDark && styles.darkText]}>
        Aperçu Financier
      </Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Ionicons name="arrow-down-circle" size={20} color="#34C759" />
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            {formatAmount(quickStats.totalIncome || 0)}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Revenus
          </Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="arrow-up-circle" size={20} color="#FF3B30" />
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            {formatAmount(quickStats.totalExpenses || 0)}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Dépenses
          </Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons 
            name={(quickStats.netCashFlow || 0) >= 0 ? "trending-up" : "trending-down"} 
            size={20} 
            color={(quickStats.netCashFlow || 0) >= 0 ? "#34C759" : "#FF3B30"} 
          />
          <Text style={[
            styles.statValue, 
            { color: (quickStats.netCashFlow || 0) >= 0 ? '#34C759' : '#FF3B30' }
          ]}>
            {formatAmount(quickStats.netCashFlow || 0)}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Solde
          </Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="pie-chart" size={20} color="#007AFF" />
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            {(quickStats.savingsRate || 0).toFixed(1)}%
          </Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Épargne
          </Text>
        </View>
      </View>
    </View>
  );

  const FinancialHealthCard = () => {
    if (!financialHealth) return null;

    const getHealthColor = (status: string): string => {
      switch (status) {
        case 'excellent': return '#34C759';
        case 'good': return '#32D74B';
        case 'fair': return '#FFD60A';
        case 'poor': return '#FF9F0A';
        case 'critical': return '#FF453A';
        default: return '#8E8E93';
      }
    };

    const getHealthStatusText = (status: string): string => {
      switch (status) {
        case 'excellent': return 'Excellent';
        case 'good': return 'Bon';
        case 'fair': return 'Correct';
        case 'poor': return 'Faible';
        case 'critical': return 'Critique';
        default: return 'Inconnu';
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.healthCard, isDark && styles.darkCard]}
        onPress={() => navigation.navigate('HealthDetail')}
      >
        <View style={styles.healthHeader}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>
            Santé Financière
          </Text>
          <View style={[
            styles.healthScore,
            { backgroundColor: getHealthColor(financialHealth.status || 'fair') }
          ]}>
            <Text style={styles.healthScoreText}>
              {financialHealth.score || 75}
            </Text>
          </View>
        </View>
        
        <View style={styles.healthStatus}>
          <Text style={[
            styles.healthStatusText,
            { color: getHealthColor(financialHealth.status || 'fair') }
          ]}>
            {getHealthStatusText(financialHealth.status || 'fair')}
          </Text>
        </View>

        {financialHealth.recommendations && financialHealth.recommendations.length > 0 && (
          <View style={styles.recommendations}>
            <Text style={[styles.recommendationsTitle, isDark && styles.darkSubtext]}>
              Recommandations
            </Text>
            <Text style={[styles.recommendation, isDark && styles.darkSubtext]}>
              {financialHealth.recommendations[0]}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const TopCategoriesCard = () => (
    <TouchableOpacity 
      style={[styles.categoriesCard, isDark && styles.darkCard]}
      onPress={() => navigation.navigate('CategoryAnalysis')}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, isDark && styles.darkText]}>
          Top Catégories
        </Text>
        <Ionicons name="chevron-forward" size={20} color={isDark ? '#888' : '#666'} />
      </View>

      {topCategories.slice(0, 5).map((category: any, index: number) => (
        <View key={category.id || `category-${index}`} style={styles.categoryItem}>
          <View style={styles.categoryInfo}>
            <View 
              style={[
                styles.colorIndicator, 
                { backgroundColor: category.color || '#007AFF' }
              ]} 
            />
            <Ionicons 
              name={category.icon as any || 'pricetag'} 
              size={16} 
              color={isDark ? '#888' : '#666'} 
            />
            <Text style={[styles.categoryName, isDark && styles.darkText]}>
              {category.name || `Catégorie ${index + 1}`}
            </Text>
          </View>
          
          <View style={styles.categoryAmounts}>
            <Text style={[styles.categoryAmount, isDark && styles.darkText]}>
              {formatAmount(category.amount || 0)}
            </Text>
            <Text style={[styles.categoryPercentage, isDark && styles.darkSubtext]}>
              {(category.percentage || 0).toFixed(1)}%
            </Text>
          </View>
        </View>
      ))}

      {topCategories.length === 0 && (
        <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
          Aucune donnée de catégorie
        </Text>
      )}
    </TouchableOpacity>
  );

  const MonthlyTrendsCard = () => (
    <TouchableOpacity 
      style={[styles.trendsCard, isDark && styles.darkCard]}
      onPress={() => navigation.navigate('MonthlyTrends')}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, isDark && styles.darkText]}>
          Tendances Mensuelles
        </Text>
        <Ionicons name="chevron-forward" size={20} color={isDark ? '#888' : '#666'} />
      </View>
      
      <View style={styles.trendsGrid}>
        {monthlySummaries.slice(-3).map((summary: any, index: number) => (
          <View key={summary.month || `month-${index}`} style={styles.trendItem}>
            <Text style={[styles.trendMonth, isDark && styles.darkSubtext]}>
              {summary.label || `Mois ${index + 1}`}
            </Text>
            <Text style={[
              styles.trendAmount,
              { color: (summary.savings || 0) >= 0 ? '#34C759' : '#FF3B30' }
            ]}>
              {formatAmount(summary.savings || 0)}
            </Text>
          </View>
        ))}
      </View>

      {monthlySummaries.length === 0 && (
        <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
          Aucune donnée mensuelle
        </Text>
      )}
    </TouchableOpacity>
  );

  const ChartsSection = () => (
    <View style={styles.chartsSection}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        Visualisations
      </Text>
      
      {chartData && (
        <BarChart 
          data={chartData}
          title="Dépenses par Catégorie"
          height={240}
        />
      )}
      
      {pieChartData && pieChartData.length > 0 && (
        <PieChart 
          data={pieChartData.map(item => ({
            ...item,
            percentage: item.percentage || 0
          }))}
          title="Répartition des Dépenses"
          height={260}
        />
      )}

      {chartData && (
        <LineChart 
          data={chartData}
          title="Évolution des Dépenses"
          height={240}
        />
      )}
    </View>
  );

  if (loading.overall && !refreshing && isEmpty) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Chargement des rapports...
        </Text>
      </View>
    );
  }

  if (error && isEmpty) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={[styles.errorText, isDark && styles.darkText]}>
          {error}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshAllData}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.center]}>
        <Ionicons name="stats-chart" size={64} color={isDark ? '#555' : '#ccc'} />
        <Text style={[styles.emptyText, isDark && styles.darkText]}>
          Aucune donnée financière
        </Text>
        <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
          Ajoutez des transactions pour voir vos rapports
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Text style={styles.addButtonText}>Ajouter une transaction</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Rapports
          </Text>
          <TouchableOpacity 
            style={[styles.periodButton, isDark && styles.darkPeriodButton]}
            onPress={() => setShowPeriodSelector(!showPeriodSelector)}
          >
            <Text style={[styles.periodButtonText, isDark && styles.darkText]}>
              {currentPeriod?.label || 'Ce mois'}
            </Text>
            <Ionicons 
              name={showPeriodSelector ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={isDark ? '#888' : '#666'} 
            />
          </TouchableOpacity>
        </View>

        {showPeriodSelector && <PeriodSelector />}
        
        <AdvancedFilters />
      </View>

      <FlatList
        data={[1]}
        renderItem={() => (
          <View style={styles.content}>
            <QuickStatsCard />
            <FinancialHealthCard />
            <TopCategoriesCard />
            <MonthlyTrendsCard />
            <ChartsSection />
            <View style={styles.spacer} />
          </View>
        )}
        keyExtractor={() => 'reports-content'}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={refreshAllData}
            colors={['#007AFF']}
            tintColor={isDark ? '#007AFF' : '#007AFF'}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        style={[styles.fab, isDark && styles.darkFab]}
        onPress={() => navigation.navigate('Export')}
      >
        <Ionicons name="download" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkHeader: {
    backgroundColor: '#2c2c2e',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  darkPeriodButton: {
    backgroundColor: '#3a3a3c',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  periodSelector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  periodSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  periodOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  periodOptionSelected: {
    backgroundColor: '#f0f8ff',
  },
  periodOptionText: {
    fontSize: 14,
    color: '#000',
  },
  periodOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  filtersSection: {
    marginTop: 12,
  },
  filtersToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  filtersToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
    flex: 1,
  },
  advancedFilters: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
  amountFilters: {
    flexDirection: 'row',
    gap: 12,
  },
  amountInputContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amountInput: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkAmountInput: {
    backgroundColor: '#3a3a3c',
    color: '#fff',
    borderColor: '#38383a',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  quickStatsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  healthCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoriesCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    minWidth: '45%',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthScore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthScoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  healthStatus: {
    marginBottom: 12,
  },
  healthStatusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  recommendations: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    paddingTop: 12,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  recommendation: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginLeft: 8,
    flex: 1,
  },
  categoryAmounts: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
  },
  trendsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendItem: {
    alignItems: 'center',
    flex: 1,
  },
  trendMonth: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  trendAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  darkFab: {
    backgroundColor: '#0A84FF',
  },
  spacer: {
    height: 100,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default ReportsScreen;