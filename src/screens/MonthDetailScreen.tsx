// src/screens/MonthDetailScreen.tsx - VERSION CORRIGÉE POUR STACK NAVIGATOR
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from '../components/SafeAreaView';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useMonthlyData } from '../hooks/useMonthlyData';

// Types pour la navigation
type RootStackParamList = {
  MonthDetail: { year: number; month: number };
  MonthsOverview: undefined;
};

type MonthDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MonthDetail'>;
type MonthDetailScreenRouteProp = RouteProp<RootStackParamList, 'MonthDetail'>;

// ✅ SUPPRIMER L'INTERFACE Props ET UTILISER useRoute HOOK
const MonthDetailScreen: React.FC = () => {
  const navigation = useNavigation<MonthDetailScreenNavigationProp>();
  const route = useRoute<MonthDetailScreenRouteProp>(); // ✅ UTILISER useRoute HOOK
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const { getMonthlyData } = useMonthlyData();
  const { year, month } = route.params; // ✅ ACCÉDER AUX PARAMS VIA useRoute
  const isDark = theme === 'dark';

  const monthData = useMemo(() => {
    return getMonthlyData(year, month);
  }, [getMonthlyData, year, month]);

  const monthName = new Date(year, month).toLocaleDateString('fr-FR', { 
    month: 'long',
    year: 'numeric'
  });

  const getSavingsStatus = (savingsRate: number) => {
    if (savingsRate >= 20) return { status: 'Excellent', color: '#10B981', emoji: '🎉' };
    if (savingsRate >= 10) return { status: 'Bon', color: '#22C55E', emoji: '👍' };
    if (savingsRate >= 0) return { status: 'Correct', color: '#F59E0B', emoji: '⚠️' };
    return { status: 'À améliorer', color: '#EF4444', emoji: '🚨' };
  };

  const savingsStatus = getSavingsStatus(monthData.savingsRate);

  const FinancialSummaryCard = () => (
    <View style={[styles.summaryCard, isDark && styles.darkCard]}>
      <Text style={[styles.cardTitle, isDark && styles.darkText]}>
        Résumé Financier
      </Text>
      
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <Text style={styles.summaryIconText}>💰</Text>
          </View>
          <Text style={styles.incomeValue}>
            {formatAmount(monthData.income)}
          </Text>
          <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>
            Revenus
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Text style={styles.summaryIconText}>💸</Text>
          </View>
          <Text style={styles.expenseValue}>
            {formatAmount(monthData.expenses)}
          </Text>
          <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>
            Dépenses
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { 
            backgroundColor: monthData.netFlow >= 0 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)' 
          }]}>
            <Text style={styles.summaryIconText}>
              {monthData.netFlow >= 0 ? '📈' : '📉'}
            </Text>
          </View>
          <Text style={[
            styles.netFlowValue,
            { color: monthData.netFlow >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            {formatAmount(monthData.netFlow)}
          </Text>
          <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>
            Solde
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { 
            backgroundColor: 'rgba(59, 130, 246, 0.1)' 
          }]}>
            <Text style={styles.summaryIconText}>{savingsStatus.emoji}</Text>
          </View>
          <Text style={[
            styles.savingsRateValue,
            { color: savingsStatus.color }
          ]}>
            {monthData.savingsRate.toFixed(1)}%
          </Text>
          <Text style={[styles.summaryLabel, isDark && styles.darkSubtext]}>
            Épargne
          </Text>
        </View>
      </View>
    </View>
  );

  const ExpenseChartCard = () => {
    if (monthData.categoryBreakdown.length === 0) {
      return (
        <View style={[styles.chartCard, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>
            Répartition des Dépenses
          </Text>
          <View style={styles.emptyChart}>
            <Text style={[styles.emptyChartText, isDark && styles.darkSubtext]}>
              Aucune dépense ce mois-ci
            </Text>
          </View>
        </View>
      );
    }

    const chartData = monthData.categoryBreakdown.slice(0, 6).map((item, index) => ({
      name: item.category.length > 10 ? `${item.category.substring(0, 10)}...` : item.category,
      value: item.amount,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][index],
      legendFontColor: isDark ? '#fff' : '#7F7F7F',
      legendFontSize: 12
    }));

    return (
      <View style={[styles.chartCard, isDark && styles.darkCard]}>
        <Text style={[styles.cardTitle, isDark && styles.darkText]}>
          Répartition des Dépenses
        </Text>
        
        <PieChart
          data={chartData}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            decimalPlaces: 0,
            color: () => isDark ? '#fff' : '#000',
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chart}
        />
      </View>
    );
  };

  const StatisticsCard = () => (
    <View style={[styles.statsCard, isDark && styles.darkCard]}>
      <Text style={[styles.cardTitle, isDark && styles.darkText]}>
        Statistiques Détaillées
      </Text>
      
      <View style={styles.statsList}>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Nombre de transactions
          </Text>
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            {monthData.transactionCount}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Dépense moyenne
          </Text>
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            {monthData.transactionCount > 0 ? formatAmount(monthData.expenses / monthData.transactionCount) : formatAmount(0)}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Revenu moyen
          </Text>
          <Text style={[styles.statValue, isDark && styles.darkText]}>
            {monthData.transactionCount > 0 ? formatAmount(monthData.income / monthData.transactionCount) : formatAmount(0)}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>
            Taux d'épargne
          </Text>
          <View style={styles.savingsStatus}>
            <Text style={[styles.statValue, { color: savingsStatus.color }]}>
              {monthData.savingsRate.toFixed(1)}%
            </Text>
            <Text style={[styles.savingsStatusText, { color: savingsStatus.color }]}>
              {savingsStatus.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const TopCategoriesCard = () => {
    if (monthData.categoryBreakdown.length === 0) {
      return null;
    }

    return (
      <View style={[styles.categoriesCard, isDark && styles.darkCard]}>
        <Text style={[styles.cardTitle, isDark && styles.darkText]}>
          Top Catégories de Dépenses
        </Text>
        
        {monthData.categoryBreakdown.slice(0, 5).map((category, index) => (
          <View key={category.category} style={styles.categoryItem}>
            <View style={styles.categoryLeft}>
              <View style={[
                styles.categoryColor,
                { 
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index]
                }
              ]} />
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, isDark && styles.darkText]}>
                  {category.category}
                </Text>
                <Text style={[styles.categoryPercentage, isDark && styles.darkSubtext]}>
                  {category.percentage.toFixed(1)}% du total
                </Text>
              </View>
            </View>
            <Text style={[styles.categoryAmount, isDark && styles.darkText]}>
              {formatAmount(category.amount)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, isDark && styles.darkText]}>← Retour</Text>
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkText]}>
            {monthName}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FinancialSummaryCard />
          <ExpenseChartCard />
          <StatisticsCard />
          <TopCategoriesCard />
          
          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoriesCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#1E293B',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryIconText: {
    fontSize: 20,
  },
  incomeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  netFlowValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savingsRateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 14,
    color: '#64748B',
  },
  chart: {
    marginVertical: 8,
  },
  statsList: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  savingsStatus: {
    alignItems: 'flex-end',
  },
  savingsStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
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
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#64748B',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  spacer: {
    height: 20,
  },
  darkText: {
    color: '#F1F5F9',
  },
  darkSubtext: {
    color: '#94A3B8',
  },
});

export default MonthDetailScreen;