// src/hooks/useDashboard.ts - VERSION COMPLÈTEMENT CORRIGÉE ET OPTIMISÉE
import { useCallback, useEffect, useRef, useState } from 'react';
import { chartDataService, DashboardChartData } from '../services/chartDataService';
import { DashboardStats, Transaction } from '../types';
import { useAccounts } from './useAccounts';
import { useAnnualCharges } from './useAnnualCharges';
import { useDebts } from './useDebts';
import { useRecurringTransactions } from './useRecurringTransactions';
import { useSavings } from './useSavings';
import { useTransactions } from './useTransactions';

export interface DashboardFilters {
  year: number;
  month: number;
  accountId?: string;
}

export interface ExtendedStats {
  cumulativeSavings: number;
  mainAccountBalance: number;
  monthlyDebts: number;
  annualCharges: number;
  financialHealth: number;
}

export interface UseDashboardReturn {
  // État principal
  stats: DashboardStats;
  extendedStats: ExtendedStats;
  chartData: DashboardChartData | null;
  filters: DashboardFilters;
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshDashboard: () => Promise<void>;
  updateFilters: (newFilters: Partial<DashboardFilters>) => void;
  recalculateStats: () => Promise<void>;
  clearError: () => void;
  
  // Données brutes
  accounts: any[];
  transactions: Transaction[];
  recurringTransactions: any[];
  charges: any[];
  debts: any[];
  goals: any[];
}

export const useDashboard = (userId: string = 'default-user'): UseDashboardReturn => {
  // Hooks de données
  const { accounts, refreshAccounts, loading: accountsLoading } = useAccounts();
  const { transactions, refreshTransactions, loading: transactionsLoading } = useTransactions();
  const { recurringTransactions, refreshRecurringTransactions, loading: recurringLoading } = useRecurringTransactions();
  const { charges, refreshAnnualCharges, loading: chargesLoading } = useAnnualCharges();
  const { debts, refreshDebts, loading: debtsLoading } = useDebts();
  const { goals, refreshGoals, loading: savingsLoading } = useSavings();
  
  // État local
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netFlow: 0,
    accountsCount: 0,
    transactionsCount: 0,
    recentTransactions: [],
    netWorth: 0,
    budgetPerformance: {
      totalBudget: 0,
      totalSpent: 0,
      utilizationRate: 0,
      overBudgetCount: 0,
    },
    savingsProgress: 0,
    debtProgress: 0,
    loading: true,
  });

  const [extendedStats, setExtendedStats] = useState<ExtendedStats>({
    cumulativeSavings: 0,
    mainAccountBalance: 0,
    monthlyDebts: 0,
    annualCharges: 0,
    financialHealth: 0,
  });

  const [chartData, setChartData] = useState<DashboardChartData | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isMountedRef = useRef(true);
  const lastCalculationRef = useRef<number>(0);

  // ✅ FILTRES LES TRANSACTIONS SELON LES CRITÈRES
  const getFilteredTransactions = useCallback((): Transaction[] => {
    const { year, month, accountId } = filters;
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const matchesYear = transactionDate.getFullYear() === year;
      const matchesMonth = transactionDate.getMonth() + 1 === month;
      const matchesAccount = !accountId || transaction.accountId === accountId;
      
      return matchesYear && matchesMonth && matchesAccount;
    });
  }, [transactions, filters]);

  // ✅ CALCUL DE LA SANTÉ FINANCIÈRE
  const calculateFinancialHealth = useCallback((
    netFlow: number,
    monthlyIncome: number,
    totalBalance: number,
    monthlyExpenses: number,
    cumulativeSavings: number
  ): number => {
    let score = 100;

    // Ratio épargne (40% du score)
    const savingsRate = monthlyIncome > 0 ? (netFlow / monthlyIncome) * 100 : 0;
    if (savingsRate >= 20) score += 20;
    else if (savingsRate >= 15) score += 15;
    else if (savingsRate >= 10) score += 10;
    else if (savingsRate >= 5) score += 5;
    else if (savingsRate < 0) score -= 20;

    // Fonds d'urgence (30% du score)
    const emergencyFundMonths = monthlyExpenses > 0 ? cumulativeSavings / monthlyExpenses : 0;
    if (emergencyFundMonths >= 6) score += 30;
    else if (emergencyFundMonths >= 3) score += 20;
    else if (emergencyFundMonths >= 1) score += 10;
    else score -= 10;

    // Stabilité des comptes (20% du score)
    if (totalBalance > 0) score += 20;
    else if (totalBalance < 0) score -= 20;

    // Dettes (10% du score)
    const debtRatio = monthlyExpenses > 0 ? extendedStats.monthlyDebts / monthlyExpenses : 0;
    if (debtRatio < 0.3) score += 10;
    else if (debtRatio > 0.5) score -= 10;

    return Math.max(0, Math.min(100, Math.round(score)));
  }, [extendedStats.monthlyDebts]);

  // ✅ CALCULS COMPLETS DES STATISTIQUES
  const calculateStats = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;
    
    const now = Date.now();
    // Éviter les calculs trop fréquents (min 2 secondes entre chaque)
    if (now - lastCalculationRef.current < 2000) {
      return;
    }
    lastCalculationRef.current = now;

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 [useDashboard] Calcul des stats avec filtres:', filters);
      
      const filteredTransactions = getFilteredTransactions();
      const { year, month, accountId } = filters;

      // Calcul des revenus/dépenses du mois filtré
      const monthlyIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const monthlyExpenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const netFlow = monthlyIncome - monthlyExpenses;

      // Solde total des comptes
      const totalBalance = accountId 
        ? accounts.find(acc => acc.id === accountId)?.balance || 0
        : accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

      // Compte principal (le compte avec le plus gros solde)
      const mainAccount = accounts.length > 0 
        ? accounts.reduce((prev, current) => 
            (prev.balance > current.balance) ? prev : current
          )
        : null;

      // Épargne cumulative (tous les objectifs)
      const cumulativeSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

      // Dettes du mois (paiements mensuels des dettes actives)
      const monthlyDebts = debts
        .filter(debt => debt.status === 'active' || debt.status === 'overdue')
        .reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0);

      // Charges annuelles (total des charges non payées)
      const annualChargesTotal = charges
        .filter(charge => !charge.isPaid)
        .reduce((sum, charge) => sum + charge.amount, 0);

      // Santé financière
      const financialHealth = calculateFinancialHealth(
        netFlow,
        monthlyIncome,
        totalBalance,
        monthlyExpenses,
        cumulativeSavings
      );

      // Transactions récentes (7 derniers jours)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentTransactions = transactions
        .filter(t => new Date(t.date) >= sevenDaysAgo)
        .slice(0, 5)
        .map(transaction => ({
          ...transaction,
          // Assurer que toutes les propriétés requises sont présentes
          currency: transaction.currency || 'MAD',
          createdAt: transaction.createdAt || new Date().toISOString()
        }));

      // Données pour les graphiques
      const chartDataResult = await chartDataService.getDashboardChartData(
        transactions,
        accounts,
        [], // budgets - à implémenter si disponible
        goals,
        userId
      );

      if (isMountedRef.current) {
        setStats({
          totalBalance,
          monthlyIncome,
          monthlyExpenses,
          netFlow,
          accountsCount: accounts.length,
          transactionsCount: filteredTransactions.length,
          recentTransactions,
          netWorth: totalBalance,
          budgetPerformance: {
            totalBudget: 0,
            totalSpent: 0,
            utilizationRate: 0,
            overBudgetCount: 0,
          },
          savingsProgress: goals.length > 0 
            ? (cumulativeSavings / goals.reduce((sum, goal) => sum + goal.targetAmount, 1)) * 100 
            : 0,
          debtProgress: debts.length > 0
            ? ((debts.reduce((sum, debt) => sum + debt.initialAmount, 0) - 
                debts.reduce((sum, debt) => sum + debt.currentAmount, 0)) / 
                debts.reduce((sum, debt) => sum + debt.initialAmount, 1)) * 100
            : 0,
          loading: false,
        });

        setExtendedStats({
          cumulativeSavings,
          mainAccountBalance: mainAccount?.balance || 0,
          monthlyDebts,
          annualCharges: annualChargesTotal,
          financialHealth,
        });

        setChartData(chartDataResult);
      }

      console.log('✅ [useDashboard] Stats calculées:', {
        solde: totalBalance,
        revenus: monthlyIncome,
        dépenses: monthlyExpenses,
        santé: financialHealth
      });

    } catch (error) {
      console.error('💥 [useDashboard] Erreur calcul stats:', error);
      if (isMountedRef.current) {
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
        setStats(prev => ({
          ...prev,
          loading: false,
        }));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [
    accounts, 
    transactions, 
    debts, 
    goals, 
    charges, 
    filters, 
    getFilteredTransactions, 
    calculateFinancialHealth,
    userId
  ]);

  // ✅ MISE À JOUR DES FILTRES
  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // ✅ RECHARGEMENT COMPLET
  const refreshDashboard = useCallback(async (): Promise<void> => {
    console.log('🔄 [useDashboard] Rechargement complet...');
    
    try {
      setError(null);
      setLoading(true);
      
      await Promise.all([
        refreshAccounts(),
        refreshTransactions(),
        refreshRecurringTransactions(),
        refreshAnnualCharges(),
        refreshDebts(),
        refreshGoals()
      ]);
      
      await calculateStats();
      
      console.log('✅ [useDashboard] Rechargement terminé');
    } catch (error) {
      console.error('❌ [useDashboard] Erreur rechargement:', error);
      setError('Erreur lors du rechargement des données');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [
    refreshAccounts,
    refreshTransactions,
    refreshRecurringTransactions,
    refreshAnnualCharges,
    refreshDebts,
    refreshGoals,
    calculateStats
  ]);

  // ✅ RECHARGEMENT DES STATS SEULEMENT
  const recalculateStats = useCallback(async (): Promise<void> => {
    await calculateStats();
  }, [calculateStats]);

  // ✅ EFFACER LES ERREURS
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ CHARGEMENT AUTOMATIQUE AU MONTAGE
  useEffect(() => {
    isMountedRef.current = true;
    
    const initDashboard = async (): Promise<void> => {
      if (isMountedRef.current) {
        await calculateStats();
      }
    };

    initDashboard();

    return () => {
      isMountedRef.current = false;
    };
  }, [calculateStats]);

  // ✅ RECHARGEMENT QUAND LES FILTRES OU DONNÉES CHANGENT
  useEffect(() => {
    if (isMountedRef.current) {
      calculateStats();
    }
  }, [filters, calculateStats]);

  const isLoading = accountsLoading || transactionsLoading || recurringLoading || 
                   chargesLoading || debtsLoading || savingsLoading || loading;

  return {
    // État principal
    stats,
    extendedStats,
    chartData,
    filters,
    loading: isLoading,
    error,
    
    // Actions
    refreshDashboard,
    updateFilters,
    recalculateStats,
    clearError,
    
    // Données brutes
    accounts,
    transactions: getFilteredTransactions(),
    recurringTransactions,
    charges,
    debts,
    goals,
  };
};

export default useDashboard;