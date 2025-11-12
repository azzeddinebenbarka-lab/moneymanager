// src/screens/DashboardScreen.tsx - VERSION CORRIGÉE AVEC PIE CHART
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useAccounts } from '../hooks/useAccounts';
import { useAnalytics } from '../hooks/useAnalytics';
import { useBudgets } from '../hooks/useBudgets';
import { useDebts } from '../hooks/useDebts';
import { useSavings } from '../hooks/useSavings';
import { useTransactions } from '../hooks/useTransactions';
import { calculationService } from '../services/calculationService';

const { width } = Dimensions.get('window');

// ✅ COMPOSANT PIE CHART POUR REVENUS/DÉPENSES/SOLDE
interface PieChartProps {
  income: number;
  expenses: number;
  balance: number;
  isDark: boolean;
  formatAmount: (amount: number) => string;
}

const FinancialPieChart: React.FC<PieChartProps> = ({ 
  income, 
  expenses, 
  balance, 
  isDark, 
  formatAmount 
}) => {
  const total = income + expenses + Math.abs(balance);
  
  if (total === 0) {
    return (
      <View style={styles.pieChartContainer}>
        <View style={[styles.emptyPie, { backgroundColor: isDark ? '#38383a' : '#f0f0f0' }]}>
          <Text style={[styles.emptyPieText, isDark && styles.darkText]}>Aucune donnée</Text>
        </View>
      </View>
    );
  }

  // ✅ CORRECTION: Préparer les données avec des valeurs minimales pour éviter les erreurs
const series = [
  Math.max(0.1, income),      // Revenus (vert)
  Math.max(0.1, expenses),    // Dépenses (rouge)
  Math.max(0.1, Math.abs(balance)) // Solde (bleu/orange)
] as number[]; // ✅ AJOUT: Cast explicite en number[]

  // ✅ Couleurs correspondantes
  const sliceColors = [
    '#10B981', // Vert pour les revenus
    '#EF4444', // Rouge pour les dépenses
    balance >= 0 ? '#007AFF' : '#F59E0B' // Bleu pour épargne, Orange pour déficit
  ];

  // ✅ Calculer les pourcentages
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const expensesPercentage = total > 0 ? (expenses / total) * 100 : 0;
  const balancePercentage = total > 0 ? (Math.abs(balance) / total) * 100 : 0;

  return (
    <View style={styles.pieChartContainer}>
      {/* Graphique Pie Chart */}
      <View style={styles.pieChartWrapper}>
        <PieChart
          widthAndHeight={120}
          series={series}
          sliceColor={sliceColors}
          coverRadius={0.6}
          coverFill={isDark ? '#1E293B' : '#F8FAFC'}
        />
        
        {/* Centre du pie chart avec le solde */}
        <View style={styles.pieChartCenter}>
          <Text style={[
            styles.pieCenterAmount, 
            isDark && styles.darkText,
            { color: balance >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            {formatAmount(Math.abs(balance))}
          </Text>
          <Text style={[styles.pieCenterLabel, isDark && styles.darkSubtext]}>
            {balance >= 0 ? 'Épargne' : 'Déficit'}
          </Text>
        </View>
      </View>
      
      {/* Légende */}
      <View style={styles.pieLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
          <View style={styles.legendTextContainer}>
            <Text style={[styles.legendLabel, isDark && styles.darkSubtext]}>Revenus</Text>
            <Text style={[styles.legendPercentage, isDark && styles.darkText]}>
              {incomePercentage.toFixed(1)}%
            </Text>
          </View>
          <Text style={[styles.legendAmount, isDark && styles.darkText]}>
            {formatAmount(income)}
          </Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
          <View style={styles.legendTextContainer}>
            <Text style={[styles.legendLabel, isDark && styles.darkSubtext]}>Dépenses</Text>
            <Text style={[styles.legendPercentage, isDark && styles.darkText]}>
              {expensesPercentage.toFixed(1)}%
            </Text>
          </View>
          <Text style={[styles.legendAmount, isDark && styles.darkText]}>
            {formatAmount(expenses)}
          </Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { 
            backgroundColor: balance >= 0 ? '#007AFF' : '#F59E0B' 
          }]} />
          <View style={styles.legendTextContainer}>
            <Text style={[styles.legendLabel, isDark && styles.darkSubtext]}>
              {balance >= 0 ? 'Épargne' : 'Déficit'}
            </Text>
            <Text style={[styles.legendPercentage, isDark && styles.darkText]}>
              {balancePercentage.toFixed(1)}%
            </Text>
          </View>
          <Text style={[styles.legendAmount, isDark && styles.darkText]}>
            {formatAmount(Math.abs(balance))}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ✅ COMPOSANT SANTÉ FINANCIÈRE (inchangé)
interface FinancialHealthCardProps {
  score: number;
  isDark: boolean;
  onPress: () => void;
}

const FinancialHealthCard: React.FC<FinancialHealthCardProps> = ({ score, isDark, onPress }) => {
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: 'Excellent', color: '#10B981', emoji: '🎉' };
    if (score >= 60) return { status: 'Bon', color: '#22C55E', emoji: '👍' };
    if (score >= 40) return { status: 'Moyen', color: '#F59E0B', emoji: '⚠️' };
    return { status: 'À améliorer', color: '#EF4444', emoji: '🚨' };
  };

  const health = getHealthStatus(score);

  return (
    <TouchableOpacity 
      style={[styles.fullWidthCard, isDark && styles.darkCard]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, isDark && styles.darkTitle]}>
          Santé Financière
        </Text>
        <Text style={styles.healthEmoji}>{health.emoji}</Text>
      </View>

      <View style={styles.healthContent}>
        <View style={styles.healthScore}>
          <Text style={[styles.healthScoreValue, { color: health.color }]}>
            {score}/100
          </Text>
          <Text style={[styles.healthScoreLabel, isDark && styles.darkSubtext]}>
            Score
          </Text>
        </View>

        <View style={styles.healthIndicators}>
          <Text style={[styles.healthStatus, { color: health.color }]}>
            {health.status}
          </Text>
          <View style={styles.healthProgress}>
            <View style={[styles.progressBackground, isDark && styles.darkProgressBackground]}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${score}%`,
                    backgroundColor: health.color
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      <Text style={[styles.healthAdvice, isDark && styles.darkSubtext]}>
        {score >= 80 
          ? 'Votre santé financière est excellente !' 
          : score >= 60 
          ? 'Vous êtes sur la bonne voie.'
          : 'Quelques ajustements pourraient aider.'
        }
      </Text>
    </TouchableOpacity>
  );
};

const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const { formatAmount } = useCurrency();
  const navigation = useNavigation();
  const isDark = theme === 'dark';
  
  // Hooks pour les données
  const { accounts, totalBalance, refreshAccounts } = useAccounts();
  const { analytics, refreshAnalytics } = useAnalytics();
  const { budgets, stats: budgetStats, refreshBudgets } = useBudgets();
  const { debts, stats: debtStats, refreshDebts } = useDebts();
  const { goals, stats: savingsStats, refreshGoals } = useSavings();
  const { transactions, refreshTransactions } = useTransactions();

  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ RECHARGEMENT SYNCHRONISÉ
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('🔄 Dashboard: Rechargement des données...');

    try {
      await Promise.all([
        refreshAccounts(),
        refreshAnalytics(),
        refreshBudgets(),
        refreshDebts(),
        refreshGoals(),
        refreshTransactions()
      ]);
      
      // Animation de succès
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
      
    } catch (error) {
      console.error('❌ Dashboard: Erreur rechargement', error);
    } finally {
      setRefreshing(false);
    }
  }, [
    refreshAccounts, 
    refreshAnalytics, 
    refreshBudgets, 
    refreshDebts, 
    refreshGoals, 
    refreshTransactions,
    fadeAnim
  ]);

  // ✅ HEADER MODERNE (inchangé)
  const ModernHeader = () => (
    <View style={[styles.header, isDark && styles.darkHeader]}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>💰</Text>
          </View>
          <View>
            <Text style={[styles.title, isDark && styles.darkTitle]}>
              MoneyManager
            </Text>
            <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>
              Tableau de Bord
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, isDark && styles.darkActionButton]}
            onPress={() => navigation.navigate('CurrencySettings' as never)}
          >
            <Text style={styles.actionIcon}>💱</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, isDark && styles.darkActionButton]}
            onPress={() => navigation.navigate('Alerts' as never)}
          >
            <Text style={styles.actionIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ✅ ACTIONS RAPIDES (inchangé)
  const QuickActionsGrid = () => {
    const quickActions = [
      { 
        id: 'transaction', 
        title: 'Transaction', 
        icon: '💸', 
        color: '#007AFF',
        screen: 'AddTransaction' as never
      },
      { 
        id: 'budget', 
        title: 'Budget', 
        icon: '📊', 
        color: '#10B981',
        screen: 'Budgets' as never
      },
      { 
        id: 'savings', 
        title: 'Épargne', 
        icon: '🎯', 
        color: '#F59E0B',
        screen: 'Savings' as never
      },
      { 
        id: 'debt', 
        title: 'Dette', 
        icon: '🏦', 
        color: '#EF4444',
        screen: 'Debts' as never
      },
      { 
        id: 'analytics', 
        title: 'Analyses', 
        icon: '📈', 
        color: '#06B6D4',
        screen: 'AnalyticsDashboard' as never
      },
      {
        id: 'months',
        title: 'Mois',
        icon: '📅',
        color: '#8B5CF6',
        screen: 'MonthsOverview' as never
      }
    ];

    return (
      <View style={[styles.quickActions, isDark && styles.darkQuickActions]}>
        <Text style={[styles.quickActionsTitle, isDark && styles.darkTitle]}>
          Actions Rapides
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContent}
        >
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickAction, { backgroundColor: action.color + '15' }]}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Text style={styles.quickActionIconText}>{action.icon}</Text>
              </View>
              <Text style={[styles.quickActionText, isDark && styles.darkText]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // ✅ CARTE PATRIMOINE NET (inchangé)
  const NetWorthCard = () => {
    const { netWorth } = analytics;
    const trend = netWorth.history.length >= 2 
      ? calculationService.calculateTrend(
          netWorth.history[netWorth.history.length - 1].netWorth,
          netWorth.history[netWorth.history.length - 2].netWorth
        )
      : { value: 0, isPositive: true };

    return (
      <TouchableOpacity 
        style={[styles.fullWidthCard, isDark && styles.darkCard]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Accounts' as never)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isDark && styles.darkTitle]}>
            Patrimoine Net
          </Text>
          <View style={[styles.trendBadge, { backgroundColor: trend.isPositive ? '#10B98120' : '#EF444420' }]}>
            <Text style={[styles.trendText, { color: trend.isPositive ? '#10B981' : '#EF4444' }]}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value).toFixed(1)}%
            </Text>
          </View>
        </View>
        
        <Text style={[styles.netWorthValue, { color: netWorth.netWorth >= 0 ? '#10B981' : '#EF4444' }]}>
          {formatAmount(netWorth.netWorth)}
        </Text>
        
        <View style={styles.netWorthBreakdown}>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.breakdownLabel, isDark && styles.darkSubtext]}>Actifs</Text>
            <Text style={[styles.breakdownValue, isDark && styles.darkText]}>
              {formatAmount(netWorth.totalAssets)}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.breakdownLabel, isDark && styles.darkSubtext]}>Passifs</Text>
            <Text style={[styles.breakdownValue, isDark && styles.darkText]}>
              {formatAmount(netWorth.totalLiabilities)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ✅ CARTE PIE CHART REVENUS/DÉPENSES/SOLDE
  const FinancialFlowChartCard = () => {
    const { cashFlow } = analytics;
    const balance = cashFlow.netFlow;

    return (
      <TouchableOpacity 
        style={[styles.fullWidthCard, isDark && styles.darkCard]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AnalyticsDashboard' as never)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isDark && styles.darkTitle]}>
            Flux Financiers
          </Text>
          <Text style={[styles.cardSubtitle, isDark && styles.darkSubtext]}>
            Ce mois
          </Text>
        </View>

        <FinancialPieChart 
          income={cashFlow.income}
          expenses={cashFlow.expenses}
          balance={balance}
          isDark={isDark}
          formatAmount={formatAmount}
        />
      </TouchableOpacity>
    );
  };

  // ✅ CARTE BUDGETS (inchangé)
  const BudgetOverviewCard = () => {
    const activeBudgets = budgets.filter(budget => budget.isActive).slice(0, 3);

    return (
      <TouchableOpacity 
        style={[styles.fullWidthCard, isDark && styles.darkCard]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Budgets' as never)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isDark && styles.darkTitle]}>
            Budgets
          </Text>
          <Text style={[styles.cardSubtitle, isDark && styles.darkSubtext]}>
            {budgetStats.activeBudgets} actifs
          </Text>
        </View>

        {activeBudgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100;
          const progressColor = percentage >= 90 ? '#EF4444' : percentage >= 75 ? '#F59E0B' : '#10B981';

          return (
            <View key={budget.id} style={styles.budgetItem}>
              <View style={styles.budgetHeader}>
                <Text style={[styles.budgetName, isDark && styles.darkText]} numberOfLines={1}>
                  {budget.name}
                </Text>
                <Text style={[styles.budgetAmount, isDark && styles.darkText]}>
                  {formatAmount(budget.spent)}/{formatAmount(budget.amount)}
                </Text>
              </View>
              
              <View style={styles.budgetProgress}>
                <View style={[styles.progressBackground, isDark && styles.darkProgressBackground]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: progressColor
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.budgetPercentage, { color: progressColor }]}>
                  {percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          );
        })}

        {activeBudgets.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
              Aucun budget actif
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('Budgets' as never)}
            >
              <Text style={styles.addButtonText}>Créer un budget</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ✅ CARTE ÉPARGNE (inchangé)
  const SavingsProgressCard = () => {
    const activeGoals = goals.filter(goal => !goal.isCompleted).slice(0, 3);

    return (
      <TouchableOpacity 
        style={[styles.fullWidthCard, isDark && styles.darkCard]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Savings' as never)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isDark && styles.darkTitle]}>
            Épargne
          </Text>
          <Text style={[styles.cardSubtitle, isDark && styles.darkSubtext]}>
            {savingsStats.totalGoals} objectifs
          </Text>
        </View>

        {activeGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;

          return (
            <View key={goal.id} style={styles.savingsItem}>
              <View style={styles.savingsHeader}>
                <Text style={[styles.savingsName, isDark && styles.darkText]} numberOfLines={1}>
                  {goal.name}
                </Text>
                <Text style={[styles.savingsAmount, isDark && styles.darkText]}>
                  {formatAmount(goal.currentAmount)}/{formatAmount(goal.targetAmount)}
                </Text>
              </View>
              
              <View style={styles.savingsProgress}>
                <View style={[styles.progressBackground, isDark && styles.darkProgressBackground]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: '#007AFF'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.savingsPercentage}>
                  {progress.toFixed(0)}%
                </Text>
              </View>
            </View>
          );
        })}

        {activeGoals.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
              Aucun objectif d'épargne
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('Savings' as never)}
            >
              <Text style={styles.addButtonText}>Créer un objectif</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ✅ CARTE DETTES (inchangé)
  const DebtsCard = () => {
    const activeDebts = debts.filter(debt => debt.status === 'active' || debt.status === 'overdue').slice(0, 3);

    return (
      <TouchableOpacity 
        style={[styles.fullWidthCard, isDark && styles.darkCard]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Debts' as never)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isDark && styles.darkTitle]}>
            Dettes
          </Text>
          <Text style={[styles.cardSubtitle, isDark && styles.darkSubtext]}>
            {debtStats.activeDebts} actives
          </Text>
        </View>

        {activeDebts.map((debt) => (
          <View key={debt.id} style={styles.debtItem}>
            <View style={styles.debtHeader}>
              <Text style={[styles.debtName, isDark && styles.darkText]} numberOfLines={1}>
                {debt.name}
              </Text>
              <Text style={[styles.debtAmount, isDark && styles.darkText]}>
                {formatAmount(debt.currentAmount)}
              </Text>
            </View>
            
            <View style={styles.debtDetails}>
              <Text style={[styles.debtDetail, isDark && styles.darkSubtext]}>
                {debt.creditor} • {debt.interestRate}%
              </Text>
              <Text style={[styles.debtMonthly, isDark && styles.darkSubtext]}>
                {formatAmount(debt.monthlyPayment)}/mois
              </Text>
            </View>
          </View>
        ))}

        {activeDebts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>
              Aucune dette active
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('Debts' as never)}
            >
              <Text style={styles.addButtonText}>Ajouter une dette</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <ModernHeader />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor={isDark ? '#fff' : '#007AFF'}
          />
        }
      >
        {/* Indicateur de rechargement */}
        <Animated.View style={[styles.refreshIndicator, { opacity: fadeAnim }]}>
          <Text style={styles.refreshText}>✓ Données mises à jour</Text>
        </Animated.View>

        <QuickActionsGrid />
        
        {/* SECTION APERÇU UNIQUE */}
        <View style={styles.section}>
          <NetWorthCard />
          <FinancialHealthCard 
            score={analytics.financialHealth} 
            isDark={isDark}
            onPress={() => navigation.navigate('AnalyticsDashboard' as never)}
          />
          <FinancialFlowChartCard />
          <BudgetOverviewCard />
          <SavingsProgressCard />
          <DebtsCard />
        </View>

        <View style={styles.spacer} />
      </ScrollView>
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
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  darkHeader: {
    backgroundColor: '#1E293B',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  darkTitle: {
    color: '#F1F5F9',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  darkSubtitle: {
    color: '#94A3B8',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  darkActionButton: {
    backgroundColor: '#334155',
  },
  actionIcon: {
    fontSize: 18,
  },
  quickActions: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  darkQuickActions: {
    backgroundColor: '#1E293B',
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  quickActionsContent: {
    paddingRight: 16,
  },
  quickAction: {
    width: 80,
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIconText: {
    fontSize: 18,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    gap: 16,
  },
  fullWidthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  darkCard: {
    backgroundColor: '#1E293B',
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
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
  netWorthBreakdown: {
    marginTop: 8,
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
    color: '#64748B',
    flex: 1,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  // ✅ STYLES POUR LE PIE CHART
  simpleChart: {
  position: 'relative',
  width: 120,
  height: 120,
  justifyContent: 'center',
  alignItems: 'center',
},
chartBars: {
  width: 120,
  height: 120,
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  paddingHorizontal: 8,
},
chartBar: {
  width: 20,
  borderRadius: 4,
  minHeight: 4,
},
chartCenter: {
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
},
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  pieChartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pieCenterLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  emptyPie: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPieText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  pieLegend: {
    flex: 1,
    marginLeft: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  legendPercentage: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
  },
  legendAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  // Styles pour la santé financière
  healthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthScore: {
    alignItems: 'center',
    marginRight: 20,
  },
  healthScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  healthScoreLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: -4,
  },
  healthIndicators: {
    flex: 1,
  },
  healthStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  healthProgress: {
    marginTop: 8,
  },
  healthEmoji: {
    fontSize: 24,
  },
  healthAdvice: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  darkProgressBackground: {
    backgroundColor: '#334155',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetItem: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  budgetName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  budgetProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetPercentage: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
  savingsItem: {
    marginBottom: 16,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  savingsName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  savingsAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  savingsProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    minWidth: 30,
    textAlign: 'right',
  },
  debtItem: {
    marginBottom: 16,
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  debtName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  debtAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  debtDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debtDetail: {
    fontSize: 12,
    color: '#64748B',
  },
  debtMonthly: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  refreshIndicator: {
    backgroundColor: '#10B981',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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

export default DashboardScreen;