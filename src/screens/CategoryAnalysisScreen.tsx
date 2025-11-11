// src/screens/CategoryAnalysisScreen.tsx - VERSION AVEC NOUVEAUX FILTRES
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from '../components/SafeAreaView';
import { AnalyticsCard } from '../components/analytics/AnalyticsCard';
import BarChart from '../components/charts/BarChart';
import ChartFilters, { ChartFilter } from '../components/charts/ChartFilters';
import PieChart from '../components/charts/PieChart';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';

const CategoryAnalysisScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { categories } = useCategories();
  const { analytics } = useAnalytics();
  
  const [filters, setFilters] = useState<ChartFilter>({
    period: 'month',
    type: 'expense'
  });
  
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'chart' | 'list' | 'stats'>('chart');

  const isDark = theme === 'dark';

  // Calculer les données avec les nouveaux filtres
  const calculateCategoryData = useCallback(() => {
    setLoading(true);
    
    try {
      const currentDate = new Date();
      let startDate = new Date();
      let endDate = currentDate;

      // Appliquer les filtres de période
      switch (filters.period) {
        case 'week':
          startDate.setDate(currentDate.getDate() - 7);
          break;
        case 'month':
          if (filters.month && filters.year) {
            startDate = new Date(filters.year, filters.month - 1, 1);
            endDate = new Date(filters.year, filters.month, 0);
          } else {
            startDate.setMonth(currentDate.getMonth() - 1);
          }
          break;
        case 'year':
          if (filters.year) {
            startDate = new Date(filters.year, 0, 1);
            endDate = new Date(filters.year, 11, 31);
          } else {
            startDate.setFullYear(currentDate.getFullYear() - 1);
          }
          break;
        case 'custom':
          if (filters.month && filters.year) {
            startDate = new Date(filters.year, filters.month - 1, 1);
            endDate = new Date(filters.year, filters.month, 0);
          } else if (filters.year) {
            startDate = new Date(filters.year, 0, 1);
            endDate = new Date(filters.year, 11, 31);
          }
          break;
      }

      // Filtrer les transactions selon les critères
      const filteredTransactions = transactions.filter(transaction => {
        if (!transaction.date) return false;
        
        // Filtre date
        const transactionDate = new Date(transaction.date);
        if (transactionDate < startDate || transactionDate > endDate) return false;
        
        // Filtre type
        if (filters.type !== 'all' && transaction.type !== filters.type) return false;
        
        // Filtre catégorie
        if (filters.category && transaction.category !== filters.category) return false;
        
        return true;
      });

      // Préparer les données pour le graphique circulaire
      const categoryTotals: { [key: string]: number } = {};
      let totalAmount = 0;

      filteredTransactions.forEach(transaction => {
        const amount = Math.abs(transaction.amount || 0);
        const categoryName = transaction.category || 'Non catégorisé';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + amount;
        totalAmount += amount;
      });

      const chartData = Object.entries(categoryTotals)
        .map(([category, amount]) => {
          const categoryInfo = categories.find(cat => cat.name === category);
          return {
            name: category,
            amount: amount,
            value: amount, // Pour compatibilité avec PieChart
            percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
            color: categoryInfo?.color || '#666666',
            count: filteredTransactions.filter(t => t.category === category).length,
          };
        })
        .sort((a, b) => b.amount - a.amount);

      setCategoryData(chartData);

      // Préparer les données pour le graphique en barres (par mois)
      if (filters.period === 'year' || !filters.month) {
        const monthlyData = prepareMonthlyBarChartData(filteredTransactions, filters.year);
        setBarChartData(monthlyData);
      } else {
        setBarChartData(null);
      }

      console.log('📊 Category analysis with filters:', {
        period: filters.period,
        year: filters.year,
        month: filters.month,
        type: filters.type,
        category: filters.category,
        totalTransactions: filteredTransactions.length,
        totalAmount,
        categories: chartData.length
      });
    } catch (error) {
      console.error('❌ Error calculating category data:', error);
    } finally {
      setLoading(false);
    }
  }, [transactions, categories, filters]);

  const prepareMonthlyBarChartData = (transactions: any[], year?: number) => {
    const targetYear = year || new Date().getFullYear();
    const monthlyTotals: { [key: number]: number } = {};
    
    // Initialiser tous les mois
    for (let month = 0; month < 12; month++) {
      monthlyTotals[month] = 0;
    }
    
    // Calculer les totaux par mois
    transactions.forEach(transaction => {
      if (!transaction.date) return;
      
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getFullYear() === targetYear) {
        const month = transactionDate.getMonth();
        monthlyTotals[month] += Math.abs(transaction.amount || 0);
      }
    });
    
    // Préparer les données pour BarChart
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    return {
      labels: months,
      datasets: [
        {
          data: Object.values(monthlyTotals),
          colors: Object.values(monthlyTotals).map(() => '#007AFF'),
          label: `Dépenses ${targetYear}`
        }
      ]
    };
  };

  useEffect(() => {
    calculateCategoryData();
  }, [calculateCategoryData]);

  const getTopCategory = () => {
    return categoryData.length > 0 ? categoryData[0] : null;
  };

  const getTotalAmount = () => {
    return categoryData.reduce((sum, cat) => sum + cat.amount, 0);
  };

  const getAveragePerCategory = () => {
    return categoryData.length > 0 ? getTotalAmount() / categoryData.length : 0;
  };

  const handleCategoryPress = (categoryName: string) => {
  try {
    // Navigation sécurisée avec vérification des types
    const navigationParams = {
      category: categoryName,
      filters: {
        period: filters.period,
        year: filters.year,
        month: filters.month
      }
    };

    // Utiliser une approche type-safe pour la navigation
    (navigation as any).navigate('Transactions', navigationParams);
  } catch (error) {
    console.warn('Navigation vers Transactions non disponible');
    (navigation as any).navigate('Transactions');
  }
};

  if (loading || transactionsLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>
          Analyse des catégories...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Analyse par Catégorie
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Filtres avancés */}
        <ChartFilters
          filters={filters}
          onFiltersChange={setFilters}
          showCategoryFilter={true}
          showTypeFilter={true}
        />

        {/* Mode de vue */}
        <View style={styles.viewModeSelector}>
          {(['chart', 'list', 'stats'] as const).map(mode => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.viewModeButton,
                viewMode === mode && styles.viewModeButtonActive,
                isDark && styles.darkViewModeButton,
              ]}
              onPress={() => setViewMode(mode)}
            >
              <Ionicons 
                name={
                  mode === 'chart' ? 'pie-chart' : 
                  mode === 'list' ? 'list' : 'stats-chart'
                }
                size={16}
                color={viewMode === mode ? '#007AFF' : (isDark ? '#888' : '#666')}
              />
              <Text
                style={[
                  styles.viewModeText,
                  viewMode === mode && styles.viewModeTextActive,
                  isDark && styles.darkText,
                ]}
              >
                {mode === 'chart' ? 'Graphique' : 
                 mode === 'list' ? 'Liste' : 'Stats'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Cartes de statistiques rapides */}
          <View style={styles.quickStats}>
            <AnalyticsCard
              title="Total"
              value={formatAmount(getTotalAmount())}
              subtitle={`${categoryData.length} catégories`}
            />
            <AnalyticsCard
              title="Moyenne"
              value={formatAmount(getAveragePerCategory())}
              subtitle="Par catégorie"
            />
            {getTopCategory() && (
              <AnalyticsCard
                title="Catégorie principale"
                value={getTopCategory()?.name || ''}
                subtitle={formatAmount(getTopCategory()?.amount || 0)}
              />
            )}
          </View>

          {/* Vue Graphique */}
          {viewMode === 'chart' && categoryData.length > 0 && (
            <View style={styles.chartSection}>
              <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                Répartition des {filters.type === 'income' ? 'Revenus' : 'Dépenses'}
              </Text>
              
              <View style={styles.chartContainer}>
                <PieChart 
                  data={categoryData} 
                  height={300}
                  title={`${filters.type === 'income' ? 'Revenus' : 'Dépenses'} par catégorie`}
                />
              </View>

              {/* Graphique en barres pour vue annuelle */}
              {barChartData && (
                <View style={styles.barChartContainer}>
                  <BarChart
                    data={barChartData}
                    height={250}
                    title={`${filters.type === 'income' ? 'Revenus' : 'Dépenses'} mensuels ${filters.year || new Date().getFullYear()}`}
                  />
                </View>
              )}
            </View>
          )}

          {/* Vue Liste */}
          {viewMode === 'list' && categoryData.length > 0 && (
            <View style={styles.listSection}>
              <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                Détail par Catégorie
              </Text>
              
              <View style={styles.categoriesList}>
                {categoryData.map((category, index) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[styles.categoryItem, isDark && styles.darkCard]}
                    onPress={() => handleCategoryPress(category.name)}
                  >
                    <View style={styles.categoryLeft}>
                      <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                      <View style={styles.categoryInfo}>
                        <Text style={[styles.categoryName, isDark && styles.darkText]}>
                          {category.name}
                        </Text>
                        <Text style={[styles.categoryCount, isDark && styles.darkSubtext]}>
                          {category.count} transaction{category.count > 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.categoryRight}>
                      <Text style={[styles.categoryAmount, isDark && styles.darkText]}>
                        {formatAmount(category.amount)}
                      </Text>
                      <Text style={[styles.categoryPercentage, isDark && styles.darkSubtext]}>
                        {category.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Vue Statistiques */}
          {viewMode === 'stats' && (
            <View style={styles.statsSection}>
              <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                Statistiques Détaillées
              </Text>
              
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, isDark && styles.darkCard]}>
                  <Ionicons name="layers" size={24} color="#007AFF" />
                  <Text style={[styles.statValue, isDark && styles.darkText]}>
                    {categoryData.length}
                  </Text>
                  <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                    Catégories utilisées
                  </Text>
                </View>
                
                <View style={[styles.statCard, isDark && styles.darkCard]}>
                  <Ionicons name="trending-up" size={24} color="#34C759" />
                  <Text style={[styles.statValue, isDark && styles.darkText]}>
                    {formatAmount(getTotalAmount())}
                  </Text>
                  <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                    Total {filters.type === 'income' ? 'gagné' : 'dépensé'}
                  </Text>
                </View>
                
                <View style={[styles.statCard, isDark && styles.darkCard]}>
                  <Ionicons name="pulse" size={24} color="#FF9500" />
                  <Text style={[styles.statValue, isDark && styles.darkText]}>
                    {formatAmount(getAveragePerCategory())}
                  </Text>
                  <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                    Moyenne par catégorie
                  </Text>
                </View>
                
                <View style={[styles.statCard, isDark && styles.darkCard]}>
                  <Ionicons name="trophy" size={24} color="#FFD700" />
                  <Text style={[styles.statValue, isDark && styles.darkText]}>
                    {getTopCategory()?.name || '-'}
                  </Text>
                  <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
                    Catégorie principale
                  </Text>
                </View>
              </View>

              {/* Santé financière */}
              <View style={[styles.healthCard, isDark && styles.darkCard]}>
                <View style={styles.healthHeader}>
                  <Ionicons name="heart" size={24} color="#FF6B6B" />
                  <Text style={[styles.healthTitle, isDark && styles.darkText]}>
                    Santé Financière
                  </Text>
                </View>
                <Text style={[styles.healthScore, isDark && styles.darkText]}>
                  {analytics.financialHealth}/100
                </Text>
                <Text style={[styles.healthDescription, isDark && styles.darkSubtext]}>
                  Basé sur vos habitudes de {filters.type === 'income' ? 'revenus' : 'dépenses'}
                </Text>
              </View>
            </View>
          )}

          {categoryData.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="pie-chart-outline" size={64} color={isDark ? '#555' : '#ccc'} />
              <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
                Aucune donnée pour ces filtres
              </Text>
              <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
                Essayez de modifier les filtres ou ajoutez des transactions
              </Text>
            </View>
          )}

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// ... (les styles restent globalement les mêmes avec quelques ajouts)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  viewModeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  darkViewModeButton: {
    backgroundColor: '#2c2c2e',
    borderColor: '#38383a',
  },
  viewModeButtonActive: {
    backgroundColor: '#007AFF20',
    borderColor: '#007AFF',
  },
  viewModeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  viewModeTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  quickStats: {
    padding: 20,
    gap: 12,
  },
  chartSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  chartContainer: {
    marginBottom: 20,
  },
  barChartContainer: {
    marginTop: 20,
  },
  listSection: {
    padding: 20,
    paddingTop: 0,
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statsSection: {
    padding: 20,
    paddingTop: 0,
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  healthCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 12,
  },
  healthScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  healthDescription: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#888',
  },
});

export default CategoryAnalysisScreen;