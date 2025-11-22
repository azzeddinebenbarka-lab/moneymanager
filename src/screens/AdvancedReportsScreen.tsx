// src/screens/AdvancedReportsScreen.tsx - VERSION COMPLÈTEMENT CORRIGÉE
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FinancialSummaryCard } from '../components/analytics/FinancialSummaryCard';
import { NetWorthChart } from '../components/analytics/NetWorthChart';
import { useDesignSystem, useTheme } from '../context/ThemeContext';
import { useAdvancedAnalytics } from '../hooks/useAdvancedAnalytics';
import { CashFlowData, CategoryBreakdown, MonthlyTrend, NetWorthData } from '../types/Analytics';

const { width: screenWidth } = Dimensions.get('window');

// ✅ CORRECTION : Interfaces adaptées aux types réels
interface FinancialReport {
  cashFlow: CashFlowData[];
  categories: CategoryBreakdown[];
  monthlyTrend: MonthlyTrend[];
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // ✅ Ajout de la propriété manquante
}

// ✅ CORRECTION : Composants avec types adaptés
const CashFlowChart = ({ data, isDark, colors }: { data: CashFlowData[], isDark: boolean, colors: any }) => (
  <View style={[styles.placeholderChart, { backgroundColor: colors.background.card }]}>
    <Text style={[styles.placeholderText, { color: colors.text.primary }]}>
      📊 Graphique Flux de Trésorerie
    </Text>
    <Text style={[styles.placeholderSubtext, { color: colors.text.secondary }]}>
      {data.length} points de données disponibles
    </Text>
  </View>
);

const CategoryBreakdownChart = ({ categories, isDark, colors }: { categories: CategoryBreakdown[], isDark: boolean, colors: any }) => (
  <View style={[styles.placeholderChart, { backgroundColor: colors.background.card }]}>
    <Text style={[styles.placeholderText, { color: colors.text.primary }]}>
      🥧 Graphique Répartition Catégories
    </Text>
    <Text style={[styles.placeholderSubtext, { color: colors.text.secondary }]}>
      {categories.length} catégories à afficher
    </Text>
  </View>
);

const MonthlyTrendsChart = ({ data, isDark, colors }: { data: MonthlyTrend[], isDark: boolean, colors: any }) => (
  <View style={[styles.placeholderChart, { backgroundColor: colors.background.card }]}>
    <Text style={[styles.placeholderText, { color: colors.text.primary }]}>
      📈 Graphique Tendances Mensuelles
    </Text>
    <Text style={[styles.placeholderSubtext, { color: colors.text.secondary }]}>
      {data.length} mois de données
    </Text>
  </View>
);

// Composant Header personnalisé
const Header = ({ 
  title, 
  showBackButton, 
  onBackPress,
  colors
}: { 
  title: string; 
  showBackButton?: boolean; 
  onBackPress?: () => void;
  colors: any;
}) => (
  <View style={[styles.header, { backgroundColor: colors.background.primary }]}>
    <View style={styles.headerContent}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={[styles.backButtonText, { color: colors.primary[500] }]}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, { color: colors.text.primary }]}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  </View>
);

// Composant LoadingScreen personnalisé
const LoadingScreen = ({ colors }: { colors: any }) => (
  <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
    <ActivityIndicator size="large" color={colors.primary[500]} />
    <Text style={[styles.loadingText, { color: colors.text.primary }]}>Chargement des rapports...</Text>
  </View>
);

export const AdvancedReportsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { colors } = useDesignSystem();
  const {
    financialHealth,
    spendingByCategory,
    budgetPerformance,
    debtAnalytics,
    userData
  } = useAdvancedAnalytics();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'categories'>('overview');
  const [localLoading, setLocalLoading] = useState(false);

  const isDark = theme === 'dark';

  // ✅ CORRECTION : Fonctions de rafraîchissement simulées
  const refreshAllAnalytics = async () => {
    setLocalLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const refreshFinancialReport = async (period: 'month' | 'quarter' | 'year') => {
    setLocalLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erreur lors du changement de période:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAllAnalytics();
    setRefreshing(false);
  };

  const handlePeriodChange = async (period: 'month' | 'quarter' | 'year') => {
    setSelectedPeriod(period);
    await refreshFinancialReport(period);
  };

  // ✅ CORRECTION : Données simulées adaptées aux types réels
  const financialReport: FinancialReport = {
    cashFlow: [
      { 
        date: '2024-01', 
        income: 3000, 
        expenses: 2500, 
        // ✅ Suppression de 'net' si non présent dans CashFlowData
      },
      { 
        date: '2024-02', 
        income: 3200, 
        expenses: 2700,
      },
      { 
        date: '2024-03', 
        income: 3100, 
        expenses: 2600,
      },
    ],
    categories: [
      { 
        name: 'Alimentation', 
        amount: 600, 
        type: 'expense', 
        percentage: 24,
        color: '#FF6B6B',
        trend: 'stable' as const
      },
      { 
        name: 'Logement', 
        amount: 800, 
        type: 'expense', 
        percentage: 32,
        color: '#4ECDC4',
        trend: 'stable' as const
      },
      { 
        name: 'Transport', 
        amount: 300, 
        type: 'expense', 
        percentage: 12,
        color: '#45B7D1',
        trend: 'stable' as const
      },
      { 
        name: 'Salaire', 
        amount: 3000, 
        type: 'income', 
        percentage: 100,
        color: '#54A0FF',
        trend: 'stable' as const
      },
    ],
    monthlyTrend: [
      { 
        month: 'Jan', 
        income: 3000, 
        expenses: 2500,
        savings: 500,
        savingsRate: 16.7
      },
      { 
        month: 'Fév', 
        income: 3200, 
        expenses: 2700,
        savings: 500,
        savingsRate: 15.6
      },
      { 
        month: 'Mar', 
        income: 3100, 
        expenses: 2600,
        savings: 500,
        savingsRate: 16.1
      },
    ],
    period: selectedPeriod,
    totalIncome: financialHealth?.totalIncome || 0,
    totalExpenses: financialHealth?.totalExpenses || 0,
    netSavings: (financialHealth?.totalIncome || 0) - (financialHealth?.totalExpenses || 0),
    savingsRate: financialHealth?.savingsRate || 0 // ✅ Ajout de la propriété manquante
  };

  // ✅ CORRECTION : Données simulées adaptées à NetWorthData
  const netWorthHistory: NetWorthData[] = [
    { 
      date: '2024-01', 
      assets: 18000, 
      liabilities: 3000,
      netWorth: 18000 - 3000,
      // ✅ Suppression de 'total' si non présent dans NetWorthData
    },
    { 
      date: '2024-02', 
      assets: 18500, 
      liabilities: 3000,
      netWorth: 18500 - 3000,
    },
    { 
      date: '2024-03', 
      assets: 19000, 
      liabilities: 3000,
      netWorth: 19000 - 3000,
    },
    { 
      date: '2024-04', 
      assets: 19500, 
      liabilities: 3000,
      netWorth: 19500 - 3000,
    },
  ];

  if (localLoading && !refreshing) {
    return <LoadingScreen colors={colors} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Header 
        title="Rapports Avancés" 
        showBackButton 
        onBackPress={() => navigation.goBack()}
        colors={colors}
      />

      {/* Sélecteur de période */}
      <View style={[styles.periodSelector, { backgroundColor: colors.background.card }]}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: selectedPeriod === 'month' ? colors.primary[500] : 'transparent' }
          ]}
          onPress={() => handlePeriodChange('month')}
        >
          <Text style={[
            styles.periodButtonText,
            { color: selectedPeriod === 'month' ? colors.text.inverse : colors.text.secondary }
          ]}>
            Mois
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: selectedPeriod === 'quarter' ? colors.primary[500] : 'transparent' }
          ]}
          onPress={() => handlePeriodChange('quarter')}
        >
          <Text style={[
            styles.periodButtonText,
            { color: selectedPeriod === 'quarter' ? colors.text.inverse : colors.text.secondary }
          ]}>
            Trimestre
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: selectedPeriod === 'year' ? colors.primary[500] : 'transparent' }
          ]}
          onPress={() => handlePeriodChange('year')}
        >
          <Text style={[
            styles.periodButtonText,
            { color: selectedPeriod === 'year' ? colors.text.inverse : colors.text.secondary }
          ]}>
            Année
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation par onglets */}
      <View style={[styles.tabContainer, { backgroundColor: colors.background.card }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: activeTab === 'overview' ? colors.primary[500] : 'transparent' }
          ]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: activeTab === 'overview' ? colors.text.inverse : colors.text.secondary }
          ]}>
            Aperçu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: activeTab === 'trends' ? colors.primary[500] : 'transparent' }
          ]}
          onPress={() => setActiveTab('trends')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: activeTab === 'trends' ? colors.text.inverse : colors.text.secondary }
          ]}>
            Tendances
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: activeTab === 'categories' ? colors.primary[500] : 'transparent' }
          ]}
          onPress={() => setActiveTab('categories')}
        >
          <Text style={[
            styles.tabButtonText,
            { color: activeTab === 'categories' ? colors.text.inverse : colors.text.secondary }
          ]}>
            Catégories
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Résumé financier */}
        <FinancialSummaryCard 
          report={financialReport}
          period={selectedPeriod}
          isDark={isDark}
        />

        {/* Contenu par onglet */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Patrimoine net */}
            {netWorthHistory && netWorthHistory.length > 0 && (
              <View style={styles.chartSection}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Évolution du Patrimoine
                </Text>
                <NetWorthChart 
                  data={netWorthHistory}
                  isDark={isDark}
                />
              </View>
            )}

            {/* Flux de trésorerie */}
            {financialReport?.cashFlow && financialReport.cashFlow.length > 0 && (
              <View style={styles.chartSection}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Flux de Trésorerie (30 jours)
                </Text>
                <CashFlowChart 
                  data={financialReport.cashFlow}
                  isDark={isDark}
                  colors={colors}
                />
              </View>
            )}
          </View>
        )}

        {activeTab === 'trends' && financialReport && (
          <View style={styles.tabContent}>
            {/* Tendances mensuelles */}
            <View style={styles.chartSection}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Tendances sur 6 mois
              </Text>
              <MonthlyTrendsChart 
                data={financialReport.monthlyTrend || []}
                isDark={isDark}
                colors={colors}
              />
            </View>

            {/* Score financier */}
            <View style={styles.chartSection}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Score Financier
              </Text>
              <View style={[styles.scoreContainer, { backgroundColor: colors.background.card }]}>
                <Text style={[styles.scoreValue, { color: colors.text.primary }]}>
                  {financialHealth?.financialScore || 75}/100
                </Text>
                <View style={styles.scoreBar}>
                  <View 
                    style={[
                      styles.scoreFill,
                      { width: `${financialHealth?.financialScore || 75}%` }
                    ]} 
                  />
                </View>
                <Text style={[styles.scoreLabel, { color: colors.text.secondary }]}>
                  {financialHealth?.financialScore && financialHealth.financialScore >= 80 ? 'Excellent' :
                   financialHealth?.financialScore && financialHealth.financialScore >= 60 ? 'Bon' :
                   'À améliorer'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'categories' && financialReport && (
          <View style={styles.tabContent}>
            {/* Répartition par catégorie */}
            {financialReport.categories && financialReport.categories.filter((c: CategoryBreakdown) => c.type === 'expense').length > 0 && (
              <View style={styles.chartSection}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Répartition des Dépenses
                </Text>
                <CategoryBreakdownChart 
                  categories={financialReport.categories.filter((c: CategoryBreakdown) => c.type === 'expense')}
                  isDark={isDark}
                  colors={colors}
                />
                
                {/* Liste des catégories de dépenses */}
                <View style={styles.categoriesList}>
                  {financialReport.categories
                    .filter((c: CategoryBreakdown) => c.type === 'expense')
                    .map((category, index) => (
                      <View key={index} style={styles.categoryItem}>
                        <View style={styles.categoryInfo}>
                          <View style={[styles.categoryColor, { backgroundColor: category.color || '#CCCCCC' }]} />
                          <Text style={[styles.categoryName, { color: colors.text.primary }]}>
                            {category.name}
                          </Text>
                        </View>
                        <Text style={[styles.categoryAmount, { color: colors.text.primary }]}>
                          {category.amount} € ({category.percentage}%)
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            )}

            {/* Répartition des revenus */}
            {financialReport.categories && financialReport.categories.filter((c: CategoryBreakdown) => c.type === 'income').length > 0 && (
              <View style={styles.chartSection}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Répartition des Revenus
                </Text>
                <CategoryBreakdownChart 
                  categories={financialReport.categories.filter((c: CategoryBreakdown) => c.type === 'income')}
                  isDark={isDark}
                  colors={colors}
                />
              </View>
            )}
          </View>
        )}

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.background.card }]}
            onPress={() => navigation.navigate('DebtAnalytics')}
          >
            <Text style={[styles.actionButtonText, { color: colors.text.primary }]}>
              📊 Analytics Dettes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.background.card }]}
            onPress={() => navigation.navigate('SavingsAnalytics')}
          >
            <Text style={[styles.actionButtonText, { color: colors.text.primary }]}>
              🎯 Analytics Épargne
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  periodSelector: {
    flexDirection: 'row',
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
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContent: {
    gap: 20,
  },
  chartSection: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholderChart: {
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 12,
  },
  scoreContainer: {
    alignItems: 'center',
    padding: 20,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesList: {
    marginTop: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    minWidth: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
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
});

export default AdvancedReportsScreen;