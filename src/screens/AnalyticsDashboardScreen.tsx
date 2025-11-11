// src/screens/AnalyticsDashboardScreen.tsx - VERSION CORRIGÉE AVEC MAD
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCurrency } from '../context/CurrencyContext'; // ✅ AJOUT
import { useTheme } from '../context/ThemeContext';
import { useAdvancedAnalytics } from '../hooks/useAdvancedAnalytics';
import { useReports } from '../hooks/useReports';

// Composants de graphiques
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';

// Composants analytics
import { AnalyticsCard } from '../components/analytics/AnalyticsCard';

const { width: screenWidth } = Dimensions.get('window');

// Types
interface KPIItem {
  title: string;
  value: string;
  subtitle: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
  icon: string;
  color: string;
}

interface TabContentProps {
  isDark: boolean;
  navigation?: any;
}

interface OverviewTabProps extends TabContentProps {
  kpiData: KPIItem[];
  chartData: any;
  pieChartData: any;
}

interface TrendsTabProps extends TabContentProps {
  monthlySummaries: any[];
}

interface CategoriesTabProps extends TabContentProps {
  pieChartData: any[];
  navigation: any;
}

interface InsightsTabProps extends TabContentProps {
  financialHealth: any;
}

const AnalyticsDashboardScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency(); // ✅ AJOUT
  const {
    quickStats,
    monthlySummaries,
    financialHealth,
    chartData,
    pieChartData,
    loading,
    refreshing,
    refreshAllData,
    currentPeriod,
    changePeriod,
  } = useReports();

  const { financialHealth: advancedHealth } = useAdvancedAnalytics();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'categories' | 'insights'>('overview');
  const isDark = theme === 'dark';

  // Données synthétisées pour les KPI - ✅ CORRECTION : Utiliser formatAmount
  const kpiData = useMemo((): KPIItem[] => [
    {
      title: 'Revenus Mensuels',
      value: formatAmount(quickStats.totalIncome), // ✅ CORRECTION
      subtitle: '+12% vs mois dernier',
      trend: { value: 12, isPositive: true },
      icon: 'trending-up',
      color: '#10B981'
    },
    {
      title: 'Dépenses',
      value: formatAmount(quickStats.totalExpenses), // ✅ CORRECTION
      subtitle: '-5% vs mois dernier', 
      trend: { value: 5, isPositive: false },
      icon: 'trending-down',
      color: '#EF4444'
    },
    {
      title: 'Taux Épargne',
      value: `${quickStats.savingsRate.toFixed(1)}%`,
      subtitle: 'Objectif: 20%',
      trend: { value: 8, isPositive: true },
      icon: 'pie-chart',
      color: '#3B82F6'
    },
    {
      title: 'Santé Financière',
      value: `${financialHealth?.score || 75}/100`,
      subtitle: financialHealth?.status === 'excellent' ? 'Excellent' : 'Bon',
      trend: { value: 15, isPositive: true },
      icon: 'heart',
      color: '#8B5CF6'
    }
  ], [quickStats, financialHealth, formatAmount]); // ✅ AJOUT formatAmount dans les dépendances

  // Contenu par onglet
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab 
          kpiData={kpiData}
          chartData={chartData}
          pieChartData={pieChartData}
          isDark={isDark}
        />;
      case 'trends':
        return <TrendsTab 
          monthlySummaries={monthlySummaries}
          isDark={isDark}
        />;
      case 'categories':
        return <CategoriesTab 
          pieChartData={pieChartData}
          isDark={isDark}
          navigation={navigation}
        />;
      case 'insights':
        return <InsightsTab 
          financialHealth={financialHealth}
          isDark={isDark}
        />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Analytics
          </Text>
          <TouchableOpacity style={[styles.periodButton, isDark && styles.darkPeriodButton]}>
            <Text style={[styles.periodText, isDark && styles.darkText]}>
              {currentPeriod?.label || 'Ce mois'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={isDark ? '#888' : '#666'} />
          </TouchableOpacity>
        </View>

        {/* Navigation par onglets */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContainer}
        >
          {[
            { key: 'overview', label: 'Aperçu', icon: 'speedometer' },
            { key: 'trends', label: 'Tendances', icon: 'trending-up' },
            { key: 'categories', label: 'Catégories', icon: 'pricetags' },
            { key: 'insights', label: 'Insights', icon: 'analytics' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.activeTab,
                isDark && activeTab === tab.key && styles.darkActiveTab,
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Ionicons 
                name={tab.icon as any} 
                size={16} 
                color={activeTab === tab.key ? '#007AFF' : (isDark ? '#888' : '#666')} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
                isDark && styles.darkText,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Contenu */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAllData}
            tintColor={isDark ? '#fff' : '#000'}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

// Composants pour chaque onglet
const OverviewTab: React.FC<OverviewTabProps> = ({ kpiData, chartData, pieChartData, isDark }) => (
  <View style={styles.tabContent}>
    {/* Grille de KPI */}
    <View style={styles.kpiGrid}>
      {kpiData.map((kpi: KPIItem, index: number) => (
        <AnalyticsCard
          key={index}
          title={kpi.title}
          value={kpi.value} // ✅ DÉJÀ CORRIGÉ AVEC formatAmount
          subtitle={kpi.subtitle}
          trend={kpi.trend}
          icon={kpi.icon}
        />
      ))}
    </View>

    {/* Graphiques principaux */}
    <View style={styles.chartsSection}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        Flux de Trésorerie
      </Text>
      {chartData && (
        <BarChart 
          data={chartData}
          title=""
          height={200}
        />
      )}

      <View style={styles.chartsRow}>
        <View style={styles.halfChart}>
          <Text style={[styles.chartTitle, isDark && styles.darkText]}>
            Répartition Dépenses
          </Text>
          {pieChartData && pieChartData.length > 0 ? (
            <PieChart 
              data={pieChartData}
              height={180}
            />
          ) : (
            <View style={[styles.placeholderChart, isDark && styles.darkPlaceholder]}>
              <Text style={[styles.placeholderText, isDark && styles.darkText]}>
                Données indisponibles
              </Text>
            </View>
          )}
        </View>

        <View style={styles.halfChart}>
          <Text style={[styles.chartTitle, isDark && styles.darkText]}>
            Évolution
          </Text>
          {chartData && (
            <LineChart 
              data={chartData}
              height={180}
            />
          )}
        </View>
      </View>
    </View>
  </View>
);

const TrendsTab: React.FC<TrendsTabProps> = ({ monthlySummaries, isDark }) => {
  const { formatAmount } = useCurrency(); // ✅ AJOUT dans le composant

  return (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        Tendances sur 6 mois
      </Text>
      
      {/* Graphique d'évolution */}
      <View style={[styles.trendChart, isDark && styles.darkCard]}>
        <Text style={[styles.placeholderText, isDark && styles.darkText]}>
          Graphique des tendances mensuelles
        </Text>
      </View>

      {/* Tableau des données - ✅ CORRECTION : Utiliser formatAmount */}
      <View style={[styles.dataTable, isDark && styles.darkCard]}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, isDark && styles.darkText]}>Mois</Text>
          <Text style={[styles.tableHeaderText, isDark && styles.darkText]}>Revenus</Text>
          <Text style={[styles.tableHeaderText, isDark && styles.darkText]}>Dépenses</Text>
          <Text style={[styles.tableHeaderText, isDark && styles.darkText]}>Épargne</Text>
        </View>
        
        {monthlySummaries.slice(-6).map((summary: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, isDark && styles.darkText]}>{summary.label}</Text>
            <Text style={[styles.tableCell, isDark && styles.darkText]}>
              {formatAmount(summary.income || 0)} {/* ✅ CORRECTION */}
            </Text>
            <Text style={[styles.tableCell, isDark && styles.darkText]}>
              {formatAmount(summary.expenses || 0)} {/* ✅ CORRECTION */}
            </Text>
            <Text style={[
              styles.tableCell, 
              { color: (summary.savings || 0) >= 0 ? '#10B981' : '#EF4444' }
            ]}>
              {formatAmount(summary.savings || 0)} {/* ✅ CORRECTION */}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const CategoriesTab: React.FC<CategoriesTabProps> = ({ pieChartData, isDark, navigation }) => {
  const { formatAmount } = useCurrency(); // ✅ AJOUT dans le composant

  return (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        Analyse par Catégorie
      </Text>
      
      {pieChartData && pieChartData.length > 0 ? (
        <>
          <PieChart 
            data={pieChartData}
            title="Répartition des Dépenses"
            height={250}
          />
          
          {/* Liste des catégories - ✅ CORRECTION : Utiliser formatAmount */}
          <View style={[styles.categoriesList, isDark && styles.darkCard]}>
            {pieChartData.map((category: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => navigation.navigate('CategoryAnalysis', { 
                  category: category.name 
                })}
              >
                <View style={styles.categoryLeft}>
                  <View 
                    style={[styles.colorDot, { backgroundColor: category.color }]} 
                  />
                  <Text style={[styles.categoryName, isDark && styles.darkText]}>
                    {category.name}
                  </Text>
                </View>
                <View style={styles.categoryRight}>
                  <Text style={[styles.categoryAmount, isDark && styles.darkText]}>
                    {formatAmount(category.amount || 0)} {/* ✅ CORRECTION */}
                  </Text>
                  <Text style={[styles.categoryPercentage, isDark && styles.darkSubtext]}>
                    {category.percentage?.toFixed(1) || '0.0'}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={[styles.placeholderChart, isDark && styles.darkPlaceholder]}>
          <Text style={[styles.placeholderText, isDark && styles.darkText]}>
            Aucune donnée de catégorie disponible
          </Text>
        </View>
      )}
    </View>
  );
};

const InsightsTab: React.FC<InsightsTabProps> = ({ financialHealth, isDark }) => {
  const { formatAmount } = useCurrency(); // ✅ AJOUT dans le composant

  const getHealthColor = (status: string): string => {
    switch (status) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      case 'critical': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getHealthStatusText = (status: string): string => {
    switch (status) {
      case 'excellent': return 'Excellente santé financière';
      case 'good': return 'Bonne santé financière';
      case 'fair': return 'Santé financière moyenne';
      case 'poor': return 'Santé financière à améliorer';
      case 'critical': return 'Attention requise';
      default: return 'Non évaluée';
    }
  };

  return (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        Insights Intelligents
      </Text>
      
      {/* Score de santé financière */}
      <View style={[styles.healthCard, isDark && styles.darkCard]}>
        <View style={styles.healthHeader}>
          <Text style={[styles.healthTitle, isDark && styles.darkText]}>
            Santé Financière
          </Text>
          <View style={[
            styles.scoreBadge,
            { backgroundColor: getHealthColor(financialHealth?.status || 'good') }
          ]}>
            <Text style={styles.scoreText}>
              {financialHealth?.score || 75}
            </Text>
          </View>
        </View>
        
        <View style={styles.scoreBar}>
          <View 
            style={[
              styles.scoreProgress,
              { 
                width: `${financialHealth?.score || 75}%`,
                backgroundColor: getHealthColor(financialHealth?.status || 'good')
              }
            ]} 
          />
        </View>
        
        <Text style={[styles.healthStatus, isDark && styles.darkText]}>
          {getHealthStatusText(financialHealth?.status || 'good')}
        </Text>
        
        {/* Recommandations */}
        {financialHealth?.recommendations && (
          <View style={styles.recommendations}>
            <Text style={[styles.recommendationsTitle, isDark && styles.darkSubtext]}>
              Recommandations
            </Text>
            {financialHealth.recommendations.map((rec: string, index: number) => (
              <View key={index} style={styles.recommendationItem}>
                <Ionicons name="bulb-outline" size={16} color="#F59E0B" />
                <Text style={[styles.recommendationText, isDark && styles.darkText]}>
                  {rec}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      {/* Insights supplémentaires */}
      <View style={[styles.insightsGrid, isDark && styles.darkCard]}>
        <View style={styles.insightItem}>
          <Ionicons name="calendar" size={24} color="#3B82F6" />
          <Text style={[styles.insightTitle, isDark && styles.darkText]}>
            Dépenses Récurrentes
          </Text>
          <Text style={[styles.insightValue, isDark && styles.darkText]}>
            {formatAmount(245)}/mois {/* ✅ CORRECTION */}
          </Text>
        </View>
        
        <View style={styles.insightItem}>
          <Ionicons name="trending-up" size={24} color="#10B981" />
          <Text style={[styles.insightTitle, isDark && styles.darkText]}>
            Croissance Épargne
          </Text>
          <Text style={[styles.insightValue, isDark && styles.darkText]}>
            +15% ce mois
          </Text>
        </View>
      </View>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  darkHeader: {
    backgroundColor: '#1E293B',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  darkPeriodButton: {
    backgroundColor: '#334155',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  tabScroll: {
    marginHorizontal: -20,
  },
  tabContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 6,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#E0F2FE',
  },
  darkActiveTab: {
    backgroundColor: '#1E40AF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
    gap: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chartsSection: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  chartsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfChart: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderChart: {
    height: 180,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  darkPlaceholder: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  placeholderText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  trendChart: {
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dataTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableCell: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
    textAlign: 'center',
  },
  categoriesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  scoreBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  healthStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  recommendations: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
    lineHeight: 20,
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  spacer: {
    height: 100,
  },
  darkCard: {
    backgroundColor: '#1E293B',
  },
  darkText: {
    color: '#F1F5F9',
  },
  darkSubtext: {
    color: '#94A3B8',
  },
});

export default AnalyticsDashboardScreen;