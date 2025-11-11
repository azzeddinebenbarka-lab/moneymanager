// src/services/analytics/advancedAnalyticsService.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { accountService } from '../accountService';
import { budgetService } from '../budgetService';
import { categoryService } from '../categoryService';
import { debtService } from '../debtService';
import { savingsService } from '../savingsService';
import { transactionService } from '../transactionService';

export interface CashFlowData {
  period: string;
  income: number;
  expenses: number;
  netFlow: number;
  savingsRate: number;
  transactionsCount: number;
}

export interface CashFlowResult {
  income: number;
  expenses: number;
  netFlow: number;
  savingsRate: number;
  transactionsCount: number;
}

export interface NetWorthData {
  period: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  growth: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  history: Array<{
    date: string;
    netWorth: number;
    assets: number;
    liabilities: number;
  }>;
}

export interface FinancialHealthData {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  indicators: {
    savingsRate: number;
    debtToIncome: number;
    emergencyFund: number;
    budgetAdherence: number;
    netWorthGrowth: number;
  };
  recommendations: string[];
}

export interface SpendingPattern {
  category: string;
  amount: number;
  percentage: number;
  trend: number;
  average: number;
}

export interface TrendAnalysis {
  period: string;
  value: number;
  trend: number;
  isPositive: boolean;
  confidence: number;
}

export interface ForecastData {
  period: string;
  projectedIncome: number;
  projectedExpenses: number;
  projectedSavings: number;
  confidence: number;
  assumptions: string[];
}

export interface FilteredAnalyticsData {
  period: string;
  income: number;
  expenses: number;
  netFlow: number;
  savingsRate: number;
  categoryBreakdown: Array<{
    name: string;
    amount: number;
    percentage: number;
    color: string;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
}

export class AdvancedAnalyticsService {
  private static instance: AdvancedAnalyticsService;

  static getInstance(): AdvancedAnalyticsService {
    if (!AdvancedAnalyticsService.instance) {
      AdvancedAnalyticsService.instance = new AdvancedAnalyticsService();
    }
    return AdvancedAnalyticsService.instance;
  }

  // ✅ ANALYSE DES FLUX DE TRÉSORERIE
  async analyzeCashFlow(
    startDate: string, 
    endDate: string, 
    userId: string = 'default-user'
  ): Promise<CashFlowResult> {
    try {
      console.log('📊 [AdvancedAnalytics] Analyse des flux de trésorerie...');

      const transactions = await transactionService.getTransactionsByDateRange(
        startDate, 
        endDate, 
        userId
      );

      // Filtrer les transactions de transfert et épargne
      const filteredTransactions = transactions.filter(transaction => 
        !['transfert', 'épargne', 'remboursement épargne'].includes(transaction.category || '')
      );

      const income = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const expenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const netFlow = income - expenses;
      const savingsRate = income > 0 ? (netFlow / income) * 100 : 0;

      const result: CashFlowResult = {
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        netFlow: Math.round(netFlow * 100) / 100,
        savingsRate: Math.round(savingsRate * 100) / 100,
        transactionsCount: filteredTransactions.length
      };

      console.log('✅ [AdvancedAnalytics] Analyse flux terminée:', result);
      return result;

    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur analyse flux:', error);
      throw error;
    }
  }

  // ✅ CALCUL DES TENDANCES DES FLUX
  calculateCashFlowTrend(currentData: CashFlowData, previousData?: CashFlowData): TrendAnalysis {
    try {
      if (!previousData) {
        return {
          period: currentData.period,
          value: currentData.netFlow,
          trend: 0,
          isPositive: currentData.netFlow >= 0,
          confidence: 0
        };
      }

      const trend = previousData.netFlow !== 0 
        ? ((currentData.netFlow - previousData.netFlow) / Math.abs(previousData.netFlow)) * 100
        : currentData.netFlow > 0 ? 100 : -100;

      const confidence = this.calculateConfidence([currentData, previousData]);

      return {
        period: currentData.period,
        value: currentData.netFlow,
        trend: Math.round(trend * 100) / 100,
        isPositive: trend >= 0,
        confidence: Math.round(confidence * 100) / 100
      };

    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur calcul tendance:', error);
      return {
        period: currentData.period,
        value: currentData.netFlow,
        trend: 0,
        isPositive: currentData.netFlow >= 0,
        confidence: 0
      };
    }
  }

  // ✅ ANALYSE DU PATRIMOINE NET
  async analyzeNetWorth(userId: string = 'default-user'): Promise<NetWorthResult> {
    try {
      console.log('💰 [AdvancedAnalytics] Analyse du patrimoine net...');

      const accounts = await accountService.getAllAccounts(userId);
      const debts = await debtService.getAllDebts(userId);
      const savingsGoals = await savingsService.getAllSavingsGoals(userId);

      // Actifs = comptes + épargne
      const totalAssets = accounts.reduce((sum, account) => sum + account.balance, 0) +
                         savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

      // Passifs = dettes actives
      const totalLiabilities = debts
        .filter(debt => debt.status === 'active' || debt.status === 'overdue')
        .reduce((sum, debt) => sum + debt.currentAmount, 0);

      const netWorth = totalAssets - totalLiabilities;

      // Historique simulé (dans une vraie implémentation, récupérer depuis la base)
      const history = await this.generateNetWorthHistory(userId);

      const result: NetWorthResult = {
        totalAssets: Math.round(totalAssets * 100) / 100,
        totalLiabilities: Math.round(totalLiabilities * 100) / 100,
        netWorth: Math.round(netWorth * 100) / 100,
        history
      };

      console.log('✅ [AdvancedAnalytics] Analyse patrimoine terminée:', result);
      return result;

    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur analyse patrimoine:', error);
      throw error;
    }
  }

  // ✅ SANTÉ FINANCIÈRE
  async analyzeFinancialHealth(userId: string = 'default-user'): Promise<FinancialHealthData> {
    try {
      console.log('❤️ [AdvancedAnalytics] Analyse santé financière...');

      const [cashFlow, netWorth, debts, budgets] = await Promise.all([
        this.analyzeCashFlow(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          new Date().toISOString().split('T')[0],
          userId
        ),
        this.analyzeNetWorth(userId),
        debtService.getAllDebts(userId),
        budgetService.getAllBudgets(userId)
      ]);

      // Calcul des indicateurs
      const savingsRate = cashFlow.savingsRate;
      
      const debtToIncome = cashFlow.income > 0 
        ? (debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0) / cashFlow.income) * 100
        : debts.length > 0 ? 100 : 0;

      const emergencyFund = await this.calculateEmergencyFundMonths(userId);
      
      const budgetAdherence = await this.calculateBudgetAdherence(userId);
      
      const netWorthGrowth = this.calculateNetWorthGrowth(netWorth.history);

      // Score composite
      const score = this.calculateHealthScore({
        savingsRate,
        debtToIncome,
        emergencyFund,
        budgetAdherence,
        netWorthGrowth
      });

      const status = this.getHealthStatus(score);
      const recommendations = this.generateRecommendations({
        savingsRate,
        debtToIncome,
        emergencyFund,
        budgetAdherence,
        netWorthGrowth
      });

      const result: FinancialHealthData = {
        score: Math.round(score * 100) / 100,
        status,
        indicators: {
          savingsRate: Math.round(savingsRate * 100) / 100,
          debtToIncome: Math.round(debtToIncome * 100) / 100,
          emergencyFund: Math.round(emergencyFund * 100) / 100,
          budgetAdherence: Math.round(budgetAdherence * 100) / 100,
          netWorthGrowth: Math.round(netWorthGrowth * 100) / 100
        },
        recommendations
      };

      console.log('✅ [AdvancedAnalytics] Analyse santé terminée:', result);
      return result;

    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur analyse santé:', error);
      throw error;
    }
  }

  // ✅ PATTERNS DE DÉPENSES
  async analyzeSpendingPatterns(
    months: number = 6, 
    userId: string = 'default-user'
  ): Promise<SpendingPattern[]> {
    try {
      console.log('📈 [AdvancedAnalytics] Analyse des patterns de dépenses...');

      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      const startDateStr = startDate.toISOString().split('T')[0];

      const transactions = await transactionService.getTransactionsByDateRange(
        startDateStr,
        endDate,
        userId
      );

      const expenseTransactions = transactions.filter(t => 
        t.type === 'expense' && 
        !['transfert', 'épargne', 'remboursement épargne'].includes(t.category || '')
      );

      // Regroupement par catégorie
      const categoryMap = new Map<string, number>();
      
      expenseTransactions.forEach(transaction => {
        const category = transaction.category || 'Non catégorisé';
        const amount = Math.abs(transaction.amount);
        categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
      });

      const totalExpenses = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);

      // Calcul des tendances par catégorie
      const patterns: SpendingPattern[] = Array.from(categoryMap.entries()).map(([category, amount]) => {
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        const trend = this.calculateCategoryTrend(category, expenseTransactions, months);
        const average = amount / months;

        return {
          category,
          amount: Math.round(amount * 100) / 100,
          percentage: Math.round(percentage * 100) / 100,
          trend: Math.round(trend * 100) / 100,
          average: Math.round(average * 100) / 100
        };
      });

      // Trier par montant décroissant
      return patterns.sort((a, b) => b.amount - a.amount);

    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur analyse patterns:', error);
      return [];
    }
  }

  // ✅ FORECASTING
  async generateFinancialForecast(
    months: number = 3,
    userId: string = 'default-user'
  ): Promise<ForecastData[]> {
    try {
      console.log('🔮 [AdvancedAnalytics] Génération forecast...');

      const historicalData = await this.getHistoricalData(6, userId);
      const forecasts: ForecastData[] = [];

      for (let i = 1; i <= months; i++) {
        const period = new Date();
        period.setMonth(period.getMonth() + i);
        const periodStr = period.toISOString().split('T')[0].substring(0, 7);

        const projectedIncome = this.forecastValue(
          historicalData.map(d => d.income),
          i
        );

        const projectedExpenses = this.forecastValue(
          historicalData.map(d => d.expenses),
          i
        );

        const projectedSavings = projectedIncome - projectedExpenses;
        const confidence = this.calculateForecastConfidence(historicalData, i);

        const forecast: ForecastData = {
          period: periodStr,
          projectedIncome: Math.round(projectedIncome * 100) / 100,
          projectedExpenses: Math.round(projectedExpenses * 100) / 100,
          projectedSavings: Math.round(projectedSavings * 100) / 100,
          confidence: Math.round(confidence * 100) / 100,
          assumptions: this.generateForecastAssumptions(projectedIncome, projectedExpenses)
        };

        forecasts.push(forecast);
      }

      return forecasts;

    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur forecasting:', error);
      return [];
    }
  }

  // ✅ ANALYSE AVEC FILTRES
  async analyzeWithFilters(filters: any, userId: string = 'default-user'): Promise<FilteredAnalyticsData> {
    try {
      console.log('🎯 [AdvancedAnalytics] Analyse avec filtres:', filters);

      // Obtenir les transactions filtrées
      const filteredTransactions = await this.getFilteredTransactions(filters, userId);
      const categories = await categoryService.getAllCategories(userId);

      // Calculer les données de base
      const income = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const expenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const netFlow = income - expenses;
      const savingsRate = income > 0 ? (netFlow / income) * 100 : 0;

      // Analyse par catégorie
      const categoryBreakdown = await this.analyzeCategoryBreakdown(filteredTransactions, categories);

      // Tendances mensuelles
      const monthlyTrend = await this.analyzeMonthlyTrend(filteredTransactions, filters);

      const result: FilteredAnalyticsData = {
        period: this.getPeriodLabel(filters),
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        netFlow: Math.round(netFlow * 100) / 100,
        savingsRate: Math.round(savingsRate * 100) / 100,
        categoryBreakdown,
        monthlyTrend
      };

      console.log('✅ [AdvancedAnalytics] Analyse filtrée terminée');
      return result;

    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur analyse filtrée:', error);
      throw error;
    }
  }

  // ✅ ANALYSE DES DONNÉES PAR CATÉGORIE
  async analyzeCategoryData(filters: any, userId: string = 'default-user'): Promise<any[]> {
    try {
      const filteredTransactions = await this.getFilteredTransactions(filters, userId);
      const categories = await categoryService.getAllCategories(userId);

      return this.analyzeCategoryBreakdown(filteredTransactions, categories);
    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur analyse catégorie:', error);
      return [];
    }
  }

  // ===== MÉTHODES PRIVÉES UTILITAIRES =====

  private async generateNetWorthHistory(userId: string): Promise<NetWorthResult['history']> {
    // Simulation d'historique - à remplacer par une vraie implémentation
    const history: NetWorthResult['history'] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      
      // Valeurs simulées basées sur la date
      const baseNetWorth = 10000 + (i * 500);
      
      history.push({
        date: date.toISOString().split('T')[0],
        netWorth: baseNetWorth,
        assets: baseNetWorth + 2000,
        liabilities: 2000
      });
    }

    return history;
  }

  private async calculateEmergencyFundMonths(userId: string): Promise<number> {
    try {
      const monthlyExpenses = await this.calculateMonthlyExpenses(userId);
      const savingsAccounts = await accountService.getAccountsByType('savings', userId);
      const totalSavings = savingsAccounts.reduce((sum, account) => sum + account.balance, 0);

      return monthlyExpenses > 0 ? totalSavings / monthlyExpenses : 0;
    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur calcul fonds urgence:', error);
      return 0;
    }
  }

  private async calculateMonthlyExpenses(userId: string): Promise<number> {
    try {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const expenses = await transactionService.getTotalExpenses(
        firstDay.toISOString().split('T')[0],
        lastDay.toISOString().split('T')[0],
        userId
      );

      return expenses;
    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur calcul dépenses mensuelles:', error);
      return 0;
    }
  }

  private async calculateBudgetAdherence(userId: string): Promise<number> {
    try {
      const budgets = await budgetService.getAllBudgets(userId);
      const activeBudgets = budgets.filter(budget => budget.isActive);

      if (activeBudgets.length === 0) return 100; // Pas de budget = 100% d'adhérence

      const totalAdherence = activeBudgets.reduce((sum, budget) => {
        const adherence = budget.amount > 0 ? Math.max(0, 100 - (budget.spent / budget.amount) * 100) : 100;
        return sum + adherence;
      }, 0);

      return totalAdherence / activeBudgets.length;
    } catch (error) {
      console.error('❌ [AdvancedAnalytics] Erreur calcul adhérence budget:', error);
      return 0;
    }
  }

  private calculateNetWorthGrowth(history: NetWorthResult['history']): number {
    if (history.length < 2) return 0;

    const first = history[0].netWorth;
    const last = history[history.length - 1].netWorth;

    return first > 0 ? ((last - first) / Math.abs(first)) * 100 : last > 0 ? 100 : 0;
  }

  private calculateHealthScore(indicators: {
    savingsRate: number;
    debtToIncome: number;
    emergencyFund: number;
    budgetAdherence: number;
    netWorthGrowth: number;
  }): number {
    const weights = {
      savingsRate: 0.25,
      debtToIncome: 0.25,
      emergencyFund: 0.20,
      budgetAdherence: 0.15,
      netWorthGrowth: 0.15
    };

    // Normalisation des scores (0-100)
    const savingsScore = Math.min(Math.max(indicators.savingsRate, 0), 30) * (100/30);
    const debtScore = Math.max(0, 100 - Math.min(indicators.debtToIncome, 100));
    const emergencyScore = Math.min(indicators.emergencyFund, 6) * (100/6);
    const budgetScore = indicators.budgetAdherence;
    const growthScore = Math.min(Math.max(indicators.netWorthGrowth, -50), 50) + 50;

    return (
      savingsScore * weights.savingsRate +
      debtScore * weights.debtToIncome +
      emergencyScore * weights.emergencyFund +
      budgetScore * weights.budgetAdherence +
      growthScore * weights.netWorthGrowth
    );
  }

  private getHealthStatus(score: number): FinancialHealthData['status'] {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'fair';
    if (score >= 30) return 'poor';
    return 'critical';
  }

  private generateRecommendations(indicators: {
    savingsRate: number;
    debtToIncome: number;
    emergencyFund: number;
    budgetAdherence: number;
    netWorthGrowth: number;
  }): string[] {
    const recommendations: string[] = [];

    if (indicators.savingsRate < 10) {
      recommendations.push("Augmentez votre taux d'épargne à au moins 10%");
    }

    if (indicators.debtToIncome > 40) {
      recommendations.push("Réduisez votre ratio dette/revenu en dessous de 40%");
    }

    if (indicators.emergencyFund < 3) {
      recommendations.push("Constituer un fonds d'urgence de 3 à 6 mois de dépenses");
    }

    if (indicators.budgetAdherence < 80) {
      recommendations.push("Améliorez l'adhérence à vos budgets définis");
    }

    if (indicators.netWorthGrowth < 5) {
      recommendations.push("Stimulez la croissance de votre patrimoine net");
    }

    if (recommendations.length === 0) {
      recommendations.push("Continuez sur cette bonne voie financière !");
    }

    return recommendations;
  }

  private calculateCategoryTrend(
    category: string, 
    transactions: any[], 
    months: number
  ): number {
    // Simplification - dans une vraie implémentation, analyser l'historique
    const recentTransactions = transactions.filter(t => 
      t.category === category && 
      new Date(t.date) > new Date(new Date().setMonth(new Date().getMonth() - 3))
    );

    const olderTransactions = transactions.filter(t => 
      t.category === category && 
      new Date(t.date) <= new Date(new Date().setMonth(new Date().getMonth() - 3))
    );

    const recentTotal = recentTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const olderTotal = olderTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return olderTotal > 0 ? ((recentTotal - olderTotal) / olderTotal) * 100 : recentTotal > 0 ? 100 : 0;
  }

  private calculateConfidence(data: any[]): number {
    if (data.length < 2) return 0;
    
    const values = data.map(d => d.netFlow);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    // Plus la variance est faible, plus la confiance est élevée
    return Math.max(0, 100 - (Math.sqrt(variance) / (Math.abs(mean) || 1)) * 100);
  }

  private async getHistoricalData(months: number, userId: string): Promise<CashFlowData[]> {
    const historicalData: CashFlowData[] = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      try {
        const cashFlow = await this.analyzeCashFlow(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
          userId
        );

        historicalData.push({
          period: startDate.toISOString().substring(0, 7),
          ...cashFlow
        });
      } catch (error) {
        console.warn(`⚠️ [AdvancedAnalytics] Données manquantes pour ${startDate.toISOString().substring(0, 7)}`);
      }
    }

    return historicalData;
  }

  private forecastValue(historicalValues: number[], periodsAhead: number): number {
    if (historicalValues.length === 0) return 0;
    if (historicalValues.length === 1) return historicalValues[0];

    // Moyenne mobile simple avec tendance
    const recentValues = historicalValues.slice(-3);
    const average = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
    
    // Ajouter une petite croissance basée sur la tendance récente
    const growth = historicalValues.length >= 2 
      ? (historicalValues[historicalValues.length - 1] - historicalValues[historicalValues.length - 2]) 
      : 0;

    return average + (growth * periodsAhead * 0.5);
  }

  private calculateForecastConfidence(historicalData: CashFlowData[], periodsAhead: number): number {
    if (historicalData.length < 3) return 50;

    const volatilities = historicalData.map((data, index) => {
      if (index === 0) return 0;
      const previous = historicalData[index - 1];
      return Math.abs((data.netFlow - previous.netFlow) / (previous.netFlow || 1));
    });

    const averageVolatility = volatilities.reduce((sum, vol) => sum + vol, 0) / volatilities.length;
    
    // Plus la volatilité est faible, plus la confiance est élevée
    return Math.max(30, 100 - (averageVolatility * 100 * periodsAhead));
  }

  private generateForecastAssumptions(income: number, expenses: number): string[] {
    const assumptions: string[] = [];

    if (income > expenses) {
      assumptions.push("Croissance des revenus maintenue");
      assumptions.push("Stabilité des dépenses essentielles");
    } else {
      assumptions.push("Attention: Dépenses supérieures aux revenus");
      assumptions.push("Révision des budgets recommandée");
    }

    if (expenses > income * 0.8) {
      assumptions.push("Ratio dépenses/revenus élevé");
    }

    return assumptions;
  }

  // ===== MÉTHODES POUR LE SUPPORT DES FILTRES =====

  private async getFilteredTransactions(filters: any, userId: string): Promise<any[]> {
    // Déterminer la plage de dates selon les filtres
    const dateRange = this.calculateDateRange(filters);
    let transactions = await transactionService.getTransactionsByDateRange(
      dateRange.start,
      dateRange.end,
      userId
    );

    // Appliquer les filtres supplémentaires
    if (filters.type && filters.type !== 'all') {
      transactions = transactions.filter(t => t.type === filters.type);
    }

    if (filters.category) {
      transactions = transactions.filter(t => t.category === filters.category);
    }

    return transactions;
  }

  private calculateDateRange(filters: any): { start: string; end: string } {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (filters.period) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        if (filters.month && filters.year) {
          start = new Date(filters.year, filters.month - 1, 1);
          end = new Date(filters.year, filters.month, 0);
        } else {
          start.setMonth(now.getMonth() - 1);
        }
        break;
      case 'year':
        if (filters.year) {
          start = new Date(filters.year, 0, 1);
          end = new Date(filters.year, 11, 31);
        } else {
          start.setFullYear(now.getFullYear() - 1);
        }
        break;
      case 'custom':
        if (filters.month && filters.year) {
          start = new Date(filters.year, filters.month - 1, 1);
          end = new Date(filters.year, filters.month, 0);
        } else if (filters.year) {
          start = new Date(filters.year, 0, 1);
          end = new Date(filters.year, 11, 31);
        } else {
          start.setMonth(now.getMonth() - 1);
        }
        break;
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  private async analyzeCategoryBreakdown(transactions: any[], categories: any[]): Promise<any[]> {
    const categoryTotals: { [key: string]: number } = {};
    let totalAmount = 0;

    transactions.forEach(transaction => {
      const amount = Math.abs(transaction.amount || 0);
      const categoryName = transaction.category || 'Non catégorisé';
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + amount;
      totalAmount += amount;
    });

    return Object.entries(categoryTotals)
      .map(([categoryName, amount]) => {
        const categoryInfo = categories.find(cat => cat.name === categoryName);
        return {
          name: categoryName,
          amount: Math.round(amount * 100) / 100,
          percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
          color: categoryInfo?.color || '#666666',
          count: transactions.filter(t => t.category === categoryName).length,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }

  private async analyzeMonthlyTrend(transactions: any[], filters: any): Promise<any[]> {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      const amount = Math.abs(transaction.amount || 0);
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += amount;
      } else {
        monthlyData[monthKey].expenses += amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: Math.round(data.income * 100) / 100,
        expenses: Math.round(data.expenses * 100) / 100,
        savings: Math.round((data.income - data.expenses) * 100) / 100,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private getPeriodLabel(filters: any): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    switch (filters.period) {
      case 'week':
        return '7 derniers jours';
      case 'month':
        if (filters.month && filters.year) {
          return `${months[filters.month - 1]} ${filters.year}`;
        }
        return '30 derniers jours';
      case 'year':
        if (filters.year) {
          return `Année ${filters.year}`;
        }
        return '12 derniers mois';
      case 'custom':
        if (filters.month && filters.year) {
          return `${months[filters.month - 1]} ${filters.year}`;
        }
        if (filters.year) {
          return `Année ${filters.year}`;
        }
        return 'Période personnalisée';
      default:
        return 'Période non spécifiée';
    }
  }
}

export default AdvancedAnalyticsService.getInstance();