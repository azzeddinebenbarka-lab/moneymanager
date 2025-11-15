// src/services/calculationService.ts - VERSION COMPLÈTEMENT CORRIGÉE
import { Account, Debt, SavingsGoal, Transaction } from '../types';
import { accountService } from './accountService';
import { annualChargeService } from './annualChargeService';
import { debtService } from './debtService';
import { savingsService } from './savingsService';
import { transactionService } from './transactionService';

export interface CalculationFilters {
  year?: number;
  month?: number;
  accountId?: string;
}

export interface CashFlowResult {
  income: number;
  expenses: number;
  netFlow: number;
  savingsRate: number;
}

export interface RealBalanceResult {
  accountsBalance: number;
  totalDebts: number;
  monthlyCharges: number;
  totalSavings: number;
  monthlyRecurring: number;
  realBalance: number;
  availableBalance: number;
  mainAccountBalance: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  history: { date: string; netWorth: number }[];
}

export interface RecentActivity {
  id: string;
  type: 'transaction' | 'annual_charge' | 'debt' | 'savings';
  transactionType?: 'income' | 'expense'; // ✅ CORRIGÉ : seulement income/expense
  description: string;
  amount: number;
  date: string;
  category?: string;
  accountId?: string;
  creditor?: string;
  paymentAccountId?: string;
  autoPay?: boolean;
  progress?: number;
  savingsAccountId?: string;
  contributionAccountId?: string;
  autoDeduct?: boolean;
}

export const calculationService = {
  async calculateNetWorth(userId: string = 'default-user'): Promise<NetWorthResult> {
    try {
      const accounts: Account[] = await accountService.getAllAccounts();
      const debts: Debt[] = await debtService.getAllDebts(userId);
      const savingsGoals: SavingsGoal[] = await savingsService.getAllSavingsGoals(userId);

      const totalAssets = accounts.reduce((sum: number, acc: Account) => sum + acc.balance, 0);
      
      const totalLiabilities = debts
        .filter((debt: Debt) => debt.status === 'active' || debt.status === 'overdue')
        .reduce((sum: number, debt: Debt) => sum + debt.currentAmount, 0);

      const netWorth = totalAssets - totalLiabilities;

      console.log('💰 [calculationService] Patrimoine calculé CORRECTEMENT:', {
        totalAssets,
        totalLiabilities,
        netWorth,
        accountsCount: accounts.length,
        debtsCount: debts.length,
        savingsGoalsCount: savingsGoals.length
      });

      return { 
        totalAssets, 
        totalLiabilities, 
        netWorth, 
        history: [] 
      };
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul patrimoine:', error);
      return { 
        totalAssets: 0, 
        totalLiabilities: 0, 
        netWorth: 0, 
        history: []
      };
    }
  },

  async calculateCashFlow(
    userId: string, 
    filters: CalculationFilters = {},
    period: 'month' | 'quarter' | 'year' = 'month'
  ): Promise<CashFlowResult> {
    try {
      const { year, month, accountId } = filters;
      const now = new Date();
      
      let startDate: Date;
      let endDate: Date;

      if (year && month) {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
      } else {
        startDate = this.getStartDate(period, now);
        endDate = now;
      }

      const allTransactions: Transaction[] = await transactionService.getAllTransactions(userId);
      
      const periodTransactions = allTransactions.filter((t: Transaction) => {
        const transactionDate = new Date(t.date);
        const matchesDate = transactionDate >= startDate && transactionDate <= endDate;
        const matchesAccount = !accountId || t.accountId === accountId;
        
        const isTransfer = t.category === 'transfert';
        const isSavingsRelated = [
          'épargne',
          'remboursement épargne', 
          'annulation épargne',
          'savings',
          'savings_refund',
          'savings_cancel'
        ].includes(t.category || '');
        
        return matchesDate && matchesAccount && !isTransfer && !isSavingsRelated;
      });

      const income = periodTransactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);
        
      const expenses = periodTransactions
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);
      
      const netFlow = income - expenses;
      const savingsRate = income > 0 ? (netFlow / income) * 100 : 0;
      
      console.log('💰 [calculationService] Flux financiers CORRECTS:', {
        income,
        expenses,
        netFlow,
        savingsRate,
        periode: period,
        filters,
        transactionsCount: periodTransactions.length,
        excludedCategories: ['transfert', 'épargne', 'remboursement épargne', 'annulation épargne']
      });
      
      return { income, expenses, netFlow, savingsRate };
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul flux:', error);
      return { income: 0, expenses: 0, netFlow: 0, savingsRate: 0 };
    }
  },

  async calculateRealBalance(
    userId: string = 'default-user',
    filters: CalculationFilters = {}
  ): Promise<RealBalanceResult> {
    try {
      const accounts: Account[] = await accountService.getAllAccounts();
      const debts: Debt[] = await debtService.getAllDebts(userId);
      const savingsGoals: SavingsGoal[] = await savingsService.getAllSavingsGoals(userId);
      const charges = await annualChargeService.getAllAnnualCharges(userId);

      const { accountId } = filters;

      const accountsBalance = accountId 
        ? accounts.find((acc: Account) => acc.id === accountId)?.balance || 0
        : accounts.reduce((sum: number, acc: Account) => sum + acc.balance, 0);

      const mainAccount = accounts.length > 0 
        ? accounts.reduce((prev: Account, current: Account) => 
            (prev.balance > current.balance) ? prev : current
          )
        : null;

      const totalDebts = debts
        .filter((debt: Debt) => debt.status === 'active' || debt.status === 'overdue')
        .reduce((sum: number, debt: Debt) => sum + debt.currentAmount, 0);
      
      const totalSavings = savingsGoals.reduce((sum: number, goal: SavingsGoal) => sum + goal.currentAmount, 0);

      const monthlyCharges = charges
        .filter((charge: any) => !charge.isPaid)
        .reduce((sum: number, charge: any) => {
          let monthlyAmount = 0;
          switch (charge.recurrence) {
            case 'monthly':
              monthlyAmount = charge.amount;
              break;
            case 'quarterly':
              monthlyAmount = charge.amount / 3;
              break;
            case 'yearly':
              monthlyAmount = charge.amount / 12;
              break;
            default:
              monthlyAmount = charge.amount / 12;
          }
          return sum + monthlyAmount;
        }, 0);

      const realBalance = accountsBalance - totalDebts;
      const availableBalance = Math.max(0, realBalance - monthlyCharges);

      console.log('💰 [calculationService] Solde réel calculé:', {
        accountsBalance,
        totalDebts,
        monthlyCharges,
        totalSavings,
        realBalance,
        availableBalance,
        mainAccountBalance: mainAccount?.balance || 0
      });

      return {
        accountsBalance,
        totalDebts,
        monthlyCharges,
        totalSavings,
        monthlyRecurring: 0,
        realBalance,
        availableBalance,
        mainAccountBalance: mainAccount?.balance || 0
      };
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul solde réel:', error);
      return {
        accountsBalance: 0,
        totalDebts: 0,
        monthlyCharges: 0,
        totalSavings: 0,
        monthlyRecurring: 0,
        realBalance: 0,
        availableBalance: 0,
        mainAccountBalance: 0
      };
    }
  },

  async getMonthlyDebts(userId: string = 'default-user'): Promise<number> {
    try {
      const debts: Debt[] = await debtService.getAllDebts(userId);
      return debts
        .filter((debt: Debt) => debt.status === 'active' || debt.status === 'overdue')
        .reduce((sum: number, debt: Debt) => sum + (debt.monthlyPayment || 0), 0);
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul dettes mensuelles:', error);
      return 0;
    }
  },

  async getAnnualChargesTotal(userId: string = 'default-user'): Promise<number> {
    try {
      const charges = await annualChargeService.getAllAnnualCharges(userId);
      return charges
        .filter((charge: any) => !charge.isPaid)
        .reduce((sum: number, charge: any) => sum + charge.amount, 0);
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul charges annuelles:', error);
      return 0;
    }
  },

  async getRecentActivities(
    userId: string = 'default-user', 
    limit: number = 10,
    filters: CalculationFilters = {}
  ): Promise<RecentActivity[]> {
    try {
      const [
        transactions,
        charges,
        debts,
        savingsGoals
      ] = await Promise.all([
        transactionService.getAllTransactions(userId),
        annualChargeService.getAllAnnualCharges(userId),
        debtService.getAllDebts(userId),
        savingsService.getAllSavingsGoals(userId)
      ]);

      const { year, month, accountId } = filters;
      const allActivities: RecentActivity[] = [];

      const filteredTransactions = transactions.filter((transaction: Transaction) => {
        if (year && month) {
          const transactionDate = new Date(transaction.date);
          const matchesYear = transactionDate.getFullYear() === year;
          const matchesMonth = transactionDate.getMonth() + 1 === month;
          const matchesAccount = !accountId || transaction.accountId === accountId;
          return matchesYear && matchesMonth && matchesAccount;
        }
        return true;
      });

      filteredTransactions.slice(0, limit).forEach((transaction: Transaction) => {
        // ✅ CORRECTION : Convertir 'transfer' en 'expense' pour RecentActivity
        const transactionType: 'income' | 'expense' = 
          transaction.type === 'transfer' ? 'expense' : transaction.type;
        
        allActivities.push({
          id: transaction.id,
          type: 'transaction',
          transactionType: transactionType,
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.date,
          category: transaction.category,
          accountId: transaction.accountId
        });
      });

      const next30Days = new Date();
      next30Days.setDate(next30Days.getDate() + 30);
      
      charges
        .filter((charge: any) => !charge.isPaid && new Date(charge.dueDate) <= next30Days)
        .slice(0, 3)
        .forEach((charge: any) => {
          allActivities.push({
            id: charge.id,
            type: 'annual_charge',
            description: `[Charge annuelle] ${charge.name}`,
            amount: charge.amount,
            date: charge.dueDate,
            category: charge.category,
            accountId: charge.accountId,
            autoDeduct: charge.autoDeduct
          });
        });

      debts
        .filter((debt: Debt) => debt.status === 'active' || debt.status === 'overdue')
        .slice(0, 3)
        .forEach((debt: Debt) => {
          allActivities.push({
            id: debt.id,
            type: 'debt',
            description: `[Dette] ${debt.name}`,
            amount: debt.monthlyPayment,
            date: debt.dueDate,
            creditor: debt.creditor,
            paymentAccountId: debt.paymentAccountId,
            autoPay: debt.autoPay
          });
        });

      savingsGoals
        .filter((goal: SavingsGoal) => !goal.isCompleted)
        .slice(0, 3)
        .forEach((goal: SavingsGoal) => {
          allActivities.push({
            id: goal.id,
            type: 'savings',
            description: `[Épargne] ${goal.name}`,
            amount: goal.monthlyContribution,
            date: goal.targetDate,
            progress: goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0,
            savingsAccountId: goal.savingsAccountId,
            contributionAccountId: goal.contributionAccountId
          });
        });

      const sortedActivities = allActivities
        .sort((a: RecentActivity, b: RecentActivity) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);

      console.log(`✅ [calculationService] ${sortedActivities.length} activités récentes récupérées`);

      return sortedActivities;
    } catch (error) {
      console.error('❌ [calculationService] Erreur récupération activités:', error);
      return [];
    }
  },

  getStartDate(period: 'month' | 'quarter' | 'year', endDate: Date): Date {
    const startDate = new Date(endDate);
    
    switch (period) {
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
    
    return startDate;
  },

  calculateTrend(current: number, previous: number): { value: number; isPositive: boolean } {
    if (previous === 0) return { value: 0, isPositive: true };
    
    const trendValue = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(trendValue),
      isPositive: trendValue >= 0
    };
  },

  getAvailableYears(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  },

  getAvailableMonths(): { value: number; label: string }[] {
    return [
      { value: 1, label: 'Janvier' },
      { value: 2, label: 'Février' },
      { value: 3, label: 'Mars' },
      { value: 4, label: 'Avril' },
      { value: 5, label: 'Mai' },
      { value: 6, label: 'Juin' },
      { value: 7, label: 'Juillet' },
      { value: 8, label: 'Août' },
      { value: 9, label: 'Septembre' },
      { value: 10, label: 'Octobre' },
      { value: 11, label: 'Novembre' },
      { value: 12, label: 'Décembre' }
    ];
  },

  async calculateFinancialHealth(userId: string = 'default-user'): Promise<number> {
    try {
      const netWorth = await this.calculateNetWorth(userId);
      const cashFlow = await this.calculateCashFlow(userId);
      const realBalance = await this.calculateRealBalance(userId);
      const monthlyDebts = await this.getMonthlyDebts(userId);

      let score = 100;

      if (netWorth.netWorth < 0) score -= 30;
      if (cashFlow.netFlow < 0) score -= 20;
      if (monthlyDebts > cashFlow.income * 0.4) score -= 15;
      if (realBalance.availableBalance < 0) score -= 15;
      if (cashFlow.savingsRate < 10) score -= 10;

      if (cashFlow.savingsRate > 20) score += 10;
      if (netWorth.netWorth > 0) score += 10;

      return Math.max(0, Math.min(100, Math.round(score)));
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul santé financière:', error);
      return 50;
    }
  },

  async calculateBudgetPerformance(userId: string = 'default-user'): Promise<{
    totalBudget: number;
    totalSpent: number;
    utilizationRate: number;
    overBudgetCount: number;
  }> {
    try {
      return {
        totalBudget: 0,
        totalSpent: 0,
        utilizationRate: 0,
        overBudgetCount: 0
      };
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul performance budget:', error);
      return {
        totalBudget: 0,
        totalSpent: 0,
        utilizationRate: 0,
        overBudgetCount: 0
      };
    }
  },

  async calculateSavingsProgress(userId: string = 'default-user'): Promise<number> {
    try {
      const savingsGoals = await savingsService.getAllSavingsGoals(userId);
      if (savingsGoals.length === 0) return 0;

      const totalTarget = savingsGoals.reduce((sum: number, goal: SavingsGoal) => sum + goal.targetAmount, 0);
      const totalCurrent = savingsGoals.reduce((sum: number, goal: SavingsGoal) => sum + goal.currentAmount, 0);

      return totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul progression épargne:', error);
      return 0;
    }
  },

  async calculateDebtProgress(userId: string = 'default-user'): Promise<number> {
    try {
      const debts = await debtService.getAllDebts(userId);
      if (debts.length === 0) return 100;

      const totalInitial = debts.reduce((sum: number, debt: Debt) => sum + debt.initialAmount, 0);
      const totalCurrent = debts.reduce((sum: number, debt: Debt) => sum + debt.currentAmount, 0);

      return totalInitial > 0 ? ((totalInitial - totalCurrent) / totalInitial) * 100 : 100;
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul progression dettes:', error);
      return 0;
    }
  },

  async getComprehensiveStats(userId: string = 'default-user'): Promise<{
    netWorth: NetWorthResult;
    cashFlow: CashFlowResult;
    realBalance: RealBalanceResult;
    financialHealth: number;
    savingsProgress: number;
    debtProgress: number;
    monthlyDebts: number;
    annualCharges: number;
  }> {
    try {
      const [
        netWorth,
        cashFlow,
        realBalance,
        financialHealth,
        savingsProgress,
        debtProgress,
        monthlyDebts,
        annualCharges
      ] = await Promise.all([
        this.calculateNetWorth(userId),
        this.calculateCashFlow(userId),
        this.calculateRealBalance(userId),
        this.calculateFinancialHealth(userId),
        this.calculateSavingsProgress(userId),
        this.calculateDebtProgress(userId),
        this.getMonthlyDebts(userId),
        this.getAnnualChargesTotal(userId)
      ]);

      return {
        netWorth,
        cashFlow,
        realBalance,
        financialHealth,
        savingsProgress,
        debtProgress,
        monthlyDebts,
        annualCharges
      };
    } catch (error) {
      console.error('❌ [calculationService] Erreur calcul stats complètes:', error);
      return {
        netWorth: { totalAssets: 0, totalLiabilities: 0, netWorth: 0, history: [] },
        cashFlow: { income: 0, expenses: 0, netFlow: 0, savingsRate: 0 },
        realBalance: {
          accountsBalance: 0,
          totalDebts: 0,
          monthlyCharges: 0,
          totalSavings: 0,
          monthlyRecurring: 0,
          realBalance: 0,
          availableBalance: 0,
          mainAccountBalance: 0
        },
        financialHealth: 50,
        savingsProgress: 0,
        debtProgress: 0,
        monthlyDebts: 0,
        annualCharges: 0
      };
    }
  }
};