// src/services/monthlyService.ts - VERSION CORRIGÉE
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

// ✅ CORRECTION : Fonction utilitaire séparée (pas de modificateur private dans un objet)
const getEmptyYearlySummary = (year: number): YearlySummary => {
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
};

export const monthlyService = {
  // ✅ CORRECTION : Fonction principale pour obtenir les stats mensuelles
  async getMonthlyStats(
    year: number, 
    month: number, 
    userId: string = 'default-user'
  ): Promise<MonthlyStats> {
    try {
      console.log(`📊 [monthlyService] Calcul stats pour ${month + 1}/${year}`);
      
      const transactions: Transaction[] = await transactionService.getAllTransactions(userId);
      
      // ✅ CORRECTION : Filtrage robuste des transactions
      const monthTransactions = transactions.filter(transaction => {
        try {
          const transactionDate = new Date(transaction.date);
          const transactionYear = transactionDate.getFullYear();
          const transactionMonth = transactionDate.getMonth();
          
          return transactionYear === year && transactionMonth === month;
        } catch (error) {
          console.warn(`⚠️ [monthlyService] Date invalide: ${transaction.date}`);
          return false;
        }
      });

      console.log(`📈 [monthlyService] ${monthTransactions.length} transactions trouvées`);

      // ✅ CORRECTION : Calculs financiers
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const netFlow = income - expenses;
      const savingsRate = income > 0 ? (netFlow / income) * 100 : 0;

      // ✅ CORRECTION : Analyse par catégorie améliorée
      const categoryMap = new Map<string, number>();
      
      monthTransactions
        .filter(t => t.type === 'expense')
        .forEach(transaction => {
          const category = transaction.category || 'Non catégorisé';
          const currentAmount = categoryMap.get(category) || 0;
          categoryMap.set(category, currentAmount + Math.abs(transaction.amount));
        });

      const totalExpenses = expenses;
      const topCategories = Array.from(categoryMap.entries())
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // ✅ CORRECTION : Calcul des moyennes quotidiennes
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dailyAverages = {
        income: daysInMonth > 0 ? income / daysInMonth : 0,
        expenses: daysInMonth > 0 ? expenses / daysInMonth : 0,
      };

      const result: MonthlyStats = {
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

      console.log(`✅ [monthlyService] Stats calculées:`, {
        income: result.income,
        expenses: result.expenses,
        netFlow: result.netFlow,
        transactions: result.transactionCount
      });

      return result;

    } catch (error) {
      console.error('❌ [monthlyService] Erreur calcul stats mensuelles:', error);
      
      // ✅ CORRECTION : Retourner des données par défaut en cas d'erreur
      return {
        year,
        month,
        income: 0,
        expenses: 0,
        netFlow: 0,
        savingsRate: 0,
        transactionCount: 0,
        topCategories: [],
        dailyAverages: { income: 0, expenses: 0 }
      };
    }
  },

  // ✅ CORRECTION : Résumé annuel optimisé
  async getYearlySummary(
    year: number, 
    userId: string = 'default-user'
  ): Promise<YearlySummary> {
    try {
      console.log(`📅 [monthlyService] Calcul résumé annuel pour ${year}`);
      
      const monthlyStats: MonthlyStats[] = [];
      
      // ✅ CORRECTION : Parallélisation des appels pour meilleures performances
      const monthPromises = Array.from({ length: 12 }, (_, month) => 
        this.getMonthlyStats(year, month, userId)
      );

      const results = await Promise.allSettled(monthPromises);
      
      results.forEach((result, month) => {
        if (result.status === 'fulfilled' && result.value.transactionCount > 0) {
          monthlyStats.push(result.value);
        } else {
          console.warn(`⚠️ [monthlyService] Mois ${month} sans données ou erreur`);
        }
      });

      if (monthlyStats.length === 0) {
        console.log(`ℹ️ [monthlyService] Aucune donnée pour ${year}`);
        return getEmptyYearlySummary(year); // ✅ CORRECTION : Utiliser la fonction externe
      }

      // ✅ CORRECTION : Calculs optimisés
      const totals = monthlyStats.reduce((acc, month) => ({
        totalIncome: acc.totalIncome + month.income,
        totalExpenses: acc.totalExpenses + month.expenses,
        totalNetFlow: acc.totalNetFlow + month.netFlow,
      }), { totalIncome: 0, totalExpenses: 0, totalNetFlow: 0 });

      const monthsWithIncome = monthlyStats.filter(month => month.income > 0);
      const averageSavingsRate = monthsWithIncome.length > 0 
        ? monthsWithIncome.reduce((sum, month) => sum + month.savingsRate, 0) / monthsWithIncome.length
        : 0;

      const bestMonth = monthlyStats.reduce((best, current) => 
        current.netFlow > best.netFlow ? current : best, monthlyStats[0]
      );
      const worstMonth = monthlyStats.reduce((worst, current) => 
        current.netFlow < worst.netFlow ? current : worst, monthlyStats[0]
      );

      const summary: YearlySummary = {
        year,
        totalIncome: totals.totalIncome,
        totalExpenses: totals.totalExpenses,
        totalNetFlow: totals.totalNetFlow,
        averageMonthlyIncome: totals.totalIncome / monthlyStats.length,
        averageMonthlyExpenses: totals.totalExpenses / monthlyStats.length,
        averageSavingsRate,
        bestMonth: { month: bestMonth.month, netFlow: bestMonth.netFlow },
        worstMonth: { month: worstMonth.month, netFlow: worstMonth.netFlow }
      };

      console.log(`✅ [monthlyService] Résumé annuel calculé:`, {
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        totalNetFlow: summary.totalNetFlow
      });

      return summary;

    } catch (error) {
      console.error('❌ [monthlyService] Erreur calcul résumé annuel:', error);
      return getEmptyYearlySummary(year); // ✅ CORRECTION : Utiliser la fonction externe
    }
  },

  // ✅ CORRECTION : Comparaison mensuelle améliorée
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
      console.log(`📈 [monthlyService] Comparaison pour ${month + 1}/${year}`);
      
      const current = await this.getMonthlyStats(year, month, userId);
      
      let previous: MonthlyStats | null = null;
      let yearOverYear: MonthlyStats | null = null;

      // ✅ CORRECTION : Calcul mois précédent
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      
      try {
        previous = await this.getMonthlyStats(prevYear, prevMonth, userId);
        if (previous.transactionCount === 0) {
          previous = null;
        }
      } catch (error) {
        console.warn('⚠️ [monthlyService] Données mois précédent non disponibles');
      }

      // ✅ CORRECTION : Calcul année précédente
      try {
        yearOverYear = await this.getMonthlyStats(year - 1, month, userId);
        if (yearOverYear.transactionCount === 0) {
          yearOverYear = null;
        }
      } catch (error) {
        console.warn('⚠️ [monthlyService] Données année précédente non disponibles');
      }

      // ✅ CORRECTION : Calcul des tendances sécurisé
      const trends = {
        income: previous && previous.income > 0 ? 
          ((current.income - previous.income) / previous.income) * 100 : 0,
        expenses: previous && previous.expenses > 0 ? 
          ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0,
        netFlow: previous && previous.netFlow !== 0 ? 
          ((current.netFlow - previous.netFlow) / Math.abs(previous.netFlow)) * 100 : 0,
      };

      console.log(`✅ [monthlyService] Comparaison calculée:`, trends);
      
      return {
        current,
        previous,
        yearOverYear,
        trends
      };
    } catch (error) {
      console.error('❌ [monthlyService] Erreur comparaison mensuelle:', error);
      
      // ✅ CORRECTION : Retour par défaut en cas d'erreur
      const current = await this.getMonthlyStats(year, month, userId);
      return {
        current,
        previous: null,
        yearOverYear: null,
        trends: { income: 0, expenses: 0, netFlow: 0 }
      };
    }
  },

  // ✅ CORRECTION : Récupération des années avec données
  async getAvailableYearsWithData(userId: string = 'default-user'): Promise<number[]> {
    try {
      console.log('📅 [monthlyService] Récupération années disponibles...');
      
      const transactions: Transaction[] = await transactionService.getAllTransactions(userId);
      const years = new Set<number>();
      
      transactions.forEach(transaction => {
        try {
          const year = new Date(transaction.date).getFullYear();
          years.add(year);
        } catch (error) {
          console.warn('❌ [monthlyService] Date invalide pour année:', transaction.date);
        }
      });

      // ✅ CORRECTION : Toujours inclure l'année courante et future
      const currentYear = new Date().getFullYear();
      years.add(currentYear);
      years.add(currentYear + 1); // Pour la planification

      const sortedYears = Array.from(years).sort((a, b) => b - a);
      
      console.log(`✅ [monthlyService] Années disponibles:`, sortedYears);
      return sortedYears;

    } catch (error) {
      console.error('❌ [monthlyService] Erreur récupération années:', error);
      
      // ✅ CORRECTION : Retour par défaut
      const currentYear = new Date().getFullYear();
      return [currentYear, currentYear + 1];
    }
  },

  // ✅ CORRECTION : Génération de rapport améliorée
  generateMonthlyReport(
    monthlyStats: MonthlyStats[], 
    year: number
  ): string {
    try {
      if (monthlyStats.length === 0) {
        return `Aucune donnée disponible pour ${year}`;
      }

      const yearlySummary = monthlyStats.reduce((acc, month) => ({
        totalIncome: acc.totalIncome + month.income,
        totalExpenses: acc.totalExpenses + month.expenses,
        totalNetFlow: acc.totalNetFlow + month.netFlow,
        totalTransactions: acc.totalTransactions + month.transactionCount,
      }), { totalIncome: 0, totalExpenses: 0, totalNetFlow: 0, totalTransactions: 0 });

      const bestMonth = monthlyStats.reduce((best, current) => 
        current.netFlow > best.netFlow ? current : best
      );
      const worstMonth = monthlyStats.reduce((worst, current) => 
        current.netFlow < worst.netFlow ? current : worst
      );

      const report = `
📊 RAPPORT FINANCIER ${year}
${'='.repeat(30)}

📈 PERFORMANCE GLOBALE
• Revenus totaux: ${yearlySummary.totalIncome.toFixed(2)}
• Dépenses totales: ${yearlySummary.totalExpenses.toFixed(2)}
• Solde net: ${yearlySummary.totalNetFlow.toFixed(2)}
• Transactions: ${yearlySummary.totalTransactions}

🏆 MEILLEUR MOIS
• ${new Date(year, bestMonth.month).toLocaleDateString('fr-FR', { month: 'long' })}: ${bestMonth.netFlow.toFixed(2)}

📉 MOIS LE PLUS DIFFICILE  
• ${new Date(year, worstMonth.month).toLocaleDateString('fr-FR', { month: 'long' })}: ${worstMonth.netFlow.toFixed(2)}

📅 DÉTAIL MENSUEL
${monthlyStats.map(month => 
  `• ${new Date(year, month.month).toLocaleDateString('fr-FR', { month: 'long' })}: ${month.netFlow >= 0 ? '✅' : '❌'} ${month.netFlow.toFixed(2)} (${month.transactionCount} transactions)`
).join('\n')}

💡 CONSEILS
${yearlySummary.totalNetFlow >= 0 ? 
  '✅ Excellente gestion financière ! Continuez ainsi.' : 
  '💡 Pensez à revoir vos dépenses pour équilibrer votre budget.'
}
      `.trim();

      return report;

    } catch (error) {
      console.error('❌ [monthlyService] Erreur génération rapport:', error);
      return `Erreur lors de la génération du rapport pour ${year}`;
    }
  },

  // ✅ NOUVEAU : Service de prédiction basique
  async getMonthlyForecast(
    year: number,
    month: number,
    userId: string = 'default-user'
  ): Promise<{
    predictedIncome: number;
    predictedExpenses: number;
    confidence: number;
    basedOnMonths: number;
  }> {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      
      // ✅ CORRECTION : Seulement pour les mois futurs
      if (year < currentYear || (year === currentYear && month <= currentMonth)) {
        return {
          predictedIncome: 0,
          predictedExpenses: 0,
          confidence: 0,
          basedOnMonths: 0
        };
      }

      // ✅ CORRECTION : Basé sur les 6 derniers mois
      const historicalData: MonthlyStats[] = [];
      for (let i = 1; i <= 6; i++) {
        const histMonth = currentMonth - i;
        const histYear = histMonth < 0 ? currentYear - 1 : currentYear;
        const adjustedMonth = histMonth < 0 ? histMonth + 12 : histMonth;
        
        try {
          const stats = await this.getMonthlyStats(histYear, adjustedMonth, userId);
          if (stats.transactionCount > 0) {
            historicalData.push(stats);
          }
        } catch (error) {
          console.warn(`⚠️ [monthlyService] Données historiques manquantes pour ${adjustedMonth + 1}/${histYear}`);
        }
      }

      if (historicalData.length === 0) {
        return {
          predictedIncome: 0,
          predictedExpenses: 0,
          confidence: 0,
          basedOnMonths: 0
        };
      }

      const avgIncome = historicalData.reduce((sum, month) => sum + month.income, 0) / historicalData.length;
      const avgExpenses = historicalData.reduce((sum, month) => sum + month.expenses, 0) / historicalData.length;

      return {
        predictedIncome: avgIncome,
        predictedExpenses: avgExpenses,
        confidence: Math.min(historicalData.length / 6 * 100, 80), // Max 80% de confiance
        basedOnMonths: historicalData.length
      };

    } catch (error) {
      console.error('❌ [monthlyService] Erreur prédiction:', error);
      return {
        predictedIncome: 0,
        predictedExpenses: 0,
        confidence: 0,
        basedOnMonths: 0
      };
    }
  }
};

export default monthlyService;