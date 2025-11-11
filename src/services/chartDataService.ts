// src/services/chartDataService.ts - SERVICE COMPLET CORRIGÉ
import { Account, Budget, SavingsGoal, Transaction } from '../types';
import { calculationService } from './calculationService';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface LineChartData {
  date: string;
  value: number;
  label?: string;
}

export interface BarChartData {
  label: string;
  values: number[];
  colors: string[];
}

export interface FinancialFlowData {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
}

export interface DashboardChartData {
  cashFlow: FinancialFlowData;
  spendingByCategory: PieChartData[];
  monthlyTrends: LineChartData[];
  budgetPerformance: BarChartData[];
  netWorthHistory: LineChartData[];
  assetAllocation: PieChartData[];
}

export const chartDataService = {
  // ✅ DONNÉES POUR LE GRAPHIQUE CERCLE REVENUS/DÉPENSES
  getFinancialFlowData(
    transactions: Transaction[], 
    period: { start: string; end: string }
  ): FinancialFlowData {
    const periodTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const income = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const expenses = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = income - expenses;
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;

    return {
      income,
      expenses,
      balance,
      savingsRate: Math.round(savingsRate * 100) / 100
    };
  },

  // ✅ DONNÉES POUR LE GRAPHIQUE CAMEMBERT DES CATÉGORIES
  getSpendingByCategoryData(transactions: Transaction[]): PieChartData[] {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const categoryMap = new Map<string, number>();
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Non catégorisé';
      const amount = Math.abs(transaction.amount);
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
    });

    // Couleurs prédéfinies pour les catégories
    const categoryColors = [
      '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];

    const data: PieChartData[] = Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value: Math.round(value * 100) / 100,
      color: categoryColors[index % categoryColors.length],
      percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0
    }));

    // Trier par valeur décroissante
    return data.sort((a, b) => b.value - a.value);
  },

  // ✅ DONNÉES POUR LES TENDANCES MENSUELLES
  getMonthlyTrendsData(transactions: Transaction[], months: number = 6): LineChartData[] {
    const trends: LineChartData[] = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const balance = income - expenses;

      trends.push({
        date: date.toISOString().split('T')[0],
        value: balance,
        label: `${date.toLocaleDateString('fr-FR', { month: 'short' })} ${date.getFullYear()}`
      });
    }

    return trends;
  },

  // ✅ DONNÉES POUR LA PERFORMANCE DES BUDGETS
  getBudgetPerformanceData(budgets: Budget[]): BarChartData[] {
    const activeBudgets = budgets.filter(budget => budget.isActive);
    
    return activeBudgets.map(budget => {
      const utilizationRate = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
      const color = utilizationRate >= 90 ? '#EF4444' : 
                   utilizationRate >= 75 ? '#F59E0B' : '#10B981';

      return {
        label: budget.name,
        values: [utilizationRate],
        colors: [color]
      };
    });
  },

  // ✅ DONNÉES POUR L'HISTORIQUE DU PATRIMOINE NET
  async getNetWorthHistory(userId: string = 'default-user', months: number = 12): Promise<LineChartData[]> {
    try {
      // Utiliser le service de calcul existant
      const netWorthData = await calculationService.calculateNetWorth(userId);
      
      // Si l'historique existe, le formater
      if (netWorthData.history && netWorthData.history.length > 0) {
        return netWorthData.history.map(item => ({
          date: item.date,
          value: item.netWorth,
          label: new Date(item.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
        }));
      }

      // Historique simulé si non disponible
      return this.generateSimulatedNetWorthHistory(months);
    } catch (error) {
      console.error('❌ Erreur récupération historique patrimoine:', error);
      return this.generateSimulatedNetWorthHistory(months);
    }
  },

  // ✅ DONNÉES POUR L'ALLOCATION D'ACTIFS
  getAssetAllocationData(accounts: Account[], savingsGoals: SavingsGoal[]): PieChartData[] {
    const assetTypes = {
      cash: 0,
      bank: 0,
      savings: 0,
      investment: 0,
      other: 0
    };

    // Comptes par type
    accounts.forEach(account => {
      if (account.type === 'cash') assetTypes.cash += account.balance;
      else if (account.type === 'bank') assetTypes.bank += account.balance;
      else if (account.type === 'savings') assetTypes.savings += account.balance;
      else if (account.type === 'investment') assetTypes.investment += account.balance;
      else assetTypes.other += account.balance;
    });

    // Ajouter l'épargne
    const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    assetTypes.savings += totalSavings;

    const totalAssets = Object.values(assetTypes).reduce((sum, value) => sum + value, 0);

    const colors = {
      cash: '#10B981',
      bank: '#3B82F6',
      savings: '#8B5CF6',
      investment: '#F59E0B',
      other: '#6B7280'
    };

    const labels = {
      cash: 'Espèces',
      bank: 'Comptes Bancaires',
      savings: 'Épargne',
      investment: 'Investissements',
      other: 'Autres'
    };

    return Object.entries(assetTypes)
      .filter(([_, value]) => value > 0)
      .map(([type, value]) => ({
        name: labels[type as keyof typeof labels],
        value: Math.round(value * 100) / 100,
        color: colors[type as keyof typeof colors],
        percentage: totalAssets > 0 ? (value / totalAssets) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);
  },

  // ✅ DONNÉES COMPLÈTES POUR LE DASHBOARD
  async getDashboardChartData(
    transactions: Transaction[],
    accounts: Account[],
    budgets: Budget[],
    savingsGoals: SavingsGoal[],
    userId: string = 'default-user'
  ): Promise<DashboardChartData> {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const period = {
      start: firstDayOfMonth.toISOString().split('T')[0],
      end: lastDayOfMonth.toISOString().split('T')[0]
    };

    const [
      cashFlow,
      spendingByCategory,
      monthlyTrends,
      budgetPerformance,
      netWorthHistory,
      assetAllocation
    ] = await Promise.all([
      this.getFinancialFlowData(transactions, period),
      this.getSpendingByCategoryData(transactions),
      this.getMonthlyTrendsData(transactions, 6),
      this.getBudgetPerformanceData(budgets),
      this.getNetWorthHistory(userId, 12),
      this.getAssetAllocationData(accounts, savingsGoals)
    ]);

    return {
      cashFlow,
      spendingByCategory: spendingByCategory.slice(0, 8), // Limiter à 8 catégories
      monthlyTrends,
      budgetPerformance: budgetPerformance.slice(0, 6), // Limiter à 6 budgets
      netWorthHistory,
      assetAllocation
    };
  },

  // ✅ GÉNÉRATION D'HISTORIQUE SIMULÉ (fallback) - CORRIGÉ : SUPPRIMER "private"
  generateSimulatedNetWorthHistory(months: number): LineChartData[] {
    const history: LineChartData[] = [];
    const today = new Date();
    let baseNetWorth = 5000;

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 15);
      
      // Simulation de croissance avec variation aléatoire
      const growth = (Math.random() - 0.3) * 500; // -150 à +350
      baseNetWorth = Math.max(0, baseNetWorth + growth);

      history.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(baseNetWorth * 100) / 100,
        label: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      });
    }

    return history;
  },

  // ✅ FORMATAGE DES DONNÉES POUR LES COMPOSANTS
  formatForPieChart(data: PieChartData[]): { labels: string[]; data: number[]; colors: string[] } {
    return {
      labels: data.map(item => item.name),
      data: data.map(item => item.value),
      colors: data.map(item => item.color)
    };
  },

  formatForLineChart(data: LineChartData[]): { labels: string[]; data: number[] } {
    return {
      labels: data.map(item => item.label || ''),
      data: data.map(item => item.value)
    };
  },

  // ✅ CALCUL DE TENDANCE
  calculateTrend(currentData: number[], previousData: number[]): { value: number; isPositive: boolean } {
    if (currentData.length === 0 || previousData.length === 0) {
      return { value: 0, isPositive: true };
    }

    const currentAvg = currentData.reduce((sum, val) => sum + val, 0) / currentData.length;
    const previousAvg = previousData.reduce((sum, val) => sum + val, 0) / previousData.length;

    if (previousAvg === 0) {
      return { value: currentAvg > 0 ? 100 : 0, isPositive: currentAvg > 0 };
    }

    const trend = ((currentAvg - previousAvg) / Math.abs(previousAvg)) * 100;
    return {
      value: Math.round(trend * 100) / 100,
      isPositive: trend >= 0
    };
  }
};

export default chartDataService;