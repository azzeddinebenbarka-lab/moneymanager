// src/services/reportService.ts
import { accountService } from './accountService';
import { budgetService } from './budgetService';
import { categoryService } from './categoryService';
import { transactionService } from './transactionService';

// Types pour le service de rapports
export interface ReportPeriod {
  label: string;
  startDate: string;
  endDate: string;
}

export interface CashFlowReport {
  period: ReportPeriod;
  openingBalance: number;
  closingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  savingsRate: number;
  categories: CategoryReport[];
  topExpenses: any[];
  topIncomes: any[];
  transactionsCount: number;
  averageTransaction: number;
}

export interface CategoryReport {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
  averageAmount: number;
}

export interface MonthlySummary {
  month: string;
  label: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  transactionsCount: number;
  averageIncome: number;
  averageExpense: number;
}

export interface SpendingAnalysis {
  categoryId: string;
  categoryName: string;
  currentAmount: number;
  previousAmount: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
  comparison: number;
}

export interface BudgetPerformance {
  budget: any;
  spent: number;
  remaining: number;
  percentageUsed: number;
  dailyAverage: number;
  projectedEnd: number;
  status: 'under' | 'over' | 'on_track';
  daysRemaining: number;
}

export interface FinancialHealth {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  indicators: FinancialHealthIndicators;
  recommendations: string[];
}

export interface FinancialHealthIndicators {
  savingsRate: FinancialHealthIndicator;
  expenseRatio: FinancialHealthIndicator;
  debtRatio: FinancialHealthIndicator;
  emergencyFund: FinancialHealthIndicator;
}

export interface FinancialHealthIndicator {
  value: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    colors: string[];
  }[];
}

export interface PieChartData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

// Utilitaires pour les dates
const DateUtils = {
  getStartOfMonth: (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1),
  getEndOfMonth: (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0),
  getStartOfWeek: (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  },
  getEndOfWeek: (date: Date): Date => {
    const start = DateUtils.getStartOfWeek(new Date(date));
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  },
  formatMonth: (date: Date): string => date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
  formatShortMonth: (date: Date): string => date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
  addMonths: (date: Date, months: number): Date => new Date(date.getFullYear(), date.getMonth() + months, date.getDate()),
};

export const reportService = {
  generateCashFlowReport: async (period: ReportPeriod): Promise<CashFlowReport> => {
    try {
      console.log('💰 [reportService] Generating cash flow report for period:', period.label);
      
      const allTransactions = await transactionService.getAllTransactions();
      const categories = await categoryService.getAllCategories();

      const periodTransactions = allTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      const incomeTransactions = periodTransactions.filter(t => t.type === 'income');
      const expenseTransactions = periodTransactions.filter(t => t.type === 'expense');
      
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const netCashFlow = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0;

      const categoryReports = await reportService.analyzeSpendingByCategory(period);

      const topExpenses = [...expenseTransactions]
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        .slice(0, 5);

      const topIncomes = [...incomeTransactions]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      const openingBalance = await reportService.calculateOpeningBalance(period.startDate);
      const closingBalance = openingBalance + netCashFlow;

      const report: CashFlowReport = {
        period,
        openingBalance,
        closingBalance,
        totalIncome,
        totalExpenses,
        netCashFlow,
        savingsRate: Math.round(savingsRate * 100) / 100,
        categories: categoryReports,
        topExpenses,
        topIncomes,
        transactionsCount: periodTransactions.length,
        averageTransaction: periodTransactions.length > 0 
          ? (totalIncome + totalExpenses) / periodTransactions.length 
          : 0,
      };

      console.log('✅ [reportService] Cash flow report generated successfully');
      return report;

    } catch (error) {
      console.error('❌ [reportService] Error generating cash flow report:', error);
      throw error;
    }
  },

  analyzeSpendingByCategory: async (period: ReportPeriod): Promise<CategoryReport[]> => {
    try {
      const allTransactions = await transactionService.getAllTransactions();
      const categories = await categoryService.getAllCategories();

      const periodTransactions = allTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      const categoryMap = new Map<string, CategoryReport>();

      categories.forEach(category => {
        categoryMap.set(category.id, {
          categoryId: category.id,
          categoryName: category.name,
          categoryColor: category.color,
          categoryIcon: category.icon,
          totalAmount: 0,
          percentage: 0,
          transactionCount: 0,
          averageAmount: 0,
        });
      });

      periodTransactions.forEach(transaction => {
        const existing = categoryMap.get(transaction.category);
        if (existing) {
          const amount = transaction.type === 'expense' ? Math.abs(transaction.amount) : transaction.amount;
          existing.totalAmount += amount;
          existing.transactionCount += 1;
        }
      });

      const totalAmount = Array.from(categoryMap.values())
        .reduce((sum, cat) => sum + cat.totalAmount, 0);

      const categoryReports = Array.from(categoryMap.values())
        .filter(cat => cat.totalAmount > 0)
        .map(cat => ({
          ...cat,
          percentage: totalAmount > 0 ? (cat.totalAmount / totalAmount) * 100 : 0,
          averageAmount: cat.transactionCount > 0 ? cat.totalAmount / cat.transactionCount : 0,
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount);

      return categoryReports;

    } catch (error) {
      console.error('❌ [reportService] Error analyzing spending by category:', error);
      throw error;
    }
  },

  getMonthlySummaries: async (months: number = 6): Promise<MonthlySummary[]> => {
    try {
      console.log('📊 [reportService] Generating monthly summaries for', months, 'months');
      
      const allTransactions = await transactionService.getAllTransactions();
      const summaries: MonthlySummary[] = [];

      const today = new Date();
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const startDate = DateUtils.getStartOfMonth(date);
        const endDate = DateUtils.getEndOfMonth(date);
        
        const monthTransactions = allTransactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate && transactionDate <= endDate;
        });

        const income = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const savings = income - expenses;
        const savingsRate = income > 0 ? (savings / income) * 100 : 0;

        summaries.push({
          month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
          label: DateUtils.formatShortMonth(date),
          income,
          expenses,
          savings,
          savingsRate: Math.round(savingsRate * 100) / 100,
          transactionsCount: monthTransactions.length,
          averageIncome: monthTransactions.filter(t => t.type === 'income').length > 0 
            ? income / monthTransactions.filter(t => t.type === 'income').length 
            : 0,
          averageExpense: monthTransactions.filter(t => t.type === 'expense').length > 0 
            ? expenses / monthTransactions.filter(t => t.type === 'expense').length 
            : 0,
        });
      }

      console.log('✅ [reportService] Monthly summaries generated successfully');
      return summaries;

    } catch (error) {
      console.error('❌ [reportService] Error generating monthly summaries:', error);
      throw error;
    }
  },

  getSpendingTrends: async (): Promise<SpendingAnalysis[]> => {
    try {
      const categories = await categoryService.getAllCategories();
      const allTransactions = await transactionService.getAllTransactions();
      
      const today = new Date();
      const currentPeriodStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const previousPeriodStart = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      const previousPeriodEnd = new Date(today.getFullYear(), today.getMonth() - 1, 0);

      const trends: SpendingAnalysis[] = [];

      for (const category of categories) {
        const currentTransactions = allTransactions.filter(t => 
          t.category === category.id && 
          new Date(t.date) >= currentPeriodStart
        );

        const previousTransactions = allTransactions.filter(t => 
          t.category === category.id && 
          new Date(t.date) >= previousPeriodStart && 
          new Date(t.date) <= previousPeriodEnd
        );

        const currentAmount = currentTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const previousAmount = previousTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const change = currentAmount - previousAmount;
        const percentageChange = previousAmount > 0 ? (change / previousAmount) * 100 : 0;

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (Math.abs(percentageChange) > 10) {
          trend = percentageChange > 0 ? 'up' : 'down';
        }

        trends.push({
          categoryId: category.id,
          categoryName: category.name,
          currentAmount,
          previousAmount,
          percentageChange: Math.round(percentageChange * 100) / 100,
          trend,
          comparison: change,
        });
      }

      return trends.filter(t => t.currentAmount > 0 || t.previousAmount > 0);

    } catch (error) {
      console.error('❌ [reportService] Error analyzing spending trends:', error);
      throw error;
    }
  },

  getBudgetPerformance: async (): Promise<BudgetPerformance[]> => {
    try {
      if (!budgetService || typeof budgetService.getAllBudgets !== 'function') {
        console.warn('⚠️ [reportService] Budget service not available, returning empty array');
        return [];
      }

      const budgets = await budgetService.getAllBudgets();
      const allTransactions = await transactionService.getAllTransactions();
      
      const performance: BudgetPerformance[] = [];

      for (const budget of budgets) {
        if (!budget.isActive) continue;

        const budgetTransactions = allTransactions.filter(t => 
          t.category === budget.category && 
          t.type === 'expense' &&
          new Date(t.date) >= new Date(budget.startDate) &&
          (budget.endDate ? new Date(t.date) <= new Date(budget.endDate) : true)
        );

        const spent = budgetTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const remaining = budget.amount - spent;
        const percentageUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        const startDate = new Date(budget.startDate);
        const today = new Date();
        const daysPassed = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const dailyAverage = spent / daysPassed;

        const projectedEnd = dailyAverage > 0 ? budget.amount / dailyAverage : 0;

        let status: 'under' | 'over' | 'on_track' = 'on_track';
        if (percentageUsed > 100) status = 'over';
        else if (percentageUsed < 75) status = 'under';

        performance.push({
          budget,
          spent,
          remaining,
          percentageUsed: Math.round(percentageUsed * 100) / 100,
          dailyAverage: Math.round(dailyAverage * 100) / 100,
          projectedEnd: Math.round(projectedEnd),
          status,
          daysRemaining: budget.endDate 
            ? Math.floor((new Date(budget.endDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            : 30,
        });
      }

      return performance;

    } catch (error) {
      console.error('❌ [reportService] Error analyzing budget performance:', error);
      throw error;
    }
  },

  getBarChartData: async (period: ReportPeriod): Promise<ChartData> => {
    try {
      const report = await reportService.generateCashFlowReport(period);
      
      return {
        labels: report.categories.slice(0, 8).map(cat => cat.categoryName),
        datasets: [
          {
            data: report.categories.slice(0, 8).map(cat => cat.totalAmount),
            colors: report.categories.slice(0, 8).map(cat => cat.categoryColor),
          },
        ],
      };
    } catch (error) {
      console.error('❌ [reportService] Error generating bar chart data:', error);
      throw error;
    }
  },

  getPieChartData: async (period: ReportPeriod): Promise<PieChartData[]> => {
    try {
      const report = await reportService.generateCashFlowReport(period);
      
      return report.categories
        .filter(cat => cat.totalAmount > 0)
        .slice(0, 6)
        .map(cat => ({
          name: cat.categoryName,
          amount: cat.totalAmount,
          percentage: cat.percentage,
          color: cat.categoryColor,
        }));
    } catch (error) {
      console.error('❌ [reportService] Error generating pie chart data:', error);
      throw error;
    }
  },

  getFinancialHealth: async (): Promise<FinancialHealth> => {
    try {
      const accounts = await accountService.getAllAccounts();
      const allTransactions = await transactionService.getAllTransactions();
      
      const today = new Date();
      const monthStart = DateUtils.getStartOfMonth(today);
      
      const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      
      const monthlyIncome = allTransactions
        .filter(t => t.type === 'income' && new Date(t.date) >= monthStart)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = allTransactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= monthStart)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const savingsRateValue = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
      const expenseRatioValue = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;
      
      let score = 50;
      
      if (savingsRateValue > 20) score += 20;
      else if (savingsRateValue > 10) score += 10;
      else if (savingsRateValue > 0) score += 5;
      
      if (accounts.length >= 3) score += 10;
      else if (accounts.length >= 2) score += 5;

      let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
      if (score >= 80) status = 'excellent';
      else if (score >= 70) status = 'good';
      else if (score >= 60) status = 'fair';
      else if (score >= 40) status = 'poor';
      else status = 'critical';

      const getIndicatorStatus = (value: number, thresholds: { excellent: number; good: number; fair: number }): FinancialHealthIndicator['status'] => {
        if (value >= thresholds.excellent) return 'excellent';
        if (value >= thresholds.good) return 'good';
        if (value >= thresholds.fair) return 'fair';
        return 'poor';
      };

      const indicators: FinancialHealthIndicators = {
        savingsRate: {
          value: Math.round(savingsRateValue * 100) / 100,
          status: getIndicatorStatus(savingsRateValue, { excellent: 20, good: 10, fair: 5 })
        },
        expenseRatio: {
          value: Math.round(expenseRatioValue * 100) / 100,
          status: getIndicatorStatus(100 - expenseRatioValue, { excellent: 80, good: 70, fair: 60 })
        },
        debtRatio: {
          value: 0,
          status: 'excellent'
        },
        emergencyFund: {
          value: 0,
          status: 'excellent'
        }
      };

      const recommendations: string[] = [];
      if (savingsRateValue < 10) recommendations.push("Essayez d'épargner au moins 10% de vos revenus");
      if (accounts.length < 2) recommendations.push("Diversifiez vos comptes pour mieux gérer vos finances");
      if (monthlyExpenses > monthlyIncome) recommendations.push("Réduisez vos dépenses pour équilibrer votre budget");

      const financialHealth: FinancialHealth = {
        score: Math.min(100, Math.max(0, score)),
        status,
        indicators,
        recommendations,
      };

      return financialHealth;

    } catch (error) {
      console.error('❌ [reportService] Error calculating financial health:', error);
      throw error;
    }
  },

  calculateOpeningBalance: async (startDate: string): Promise<number> => {
    try {
      const allTransactions = await transactionService.getAllTransactions();
      const openingTransactions = allTransactions.filter(t => 
        new Date(t.date) < new Date(startDate)
      );

      return openingTransactions.reduce((balance, transaction) => {
        if (transaction.type === 'income') return balance + transaction.amount;
        if (transaction.type === 'expense') return balance - Math.abs(transaction.amount);
        return balance;
      }, 0);

    } catch (error) {
      console.error('❌ [reportService] Error calculating opening balance:', error);
      return 0;
    }
  },

  getPredefinedPeriods: (): ReportPeriod[] => {
    const today = new Date();
    
    return [
      {
        label: "Aujourd'hui",
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      {
        label: 'Cette semaine',
        startDate: DateUtils.getStartOfWeek(today).toISOString().split('T')[0],
        endDate: DateUtils.getEndOfWeek(today).toISOString().split('T')[0]
      },
      {
        label: 'Ce mois',
        startDate: DateUtils.getStartOfMonth(today).toISOString().split('T')[0],
        endDate: DateUtils.getEndOfMonth(today).toISOString().split('T')[0]
      },
      {
        label: 'Mois dernier',
        startDate: DateUtils.addMonths(DateUtils.getStartOfMonth(today), -1).toISOString().split('T')[0],
        endDate: DateUtils.addMonths(DateUtils.getEndOfMonth(today), -1).toISOString().split('T')[0]
      },
      {
        label: 'Cette année',
        startDate: new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0],
        endDate: new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0]
      },
    ];
  },

  generateComprehensiveReport: async (period: ReportPeriod): Promise<any> => {
    try {
      console.log('📋 [reportService] Generating comprehensive report...');

      const [
        cashFlowReport,
        monthlySummaries,
        spendingTrends,
        budgetPerformance,
        financialHealth,
        barChartData,
        pieChartData
      ] = await Promise.all([
        reportService.generateCashFlowReport(period),
        reportService.getMonthlySummaries(6),
        reportService.getSpendingTrends(),
        reportService.getBudgetPerformance(),
        reportService.getFinancialHealth(),
        reportService.getBarChartData(period),
        reportService.getPieChartData(period)
      ]);

      return {
        metadata: {
          generatedAt: new Date().toISOString(),
          period: period.label,
          reportVersion: '1.0'
        },
        cashFlowReport,
        monthlySummaries,
        spendingTrends,
        budgetPerformance,
        financialHealth,
        charts: {
          bar: barChartData,
          pie: pieChartData
        },
        insights: await reportService.generateInsights(
          cashFlowReport, 
          spendingTrends, 
          budgetPerformance, 
          financialHealth
        )
      };
    } catch (error) {
      console.error('❌ [reportService] Error generating comprehensive report:', error);
      throw error;
    }
  },

  generateInsights: async (
    cashFlowReport: CashFlowReport,
    spendingTrends: SpendingAnalysis[],
    budgetPerformance: BudgetPerformance[],
    financialHealth: FinancialHealth
  ): Promise<string[]> => {
    const insights: string[] = [];

    if (cashFlowReport.netCashFlow > 0) {
      insights.push(`Excédent de ${cashFlowReport.netCashFlow.toFixed(2)}€ ce mois-ci`);
    } else if (cashFlowReport.netCashFlow < 0) {
      insights.push(`Déficit de ${Math.abs(cashFlowReport.netCashFlow).toFixed(2)}€ à combler`);
    }

    const increasingTrends = spendingTrends.filter(t => t.trend === 'up' && t.percentageChange > 20);
    if (increasingTrends.length > 0) {
      insights.push(`Augmentation notable dans: ${increasingTrends.map(t => t.categoryName).join(', ')}`);
    }

    const exceededBudgets = budgetPerformance.filter(bp => bp.status === 'over');
    if (exceededBudgets.length > 0) {
      insights.push(`${exceededBudgets.length} budget(s) dépassé(s)`);
    }

    if (financialHealth.score >= 80) {
      insights.push('Excellente santé financière !');
    } else if (financialHealth.score < 60) {
      insights.push('Amélioration possible de votre santé financière');
    }

    if (cashFlowReport.savingsRate > 20) {
      insights.push('Taux d\'épargne excellent !');
    } else if (cashFlowReport.savingsRate < 10) {
      insights.push('Pensez à augmenter votre taux d\'épargne');
    }

    return insights;
  }
};