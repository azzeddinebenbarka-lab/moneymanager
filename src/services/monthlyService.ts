// src/services/monthlyService.ts - NOUVEAU SERVICE
import { Transaction } from '../types';
import { transactionService } from './transactionService';

export interface MonthlyStats {
  year: number;
  month: number;
  income: number;
  expenses: number;
  netFlow: number;
  savingsRate: number;
  transactionCount: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  dailyAverages: {
    income: number;
    expenses: number;
  };
}

export interface YearlySummary {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  totalNetFlow: number;
  averageMonthlyIncome: number;
  averageMonthlyExpenses: number;
  averageSavingsRate: number;
  bestMonth: { month: number; netFlow: number };
  worstMonth: { month: number; netFlow: number };
}

export const monthlyService = {
  async getMonthlyStats(
    year: number, 
    month: number, 
    userId: string = 'default-user'
  ): Promise<MonthlyStats> {
    try {
      const transactions: Transaction[] = await transactionService.getAllTransactions(userId);
      
      const monthTransactions = transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getFullYear() === year && date.getMonth() === month;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const netFlow = income - expenses;
      const savingsRate = income > 0 ? (netFlow / income) * 100 : 0;

      // Analyse par catégorie
      const categoryMap = new Map();
      monthTransactions
        .filter(t => t.type === 'expense')
        .forEach(transaction => {
          const category = transaction.category || 'Non catégorisé';
          const current = categoryMap.get(category) || 0;
          categoryMap.set(category, current + Math.abs(transaction.amount));
        });

      const topCategories = Array.from(categoryMap.entries())
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: expenses > 0 ? (amount / expenses) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // Calcul des moyennes quotidiennes
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dailyAverages = {
        income: daysInMonth > 0 ? income / daysInMonth : 0,
        expenses: daysInMonth > 0 ? expenses / daysInMonth : 0,
      };

      return {
        year,
        month,
        income,
        expenses,
        netFlow,
        savingsRate,
        transactionCount: monthTransactions.length,
        topCategories,
        dailyAverages
      };
    } catch (error) {
      console.error('❌ [monthlyService] Erreur calcul stats mensuelles:', error);
      throw error;
    }
  },

  async getYearlySummary(
    year: number, 
    userId: string = 'default-user'
  ): Promise<YearlySummary> {
    try {
      const monthlyStats: MonthlyStats[] = [];
      
      for (let month = 0; month < 12; month++) {
        try {
          const stats = await this.getMonthlyStats(year, month, userId);
          if (stats.transactionCount > 0) {
            monthlyStats.push(stats);
          }
        } catch (error) {
          console.warn(`⚠️ [monthlyService] Erreur mois ${month}:`, error);
        }
      }

      if (monthlyStats.length === 0) {
        return {
          year,
          totalIncome: 0,
          totalExpenses: 0,
          totalNetFlow: 0,
          averageMonthlyIncome: 0,
          averageMonthlyExpenses: 0,
          averageSavingsRate: 0,
          bestMonth: { month: 0, netFlow: 0 },
          worstMonth: { month: 0, netFlow: 0 }
        };
      }

      const totalIncome = monthlyStats.reduce((sum, month) => sum + month.income, 0);
      const totalExpenses = monthlyStats.reduce((sum, month) => sum + month.expenses, 0);
      const totalNetFlow = monthlyStats.reduce((sum, month) => sum + month.netFlow, 0);

      const monthsWithIncome = monthlyStats.filter(month => month.income > 0);
      const averageSavingsRate = monthsWithIncome.length > 0 
        ? monthsWithIncome.reduce((sum, month) => sum + month.savingsRate, 0) / monthsWithIncome.length
        : 0;

      const bestMonth = monthlyStats.reduce((best, current) => 
        current.netFlow > best.netFlow ? current : best
      );
      const worstMonth = monthlyStats.reduce((worst, current) => 
        current.netFlow < worst.netFlow ? current : worst
      );

      return {
        year,
        totalIncome,
        totalExpenses,
        totalNetFlow,
        averageMonthlyIncome: totalIncome / monthlyStats.length,
        averageMonthlyExpenses: totalExpenses / monthlyStats.length,
        averageSavingsRate,
        bestMonth: { month: bestMonth.month, netFlow: bestMonth.netFlow },
        worstMonth: { month: worstMonth.month, netFlow: worstMonth.netFlow }
      };
    } catch (error) {
      console.error('❌ [monthlyService] Erreur calcul résumé annuel:', error);
      throw error;
    }
  },

  async getMonthlyComparison(
    year: number,
    month: number,
    userId: string = 'default-user'
  ): Promise<{
    current: MonthlyStats;
    previous: MonthlyStats | null;
    yearOverYear: MonthlyStats | null;
    trends: {
      income: number;
      expenses: number;
      netFlow: number;
    };
  }> {
    try {
      const current = await this.getMonthlyStats(year, month, userId);
      
      let previous: MonthlyStats | null = null;
      let yearOverYear: MonthlyStats | null = null;

      // Mois précédent
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      
      try {
        previous = await this.getMonthlyStats(prevYear, prevMonth, userId);
      } catch (error) {
        console.warn('⚠️ [monthlyService] Données mois précédent non disponibles');
      }

      // Même mois année précédente
      try {
        yearOverYear = await this.getMonthlyStats(year - 1, month, userId);
      } catch (error) {
        console.warn('⚠️ [monthlyService] Données année précédente non disponibles');
      }

      const trends = {
        income: previous ? ((current.income - previous.income) / previous.income) * 100 : 0,
        expenses: previous ? ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0,
        netFlow: previous ? ((current.netFlow - previous.netFlow) / Math.abs(previous.netFlow)) * 100 : 0,
      };

      return {
        current,
        previous,
        yearOverYear,
        trends
      };
    } catch (error) {
      console.error('❌ [monthlyService] Erreur comparaison mensuelle:', error);
      throw error;
    }
  },

  async getAvailableYearsWithData(userId: string = 'default-user'): Promise<number[]> {
    try {
      const transactions: Transaction[] = await transactionService.getAllTransactions(userId);
      const years = new Set<number>();
      
      transactions.forEach(transaction => {
        const year = new Date(transaction.date).getFullYear();
        years.add(year);
      });

      // Ajouter l'année courante si aucune donnée
      const currentYear = new Date().getFullYear();
      if (years.size === 0) {
        years.add(currentYear);
      }

      return Array.from(years).sort((a, b) => b - a);
    } catch (error) {
      console.error('❌ [monthlyService] Erreur récupération années:', error);
      return [new Date().getFullYear()];
    }
  },

  generateMonthlyReport(
    monthlyStats: MonthlyStats[], 
    year: number
  ): string {
    const yearlySummary = monthlyStats.reduce((acc, month) => ({
      totalIncome: acc.totalIncome + month.income,
      totalExpenses: acc.totalExpenses + month.expenses,
      totalNetFlow: acc.totalNetFlow + month.netFlow,
    }), { totalIncome: 0, totalExpenses: 0, totalNetFlow: 0 });

    return `
RAPPORT FINANCIER ${year}
========================

Revenus totaux: ${yearlySummary.totalIncome.toFixed(2)}
Dépenses totales: ${yearlySummary.totalExpenses.toFixed(2)}
Solde net: ${yearlySummary.totalNetFlow.toFixed(2)}

Détail par mois:
${monthlyStats.map(month => 
  `- ${new Date(year, month.month).toLocaleDateString('fr-FR', { month: 'long' })}: ${month.netFlow.toFixed(2)}`
).join('\n')}
    `.trim();
  }
};

export default monthlyService;